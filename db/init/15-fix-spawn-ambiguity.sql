-- Fix spawn function - resolve column ambiguity
DROP FUNCTION IF EXISTS spawn_items_for_player(integer);

CREATE OR REPLACE FUNCTION spawn_items_for_player(p_player INT)
RETURNS TABLE(ret_item_id INT, name TEXT, rarity TEXT, item_type TEXT, quantity INT) AS $$
DECLARE
  spawned_items RECORD;
BEGIN
  PERFORM set_config('app.event_reason','MAGIC_CRYSTAL_SPAWN', true);
  
  -- Create temporary table to store what gets spawned
  CREATE TEMP TABLE temp_spawned (spawn_item_id INT, spawn_qty INT) ON COMMIT DROP;
  
  -- Determine what items spawn based on chance
  INSERT INTO temp_spawned (spawn_item_id, spawn_qty)
  SELECT sr.item_id, sr.qty_per_spawn
  FROM spawn_rules sr
  WHERE sr.base_spawn = TRUE
    AND random() * 100 <= sr.spawn_chance;
  
  -- Add spawned items to player inventory
  INSERT INTO inventory(player_id, item_id, qty)
  SELECT p_player, t.spawn_item_id, t.spawn_qty
  FROM temp_spawned t
  ON CONFLICT (player_id, item_id) 
  DO UPDATE SET qty = inventory.qty + EXCLUDED.qty;

  -- Return the items that were spawned
  RETURN QUERY
  SELECT t.spawn_item_id, i.name, i.rarity, i.item_type, t.spawn_qty
  FROM temp_spawned t
  JOIN items i ON i.item_id = t.spawn_item_id;
END;
$$ LANGUAGE plpgsql;