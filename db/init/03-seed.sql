-- 03-seed.sql

-- add a demo player
INSERT INTO players (name) VALUES ('demo_player');

-- base items
INSERT INTO items (name, rarity, base_attack, craft_time_seconds)
VALUES
  ('Wood', 'Common', 0, 0),
  ('Stone', 'Common', 0, 0),
  ('Iron Ore', 'Uncommon', 0, 0),
  ('Crystal', 'Rare', 0, 0),
  ('Dragon Scale', 'VeryRare', 0, 0),
  ('Iron Ingot', 'Uncommon', 2, 5),
  ('Wooden Sword', 'Common', 10, 2),
  ('Stone Spear', 'Uncommon', 15, 3),
  ('Iron Sword', 'Uncommon', 25, 8),
  ('Fireball', 'Rare', 35, 10),
  ('Dragon Blade', 'VeryRare', 50, 15)
ON CONFLICT (name) DO NOTHING;

-- recipes (use subselects to get ids)
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity)
VALUES
  ((SELECT item_id FROM items WHERE name='Iron Ingot'),
   (SELECT item_id FROM items WHERE name='Iron Ore'), 3),
  ((SELECT item_id FROM items WHERE name='Wooden Sword'),
   (SELECT item_id FROM items WHERE name='Wood'), 2),
  ((SELECT item_id FROM items WHERE name='Stone Spear'),
   (SELECT item_id FROM items WHERE name='Stone'), 2),
  ((SELECT item_id FROM items WHERE name='Stone Spear'),
   (SELECT item_id FROM items WHERE name='Wood'), 1),
  ((SELECT item_id FROM items WHERE name='Iron Sword'),
   (SELECT item_id FROM items WHERE name='Iron Ingot'), 2),
  ((SELECT item_id FROM items WHERE name='Iron Sword'),
   (SELECT item_id FROM items WHERE name='Wood'), 1),
  ((SELECT item_id FROM items WHERE name='Fireball'),
   (SELECT item_id FROM items WHERE name='Crystal'), 1),
  ((SELECT item_id FROM items WHERE name='Fireball'),
   (SELECT item_id FROM items WHERE name='Iron Ore'), 2),
  ((SELECT item_id FROM items WHERE name='Dragon Blade'),
   (SELECT item_id FROM items WHERE name='Iron Ingot'), 1),
  ((SELECT item_id FROM items WHERE name='Dragon Blade'),
   (SELECT item_id FROM items WHERE name='Dragon Scale'), 1)
ON CONFLICT DO NOTHING;

-- spawn rules: item auto-generation rates
INSERT INTO spawn_rules (item_id, interval_seconds, qty_per_spawn)
VALUES
  ((SELECT item_id FROM items WHERE name='Wood'), 1, 1),
  ((SELECT item_id FROM items WHERE name='Stone'), 10, 1),
  ((SELECT item_id FROM items WHERE name='Iron Ore'), 20, 1),
  ((SELECT item_id FROM items WHERE name='Crystal'), 60, 1)
ON CONFLICT DO NOTHING;

-- give demo player some starting inventory
INSERT INTO inventory (player_id, item_id, qty)
VALUES
 ((SELECT player_id FROM players WHERE name='demo_player'),
  (SELECT item_id FROM items WHERE name='Wood'), 5)
ON CONFLICT (player_id, item_id) DO UPDATE SET qty = inventory.qty + EXCLUDED.qty;

-- sample monsters
INSERT INTO monsters (name, max_hp, defense, reward_item_id, reward_qty, spawn_level)
VALUES
  ('Slime', 50, 0,
   (SELECT item_id FROM items WHERE name='Wood'), 5, 1),
  ('Stone Golem', 120, 5,
   (SELECT item_id FROM items WHERE name='Stone'), 10, 2),
  ('Iron Beast', 300, 8,
   (SELECT item_id FROM items WHERE name='Iron Ore'), 15, 3),
  ('Dragon', 1000, 10,
   (SELECT item_id FROM items WHERE name='Dragon Scale'), 1, 10)
ON CONFLICT DO NOTHING;

-- Initialize dragon for demo player
INSERT INTO player_monsters (player_id, monster_id, current_hp, state)
VALUES
  ((SELECT player_id FROM players WHERE name='demo_player'),
   (SELECT monster_id FROM monsters WHERE name='Dragon'),
   1000, 'ALIVE')
ON CONFLICT DO NOTHING;
