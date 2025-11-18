-- 10-comprehensive-items.sql
-- Complete 100-item medieval crafting system

-- First, let's add the item_type column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS item_type TEXT CHECK (item_type IN ('material','weapon','armor','magic','tool')) DEFAULT 'material';

-- Update existing items with types
UPDATE items SET item_type = 'material' WHERE name IN ('Wood', 'Stone', 'Iron Ore', 'Crystal', 'Dragon Scale', 'Iron Ingot');
UPDATE items SET item_type = 'weapon' WHERE name IN ('Wooden Sword', 'Stone Spear', 'Iron Sword', 'Dragon Blade');
UPDATE items SET item_type = 'magic' WHERE name = 'Fireball';

-- Clear existing items and start fresh with the comprehensive list
TRUNCATE recipes CASCADE;
TRUNCATE spawn_rules CASCADE;
DELETE FROM items WHERE item_id > 0;

-- TIER 1: BASE MATERIALS (spawnable, common)
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(1, 'Wood', 'common', 'material', 0, 0),
(2, 'Stone', 'common', 'material', 0, 0),
(3, 'Iron Ore', 'common', 'material', 0, 0),
(4, 'Copper Ore', 'common', 'material', 0, 0),
(5, 'Fiber', 'common', 'material', 0, 0),
(6, 'Water', 'common', 'material', 0, 0),
(7, 'Clay', 'common', 'material', 0, 0),
(8, 'Coal', 'common', 'material', 0, 0),
(9, 'Herb', 'common', 'material', 0, 0),
(10, 'Sand', 'common', 'material', 0, 0);

-- TIER 2: EXTREMELY RARE MATERIALS (spawnable, very rare)
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(11, 'Dragon Scale', 'legendary', 'material', 0, 0),
(12, 'Phoenix Feather', 'legendary', 'material', 0, 0),
(13, 'Demon Horn', 'epic', 'material', 0, 0),
(14, 'Angel Tear', 'epic', 'material', 0, 0),
(15, 'Shadow Essence', 'rare', 'material', 0, 0),
(16, 'Sun Crystal', 'epic', 'material', 0, 0),
(17, 'Frost Core', 'rare', 'material', 0, 0),
(18, 'Lightning Shard', 'epic', 'material', 0, 0),
(19, 'Blood Stone', 'rare', 'material', 0, 0),
(20, 'Star Fragment', 'legendary', 'material', 0, 0);

-- TIER 3: REFINED MATERIALS (crafted from base/rare)
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(21, 'Iron Ingot', 'common', 'material', 0, 5),
(22, 'Copper Ingot', 'common', 'material', 0, 5),
(23, 'Bronze Ingot', 'common', 'material', 0, 7),
(24, 'Steel Ingot', 'rare', 'material', 0, 10),
(25, 'Leather Strip', 'common', 'material', 0, 3),
(26, 'Rope', 'common', 'material', 0, 4),
(27, 'Glass', 'common', 'material', 0, 8),
(28, 'Magic Essence', 'rare', 'material', 0, 15),
(29, 'Enchanted Cloth', 'rare', 'material', 0, 12),
(30, 'Polished Stone', 'common', 'material', 0, 5),
(31, 'Hardened Clay', 'common', 'material', 0, 6),
(32, 'Alchemy Crystal', 'epic', 'material', 0, 20),
(33, 'Iron Handle', 'common', 'material', 0, 5),
(34, 'Steel Handle', 'rare', 'material', 0, 8),
(35, 'Bowstring', 'common', 'material', 0, 6),
(36, 'Arcane Dust', 'rare', 'material', 0, 10),
(37, 'Mystic Gem', 'epic', 'material', 0, 25),
(38, 'Fire Crystal', 'rare', 'material', 0, 15),
(39, 'Ice Crystal', 'rare', 'material', 0, 15),
(40, 'Lightning Core', 'rare', 'material', 0, 15);

