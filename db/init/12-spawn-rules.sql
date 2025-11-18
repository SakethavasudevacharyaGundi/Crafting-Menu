-- 12-spawn-rules.sql  
-- Spawn rules for base and rare materials with proper balancing

-- Add spawn_chance column to spawn_rules table
ALTER TABLE spawn_rules ADD COLUMN IF NOT EXISTS spawn_chance DECIMAL(5,2) DEFAULT 50.00;
ALTER TABLE spawn_rules ADD COLUMN IF NOT EXISTS base_spawn BOOLEAN DEFAULT TRUE;

-- Clear existing spawn rules and rebuild
TRUNCATE spawn_rules;

-- TIER 1: BASE MATERIALS (Common spawns - high frequency, high chance)
INSERT INTO spawn_rules (item_id, interval_seconds, qty_per_spawn, spawn_chance, base_spawn) VALUES
(1, 3, 1, 90.00, TRUE),   -- Wood: every 3 sec, 90% chance
(2, 3, 1, 90.00, TRUE),   -- Stone: every 3 sec, 90% chance  
(3, 5, 1, 60.00, TRUE),   -- Iron Ore: every 5 sec, 60% chance
(4, 5, 1, 60.00, TRUE),   -- Copper Ore: every 5 sec, 60% chance
(5, 4, 1, 70.00, TRUE),   -- Fiber: every 4 sec, 70% chance
(6, 2, 1, 95.00, TRUE),   -- Water: every 2 sec, 95% chance
(7, 6, 1, 50.00, TRUE),   -- Clay: every 6 sec, 50% chance
(8, 8, 1, 40.00, TRUE),   -- Coal: every 8 sec, 40% chance
(9, 5, 1, 65.00, TRUE),   -- Herb: every 5 sec, 65% chance
(10, 4, 1, 75.00, TRUE);  -- Sand: every 4 sec, 75% chance

-- TIER 2: EXTREMELY RARE MATERIALS (Legendary spawns - low frequency, very low chance)
INSERT INTO spawn_rules (item_id, interval_seconds, qty_per_spawn, spawn_chance, base_spawn) VALUES
(11, 120, 1, 0.75, TRUE),  -- Dragon Scale: every 2 min, 0.75% chance
(12, 150, 1, 0.50, TRUE),  -- Phoenix Feather: every 2.5 min, 0.5% chance
(13, 90, 1, 1.50, TRUE),   -- Demon Horn: every 1.5 min, 1.5% chance
(14, 100, 1, 1.25, TRUE),  -- Angel Tear: every 1.67 min, 1.25% chance
(15, 60, 1, 2.00, TRUE),   -- Shadow Essence: every 1 min, 2% chance
(16, 80, 1, 1.75, TRUE),   -- Sun Crystal: every 1.33 min, 1.75% chance
(17, 70, 1, 2.25, TRUE),   -- Frost Core: every 1.17 min, 2.25% chance
(18, 85, 1, 1.50, TRUE),   -- Lightning Shard: every 1.42 min, 1.5% chance
(19, 75, 1, 2.00, TRUE),   -- Blood Stone: every 1.25 min, 2% chance
(20, 180, 1, 0.25, TRUE);  -- Star Fragment: every 3 min, 0.25% chance

-- Update spawn_items_for_player function to use new spawn_chance column
-- This function will be called by the Magic Crystal system