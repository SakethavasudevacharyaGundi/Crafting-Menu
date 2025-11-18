-- 19-spawn-random-materials-and-instances.sql
-- Adds spawn_instances table and a random spawn function using item rarity

-- Table to hold ephemeral spawned instances (click-to-collect)
CREATE TABLE IF NOT EXISTS spawn_instances (
  spawn_id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT now()
);

-- Function: spawn_random_materials(p_count)
-- Picks random MATERIAL items biased by rarity tiers.
-- Returns p_count rows with item info and a quantity (usually 1)
CREATE OR REPLACE FUNCTION spawn_random_materials(p_count INT DEFAULT 1)
RETURNS TABLE(item_id INT, item_name TEXT, rarity TEXT, icon_path TEXT, quantity INT)
LANGUAGE plpgsql AS $$
DECLARE
  want_count INT := GREATEST(1, LEAST(3, COALESCE(p_count, 1)));
  picked_ids INT[] := ARRAY[]::INT[];
  pick RECORD;
  roll FLOAT;
  tries INT := 0;
BEGIN
  WHILE array_length(picked_ids,1) IS DISTINCT FROM want_count AND tries < 20 LOOP
    tries := tries + 1;
    roll := random(); -- 0..1

    -- Choose pool by rarity
    IF roll < 0.02 THEN
      SELECT i.item_id, i.name AS item_name, i.rarity
      INTO pick
      FROM items i
      WHERE i.item_type = 'material' AND i.rarity = 'legendary' AND NOT (i.item_id = ANY(picked_ids))
      ORDER BY random()
      LIMIT 1;
    ELSIF roll < 0.10 THEN
      SELECT i.item_id, i.name AS item_name, i.rarity
      INTO pick
      FROM items i
      WHERE i.item_type = 'material' AND i.rarity IN ('epic','rare') AND NOT (i.item_id = ANY(picked_ids))
      ORDER BY random()
      LIMIT 1;
    ELSE
      SELECT i.item_id, i.name AS item_name, i.rarity
      INTO pick
      FROM items i
      WHERE i.item_type = 'material' AND i.rarity = 'common' AND NOT (i.item_id = ANY(picked_ids))
      ORDER BY random()
      LIMIT 1;
    END IF;

    IF pick IS NULL THEN
      -- Fallback: any material not yet picked
      SELECT i.item_id, i.name AS item_name, i.rarity
      INTO pick
      FROM items i
      WHERE i.item_type = 'material' AND NOT (i.item_id = ANY(picked_ids))
      ORDER BY random()
      LIMIT 1;
    END IF;

    IF pick IS NOT NULL THEN
      picked_ids := array_append(picked_ids, pick.item_id);
    END IF;
  END LOOP;

  -- Return distinct selections with quantity 1
  RETURN QUERY
  SELECT i.item_id, i.name, i.rarity, NULL::TEXT AS icon_path, 1 AS quantity
  FROM items i
  WHERE i.item_id = ANY(picked_ids);
END;
$$;
