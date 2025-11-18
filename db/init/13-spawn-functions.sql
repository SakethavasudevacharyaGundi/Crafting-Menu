-- 13-spawn-functions.sql
-- Updated spawn functions for Magic Crystal system

-- Enhanced spawn function that uses spawn_chance and returns spawned items
CREATE OR REPLACE FUNCTION spawn_items_for_player(p_player INT)
RETURNS TABLE(item_id INT, name TEXT, rarity TEXT, item_type TEXT, quantity INT) AS $$
BEGIN
  PERFORM set_config('app.event_reason','MAGIC_CRYSTAL_SPAWN', true);
  
  -- Insert spawned items based on chance
  INSERT INTO inventory(player_id, item_id, qty)
  SELECT 
    p_player, 
    sr.item_id, 
    sr.qty_per_spawn
  FROM spawn_rules sr
  WHERE sr.base_spawn = TRUE
    AND random() * 100 <= sr.spawn_chance
  ON CONFLICT (player_id, item_id) 
  DO UPDATE SET qty = inventory.qty + EXCLUDED.qty;

  -- Return the items that were actually spawned
  RETURN QUERY
  SELECT 
    sr.item_id,
    i.name,
    i.rarity,
    i.item_type,
    sr.qty_per_spawn
  FROM spawn_rules sr
  JOIN items i ON i.item_id = sr.item_id
  WHERE sr.base_spawn = TRUE
    AND random() * 100 <= sr.spawn_chance;
END;
$$ LANGUAGE plpgsql;

-- Function to get available craftable items for a player
CREATE OR REPLACE FUNCTION get_craftable_items(p_player INT)
RETURNS TABLE(
  item_id INT, 
  name TEXT, 
  rarity TEXT, 
  item_type TEXT, 
  base_attack INT, 
  craft_time_seconds INT,
  can_craft BOOLEAN,
  missing_materials JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH craftable_check AS (
    SELECT 
      i.item_id,
      i.name,
      i.rarity,
      i.item_type,
      i.base_attack,
      i.craft_time_seconds,
      CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM check_requirements(p_player, i.item_id, 1) cr 
          WHERE cr.have < cr.need
        ) THEN TRUE 
        ELSE FALSE 
      END as can_craft,
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'item_id', cr.item_id,
            'need', cr.need,
            'have', cr.have,
            'missing', cr.need - cr.have
          )
        )
        FROM check_requirements(p_player, i.item_id, 1) cr 
        WHERE cr.have < cr.need
      ) as missing_materials
    FROM items i
    WHERE EXISTS (SELECT 1 FROM recipes r WHERE r.result_item_id = i.item_id)
  )
  SELECT * FROM craftable_check ORDER BY 
    can_craft DESC, 
    CASE craftable_check.rarity 
      WHEN 'legendary' THEN 4 
      WHEN 'epic' THEN 3 
      WHEN 'rare' THEN 2 
      WHEN 'common' THEN 1 
      ELSE 0 
    END DESC,
    craftable_check.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get recipe ingredients for an item
CREATE OR REPLACE FUNCTION get_item_recipe(p_item_id INT)
RETURNS TABLE(
  ingredient_id INT,
  ingredient_name TEXT,
  ingredient_rarity TEXT,
  ingredient_type TEXT,
  quantity INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.item_id,
    i.name,
    i.rarity,
    i.item_type,
    r.quantity
  FROM recipes r
  JOIN items i ON i.item_id = r.ingredient_item_id
  WHERE r.result_item_id = p_item_id
  ORDER BY r.quantity DESC, i.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get player inventory with item details
CREATE OR REPLACE FUNCTION get_player_inventory(p_player INT)
RETURNS TABLE(
  item_id INT,
  name TEXT,
  rarity TEXT,
  item_type TEXT,
  base_attack INT,
  quantity BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.item_id,
    i.name,
    i.rarity,
    i.item_type,
    i.base_attack,
    inv.qty
  FROM inventory inv
  JOIN items i ON i.item_id = inv.item_id
  WHERE inv.player_id = p_player
    AND inv.qty > 0
  ORDER BY 
    CASE i.item_type
      WHEN 'material' THEN 1
      WHEN 'weapon' THEN 2
      WHEN 'armor' THEN 3
      WHEN 'magic' THEN 4
      WHEN 'tool' THEN 5
      ELSE 6
    END,
    CASE i.rarity 
      WHEN 'legendary' THEN 4 
      WHEN 'epic' THEN 3 
      WHEN 'rare' THEN 2 
      WHEN 'common' THEN 1 
      ELSE 0 
    END DESC,
    i.name;
END;
$$ LANGUAGE plpgsql;