-- TIER 4: WEAPONS & TOOLS (crafted)
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(41, 'Wooden Sword', 'common', 'weapon', 10, 5),
(42, 'Stone Axe', 'common', 'tool', 12, 6),
(43, 'Iron Sword', 'common', 'weapon', 20, 10),
(44, 'Steel Sword', 'rare', 'weapon', 25, 15),
(45, 'Bronze Dagger', 'common', 'weapon', 18, 8),
(46, 'War Hammer', 'rare', 'weapon', 30, 18),
(47, 'Bow', 'common', 'weapon', 18, 10),
(48, 'Crossbow', 'rare', 'weapon', 22, 15),
(49, 'Fire Wand', 'epic', 'magic', 35, 25),
(50, 'Ice Wand', 'epic', 'magic', 35, 25),
(51, 'Thunder Wand', 'epic', 'magic', 38, 30),
(52, 'Poison Dagger', 'rare', 'weapon', 28, 20),
(53, 'Longsword', 'rare', 'weapon', 30, 20),
(54, 'Battle Axe', 'rare', 'weapon', 32, 22),
(55, 'Spear', 'common', 'weapon', 24, 12),
(56, 'Mace', 'common', 'weapon', 28, 15),
(57, 'Shuriken', 'common', 'weapon', 20, 8),
(58, 'Pickaxe', 'common', 'tool', 15, 10),
(59, 'Torch', 'common', 'tool', 8, 3),
(60, 'Staff', 'rare', 'magic', 18, 12),
(61, 'Wand Core', 'common', 'material', 0, 10),
(62, 'Magic Rod', 'rare', 'magic', 22, 15),
(63, 'Dragon Spear', 'legendary', 'weapon', 45, 35),
(64, 'Shadow Blade', 'epic', 'weapon', 40, 30),
(65, 'Sun Hammer', 'legendary', 'weapon', 45, 35);

-- TIER 5: ARMOR & DEFENSE ITEMS
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(66, 'Leather Armor', 'common', 'armor', 0, 12),
(67, 'Iron Armor', 'common', 'armor', 0, 20),
(68, 'Steel Armor', 'rare', 'armor', 0, 30),
(69, 'Bronze Armor', 'common', 'armor', 0, 25),
(70, 'Dragon Armor', 'legendary', 'armor', 0, 50),
(71, 'Phoenix Armor', 'legendary', 'armor', 0, 50),
(72, 'Frost Armor', 'epic', 'armor', 0, 40),
(73, 'Lightning Armor', 'epic', 'armor', 0, 40),
(74, 'Shadow Cloak', 'epic', 'armor', 0, 35),
(75, 'Holy Robe', 'epic', 'armor', 0, 35),
(76, 'Stone Shield', 'common', 'armor', 0, 15),
(77, 'Iron Shield', 'common', 'armor', 0, 18),
(78, 'Steel Shield', 'rare', 'armor', 0, 25),
(79, 'Dragon Shield', 'legendary', 'armor', 0, 45),
(80, 'Magic Barrier', 'epic', 'armor', 0, 30),
(81, 'Blood Amulet', 'rare', 'armor', 0, 20),
(82, 'Frost Amulet', 'rare', 'armor', 0, 18),
(83, 'Flame Ring', 'rare', 'armor', 0, 18),
(84, 'Lightning Ring', 'rare', 'armor', 0, 20),
(85, 'Star Crown', 'epic', 'armor', 0, 35);

-- TIER 6: LEGENDARY & MAGICAL ITEMS
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(86, 'Dragon Sword', 'legendary', 'weapon', 50, 60),
(87, 'Phoenix Wand', 'legendary', 'magic', 50, 60),
(88, 'Holy Blade', 'legendary', 'weapon', 50, 60),
(89, 'Demon Mace', 'legendary', 'weapon', 48, 55),
(90, 'Star Staff', 'legendary', 'magic', 45, 50),
(91, 'Frost Spear', 'epic', 'weapon', 45, 45),
(92, 'Thunder Bow', 'epic', 'weapon', 45, 45),
(93, 'Blood Sword', 'epic', 'weapon', 45, 45),
(94, 'Sun Axe', 'epic', 'weapon', 48, 50),
(95, 'Shadow Wand', 'epic', 'magic', 45, 45),
(96, 'Dragon Hammer', 'legendary', 'weapon', 50, 60),
(97, 'Celestial Armor', 'legendary', 'armor', 0, 65),
(98, 'Eternal Blade', 'legendary', 'weapon', 55, 80),
(99, 'Chrono Staff', 'legendary', 'magic', 55, 80),
(100, 'Infinity Relic', 'legendary', 'magic', 0, 120);

-- Reset the sequence to continue from 101
SELECT setval('items_item_id_seq', 100, true);