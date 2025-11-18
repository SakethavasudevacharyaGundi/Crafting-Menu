-- 07-indexes.sql
-- INDEXES FOR PERFORMANCE

-- Inventory lookup: player + item (already PK but reassert)
CREATE INDEX IF NOT EXISTS idx_inventory_player ON inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_inventory_item ON inventory(item_id);

-- Recipes: lookup ingredients and results
CREATE INDEX IF NOT EXISTS idx_recipes_result ON recipes(result_item_id);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredient ON recipes(ingredient_item_id);

-- Events: by player and time
CREATE INDEX IF NOT EXISTS idx_events_player ON events(player_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(created_at);

-- Monsters: fast spawn lookup
CREATE INDEX IF NOT EXISTS idx_monsters_spawn ON monsters(spawn_level);

-- Player-monster: fast lookup in combat
CREATE INDEX IF NOT EXISTS idx_player_monster_state ON player_monsters(player_id, monster_id, state);

-- Craft queue: quick scan for ready queue items
CREATE INDEX IF NOT EXISTS idx_craftqueue_status_time ON craft_queue(status, finish_at);
