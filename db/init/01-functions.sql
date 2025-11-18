-- 01-functions.sql

-- Expand a recipe into base ingredients (multiplied by p_multiplier)
CREATE OR REPLACE FUNCTION expand_recipe(p_result INT, p_multiplier BIGINT DEFAULT 1)
RETURNS TABLE(item_id INT, total_qty BIGINT) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE req(item_id, qty) AS (
    SELECT ingredient_item_id, quantity * p_multiplier
    FROM recipes
    WHERE result_item_id = p_result

    UNION ALL

    SELECT r.ingredient_item_id, r.quantity * req.qty
    FROM recipes r
    JOIN req ON r.result_item_id = req.item_id
  )
  SELECT req.item_id, SUM(req.qty)::BIGINT FROM req GROUP BY req.item_id;
END;
$$ LANGUAGE plpgsql;

-- Atomic craft function: expand recipe to base ingredients, check inventory, deduct, add product
CREATE OR REPLACE FUNCTION craft_item(p_player INT, p_result INT, p_qty INT)
RETURNS VOID AS $$
DECLARE
  rec RECORD;
BEGIN
  IF p_qty <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;

  -- temp table to hold required ingredients
  CREATE TEMP TABLE tmp_req(item_id INT PRIMARY KEY, qty BIGINT) ON COMMIT DROP;

  INSERT INTO tmp_req(item_id, qty)
  SELECT item_id, total_qty FROM expand_recipe(p_result, p_qty);

  -- If the recipe has no ingredients (base item), skip deduction
  IF NOT EXISTS (SELECT 1 FROM tmp_req) THEN
    -- just add the crafted item (e.g., crafting a base with zero ingredients)
    INSERT INTO inventory(player_id, item_id, qty)
      VALUES (p_player, p_result, p_qty)
      ON CONFLICT (player_id, item_id) DO UPDATE
        SET qty = inventory.qty + EXCLUDED.qty;
    RETURN;
  END IF;

  -- Lock all involved inventory rows to prevent races
  PERFORM 1 FROM inventory WHERE player_id = p_player LIMIT 1; -- ensure row exists (no-op)
  -- Check availability: left join inventory to tmp_req
  FOR rec IN
    SELECT t.item_id, t.qty AS need, COALESCE(i.qty,0) AS have
    FROM tmp_req t
    LEFT JOIN inventory i ON i.player_id = p_player AND i.item_id = t.item_id
  LOOP
    IF rec.have < rec.need THEN
      RAISE EXCEPTION 'Not enough material % (need %, have %)', rec.item_id, rec.need, rec.have;
    END IF;
  END LOOP;

  -- Set audit reason for this transaction
  PERFORM set_config('app.event_reason','CRAFT', true);

  -- Perform deductions
  UPDATE inventory inv
  SET qty = inv.qty - t.qty
  FROM tmp_req t
  WHERE inv.player_id = p_player AND inv.item_id = t.item_id;

  -- For any ingredient that had zero row (shouldn't happen due to check), ensure non-negative
  -- Add the crafted product
  INSERT INTO inventory(player_id, item_id, qty)
    VALUES (p_player, p_result, p_qty)
    ON CONFLICT (player_id, item_id) DO UPDATE
      SET qty = inventory.qty + EXCLUDED.qty;

  -- log event
  INSERT INTO events(player_id, event_type, payload)
  VALUES (p_player, 'CRAFT', jsonb_build_object('result_item_id', p_result, 'qty', p_qty, 'time', now()));

END;
$$ LANGUAGE plpgsql;

-- Quick spawn worker: give resources in batch to all players based on spawn_rules
CREATE OR REPLACE FUNCTION spawn_all_players()
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.event_reason','SPAWN', true);
  INSERT INTO inventory(player_id, item_id, qty)
  SELECT p.player_id, s.item_id, s.qty_per_spawn
  FROM spawn_rules s CROSS JOIN players p
  ON CONFLICT (player_id, item_id) DO UPDATE
    SET qty = inventory.qty + EXCLUDED.qty;
END;
$$ LANGUAGE plpgsql;

-- safer craft with advisory + row locks
CREATE OR REPLACE FUNCTION craft_item_locked(p_player INT, p_result INT, p_qty INT)
RETURNS VOID AS $$
DECLARE
  rec RECORD;
BEGIN
  IF p_qty <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;

  -- Serialize crafts per player (transaction-scoped lock)
  PERFORM pg_advisory_xact_lock(p_player);

  -- temp table of requirements
  CREATE TEMP TABLE tmp_req(item_id INT PRIMARY KEY, need_qty BIGINT) ON COMMIT DROP;

  INSERT INTO tmp_req(item_id, need_qty)
  SELECT item_id, total_qty FROM expand_recipe(p_result, p_qty);

  -- base item: just add
  IF NOT EXISTS (SELECT 1 FROM tmp_req) THEN
    PERFORM set_config('app.event_reason','CRAFT', true);
    INSERT INTO inventory(player_id, item_id, qty)
      VALUES (p_player, p_result, p_qty)
      ON CONFLICT (player_id, item_id) DO UPDATE
        SET qty = inventory.qty + EXCLUDED.qty;
    INSERT INTO events(player_id, event_type, payload)
    VALUES (p_player, 'CRAFT', jsonb_build_object('result_item', p_result, 'qty', p_qty, 'method','locked'));
    RETURN;
  END IF;

  -- Lock existing inventory rows for needed items in deterministic order
  PERFORM 1
  FROM inventory i
  JOIN tmp_req t ON t.item_id = i.item_id
  WHERE i.player_id = p_player
  ORDER BY i.item_id
  FOR UPDATE;

  -- Check availability
  FOR rec IN
    SELECT t.item_id, t.need_qty AS need, COALESCE(i.qty,0) AS have
    FROM tmp_req t
    LEFT JOIN inventory i ON i.player_id = p_player AND i.item_id = t.item_id
  LOOP
    IF rec.have < rec.need THEN
      RAISE EXCEPTION 'Not enough material % (need %, have %)', rec.item_id, rec.need, rec.have;
    END IF;
  END LOOP;

  -- Audit reason
  PERFORM set_config('app.event_reason','CRAFT', true);

  -- Deduct materials
  UPDATE inventory inv
  SET qty = inv.qty - t.need_qty
  FROM tmp_req t
  WHERE inv.player_id = p_player AND inv.item_id = t.item_id;

  -- Add product
  INSERT INTO inventory(player_id, item_id, qty)
    VALUES (p_player, p_result, p_qty)
    ON CONFLICT (player_id, item_id) DO UPDATE
      SET qty = inventory.qty + EXCLUDED.qty;

  INSERT INTO events(player_id, event_type, payload)
  VALUES (p_player, 'CRAFT', jsonb_build_object('result_item', p_result, 'qty', p_qty, 'method','locked'));

END;
$$ LANGUAGE plpgsql;

-- Non-blocking craft attempt; returns FALSE if lock unavailable or fails
CREATE OR REPLACE FUNCTION craft_item_try(p_player INT, p_result INT, p_qty INT)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT pg_try_advisory_xact_lock(p_player) THEN
    RETURN FALSE;
  END IF;
  PERFORM craft_item_locked(p_player, p_result, p_qty);
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Check requirements vs. inventory (non-locking)
CREATE OR REPLACE FUNCTION check_requirements(p_player INT, p_result INT, p_qty INT)
RETURNS TABLE(item_id INT, need BIGINT, have BIGINT) AS $$
BEGIN
  RETURN QUERY
  WITH req AS (
    SELECT item_id, total_qty FROM expand_recipe(p_result, p_qty)
  )
  SELECT r.item_id, r.total_qty AS need, COALESCE(i.qty,0) AS have
  FROM req r LEFT JOIN inventory i ON i.player_id = p_player AND i.item_id = r.item_id;
END;
$$ LANGUAGE plpgsql;

-- Fast craft using recipe_closure (with advisory + row locks)
CREATE OR REPLACE FUNCTION craft_item_fast_locked(p_player INT, p_result INT, p_qty INT)
RETURNS VOID AS $$
DECLARE
  rec RECORD;
BEGIN
  IF p_qty <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;

  PERFORM pg_advisory_xact_lock(p_player);

  CREATE TEMP TABLE tmp_req(item_id INT PRIMARY KEY, need_qty BIGINT) ON COMMIT DROP;

  -- Use precomputed closure for requirements
  INSERT INTO tmp_req(item_id, need_qty)
  SELECT child_item, total_qty * p_qty
  FROM recipe_closure
  WHERE parent_item = p_result;

  -- If no requirements exist, treat as base item
  IF NOT EXISTS (SELECT 1 FROM tmp_req) THEN
    PERFORM set_config('app.event_reason','CRAFT_FAST', true);
    INSERT INTO inventory(player_id, item_id, qty)
      VALUES (p_player, p_result, p_qty)
      ON CONFLICT (player_id, item_id) DO UPDATE
        SET qty = inventory.qty + EXCLUDED.qty;
    INSERT INTO events(player_id, event_type, payload)
    VALUES (p_player, 'CRAFT', jsonb_build_object('result_item', p_result, 'qty', p_qty, 'method','fast'));
    RETURN;
  END IF;

  -- Lock needed inventory rows in deterministic order
  PERFORM 1
  FROM inventory i
  JOIN tmp_req t ON t.item_id = i.item_id
  WHERE i.player_id = p_player
  ORDER BY i.item_id
  FOR UPDATE;

  -- Check availability
  FOR rec IN
    SELECT t.item_id, t.need_qty AS need, COALESCE(i.qty,0) AS have
    FROM tmp_req t
    LEFT JOIN inventory i ON i.player_id = p_player AND i.item_id = t.item_id
  LOOP
    IF rec.have < rec.need THEN
      RAISE EXCEPTION 'Not enough material % (need %, have %)', rec.item_id, rec.need, rec.have;
    END IF;
  END LOOP;

  -- Audit reason and perform updates
  PERFORM set_config('app.event_reason','CRAFT_FAST', true);

  UPDATE inventory inv
  SET qty = inv.qty - t.need_qty
  FROM tmp_req t
  WHERE inv.player_id = p_player AND inv.item_id = t.item_id;

  INSERT INTO inventory(player_id, item_id, qty)
    VALUES (p_player, p_result, p_qty)
    ON CONFLICT (player_id, item_id) DO UPDATE
      SET qty = inventory.qty + EXCLUDED.qty;

  INSERT INTO events(player_id, event_type, payload)
  VALUES (p_player, 'CRAFT', jsonb_build_object('result_item', p_result, 'qty', p_qty, 'method','fast'));

END;
$$ LANGUAGE plpgsql;

-- Optional craft queue helpers
CREATE OR REPLACE FUNCTION enqueue_craft(p_player INT, p_result INT, p_qty INT)
RETURNS VOID AS $$
DECLARE
  t INT;
BEGIN
  IF p_qty <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;
  SELECT craft_time_seconds INTO t FROM items WHERE item_id=p_result;
  IF t IS NULL THEN
    RAISE EXCEPTION 'Item % not found', p_result;
  END IF;
  INSERT INTO craft_queue(player_id,result_item_id,qty,
                          started_at,finish_at,status)
  VALUES (p_player,p_result,p_qty,now(),now()+make_interval(secs=>t*p_qty),'PENDING');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION complete_ready_crafts() RETURNS VOID AS $$
DECLARE rec RECORD;
BEGIN
  FOR rec IN
    SELECT * FROM craft_queue WHERE status='PENDING' AND finish_at<=now()
  LOOP
    PERFORM craft_item(rec.player_id,rec.result_item_id,rec.qty);
    UPDATE craft_queue SET status='DONE' WHERE queue_id=rec.queue_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
