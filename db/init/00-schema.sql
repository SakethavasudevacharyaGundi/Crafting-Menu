-- 00-schema.sql
-- Database schema for crafting demo

-- players
CREATE TABLE IF NOT EXISTS players (
  player_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- items
CREATE TABLE IF NOT EXISTS items (
  item_id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  rarity TEXT NOT NULL,
  base_attack INTEGER DEFAULT 0,
  craft_time_seconds INTEGER DEFAULT 0
);

-- recipes: result_item -> ingredient_item (BOM)
CREATE TABLE IF NOT EXISTS recipes (
  result_item_id INTEGER NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
  ingredient_item_id INTEGER NOT NULL REFERENCES items(item_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (result_item_id, ingredient_item_id)
);

-- inventory per player
CREATE TABLE IF NOT EXISTS inventory (
  player_id INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(item_id) ON DELETE CASCADE,
  qty BIGINT NOT NULL CHECK (qty >= 0),
  PRIMARY KEY (player_id, item_id)
);

-- spawn rules for auto-generation
CREATE TABLE IF NOT EXISTS spawn_rules (
  item_id INTEGER REFERENCES items(item_id) ON DELETE CASCADE,
  interval_seconds INTEGER NOT NULL CHECK (interval_seconds > 0),
  qty_per_spawn INTEGER NOT NULL CHECK (qty_per_spawn > 0),
  PRIMARY KEY (item_id)
);

-- craft queue (if using async crafts)
CREATE TABLE IF NOT EXISTS craft_queue (
  queue_id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
  result_item_id INTEGER REFERENCES items(item_id),
  qty INTEGER NOT NULL CHECK (qty > 0),
  started_at TIMESTAMP DEFAULT now(),
  finish_at TIMESTAMP,
  status TEXT DEFAULT 'PENDING' -- PENDING | DONE | CANCELED
);

-- Monsters master table
CREATE TABLE IF NOT EXISTS monsters (
  monster_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  max_hp BIGINT NOT NULL CHECK (max_hp > 0),
  defense INTEGER DEFAULT 0,
  reward_item_id INTEGER REFERENCES items(item_id),
  reward_qty INTEGER DEFAULT 1 CHECK (reward_qty > 0),
  spawn_level INTEGER DEFAULT 1
);

-- Monster instance per player (player vs monster state)
CREATE TABLE IF NOT EXISTS player_monsters (
  player_id INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
  monster_id INTEGER REFERENCES monsters(monster_id) ON DELETE CASCADE,
  current_hp BIGINT NOT NULL,
  state TEXT DEFAULT 'ALIVE' CHECK (state IN ('ALIVE','DEAD')),
  last_hit_ts TIMESTAMP DEFAULT now(),
  PRIMARY KEY (player_id, monster_id)
);

-- events / audit
CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  player_id INTEGER,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP DEFAULT now()
);
