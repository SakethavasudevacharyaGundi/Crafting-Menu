-- 18-spawn-rules-100.sql
-- Spawn rules for 100-item system

-- Clear existing spawn rules
TRUNCATE TABLE spawn_rules;

-- === BASE MATERIALS (Common spawns - high chance) ===
INSERT INTO spawn_rules (item_id, base_spawn, spawn_chance, interval_seconds, qty_per_spawn) VALUES
-- Very Common (60-80% chance)
(1, TRUE, 75, 30, 3),   -- Wood Log
(2, TRUE, 70, 35, 3),   -- Stone Chunk
(12, TRUE, 65, 40, 2),  -- Herb Leaf
(7, TRUE, 60, 45, 2),   -- Plant Fiber
(16, TRUE, 60, 40, 3),  -- Stick
(18, TRUE, 55, 45, 2),  -- String

-- Common (40-55% chance)
(3, TRUE, 50, 50, 2),   -- Iron Ore
(4, TRUE, 45, 55, 2),   -- Copper Ore
(5, TRUE, 50, 50, 2),   -- Coal
(8, TRUE, 40, 60, 3),   -- Sand
(9, TRUE, 40, 60, 2),   -- Clay
(10, TRUE, 45, 55, 1),  -- Water Flask

-- Less Common (20-35% chance)
(6, TRUE, 35, 70, 1),   -- Leather Scrap
(11, TRUE, 30, 75, 1),  -- Flax Thread
(13, TRUE, 25, 80, 1),  -- Bone Fragment
(14, TRUE, 30, 75, 1),  -- Animal Hide
(15, TRUE, 35, 70, 2),  -- Feather
(17, TRUE, 20, 90, 1),  -- Charcoal
(19, TRUE, 25, 85, 1),  -- Resin
(20, TRUE, 20, 90, 1);  -- Fish Oil

-- === RARE MATERIALS (Low spawn chance) ===
INSERT INTO spawn_rules (item_id, base_spawn, spawn_chance, interval_seconds, qty_per_spawn) VALUES
(21, TRUE, 8, 120, 1),   -- Gold Ore
(22, TRUE, 10, 110, 1),  -- Silver Ore
(23, TRUE, 12, 100, 1),  -- Crystal Shard
(24, TRUE, 5, 150, 1),   -- Mithril Ore
(25, TRUE, 3, 180, 1),   -- Dragon Scale
(26, TRUE, 6, 140, 1),   -- Obsidian
(27, TRUE, 4, 160, 1),   -- Phoenix Feather
(28, TRUE, 7, 130, 1),   -- Mana Essence
(29, TRUE, 2, 200, 1),   -- Ancient Relic
(30, TRUE, 5, 150, 1);   -- Tungsten Ore
