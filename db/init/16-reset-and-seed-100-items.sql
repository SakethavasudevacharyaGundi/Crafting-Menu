-- 16-reset-and-seed-100-items.sql
-- Complete reset and re-seed with 100-item system

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Clear existing data
TRUNCATE TABLE recipe_closure CASCADE;
TRUNCATE TABLE recipes CASCADE;
TRUNCATE TABLE craft_queue CASCADE;
TRUNCATE TABLE inventory_log CASCADE;
TRUNCATE TABLE inventory CASCADE;
DELETE FROM items WHERE item_id > 0;

-- Reset sequence
ALTER SEQUENCE items_item_id_seq RESTART WITH 1;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- === BASE MATERIALS (Spawnable, Common) - IDs 1-20 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(1, 'Wood Log', 'common', 'material', 0, 0),
(2, 'Stone Chunk', 'common', 'material', 0, 0),
(3, 'Iron Ore', 'common', 'material', 0, 0),
(4, 'Copper Ore', 'common', 'material', 0, 0),
(5, 'Coal', 'common', 'material', 0, 0),
(6, 'Leather Scrap', 'common', 'material', 0, 0),
(7, 'Plant Fiber', 'common', 'material', 0, 0),
(8, 'Sand', 'common', 'material', 0, 0),
(9, 'Clay', 'common', 'material', 0, 0),
(10, 'Water Flask', 'common', 'material', 0, 0),
(11, 'Flax Thread', 'common', 'material', 0, 0),
(12, 'Herb Leaf', 'common', 'material', 0, 0),
(13, 'Bone Fragment', 'common', 'material', 0, 0),
(14, 'Animal Hide', 'common', 'material', 0, 0),
(15, 'Feather', 'common', 'material', 0, 0),
(16, 'Stick', 'common', 'material', 0, 0),
(17, 'Charcoal', 'common', 'material', 0, 0),
(18, 'String', 'common', 'material', 0, 0),
(19, 'Resin', 'common', 'material', 0, 0),
(20, 'Fish Oil', 'common', 'material', 0, 0);

-- === RARE MATERIALS (Spawnable, Rare) - IDs 21-30 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(21, 'Gold Ore', 'rare', 'material', 0, 0),
(22, 'Silver Ore', 'rare', 'material', 0, 0),
(23, 'Crystal Shard', 'rare', 'material', 0, 0),
(24, 'Mithril Ore', 'rare', 'material', 0, 0),
(25, 'Dragon Scale', 'rare', 'material', 0, 0),
(26, 'Obsidian', 'rare', 'material', 0, 0),
(27, 'Phoenix Feather', 'rare', 'material', 0, 0),
(28, 'Mana Essence', 'rare', 'material', 0, 0),
(29, 'Ancient Relic', 'rare', 'material', 0, 0),
(30, 'Tungsten Ore', 'rare', 'material', 0, 0);

-- === COMPONENT MATERIALS (Craftable) - IDs 31-60 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(31, 'Iron Ingot', 'common', 'material', 0, 5),
(32, 'Copper Ingot', 'common', 'material', 0, 5),
(33, 'Gold Ingot', 'rare', 'material', 0, 8),
(34, 'Leather Strap', 'common', 'material', 0, 3),
(35, 'Wood Plank', 'common', 'material', 0, 2),
(36, 'Glass', 'common', 'material', 0, 4),
(37, 'Brick', 'common', 'material', 0, 4),
(38, 'Mana Dust', 'rare', 'material', 0, 6),
(39, 'Silver Ingot', 'rare', 'material', 0, 8),
(40, 'Mithril Bar', 'rare', 'material', 0, 10),
(41, 'Steel Ingot', 'common', 'material', 0, 7),
(42, 'Bronze Ingot', 'common', 'material', 0, 6),
(43, 'Cloth', 'common', 'material', 0, 3),
(44, 'Rope', 'common', 'material', 0, 2),
(45, 'Refined Leather', 'common', 'material', 0, 5),
(46, 'Dragon Leather', 'rare', 'material', 0, 10),
(47, 'Enchanted Gem', 'rare', 'material', 0, 12),
(48, 'Tungsten Bar', 'rare', 'material', 0, 10),
(49, 'Obsidian Blade', 'rare', 'material', 0, 8),
(50, 'Phoenix Down', 'rare', 'material', 0, 8),
(51, 'Magic Thread', 'rare', 'material', 0, 5),
(52, 'Ancient Steel', 'legendary', 'material', 0, 15),
(53, 'Crystal Core', 'rare', 'material', 0, 9),
(54, 'Dragon Bone', 'rare', 'material', 0, 12),
(55, 'Mystic Oil', 'rare', 'material', 0, 7),
(56, 'Enchanted Wood', 'rare', 'material', 0, 6),
(57, 'Holy Water', 'rare', 'material', 0, 5),
(58, 'Shadow Essence', 'rare', 'material', 0, 8),
(59, 'Light Crystal', 'rare', 'material', 0, 10),
(60, 'Dark Crystal', 'rare', 'material', 0, 10);

-- === WEAPONS (Products) - IDs 61-75 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(61, 'Steel Sword', 'common', 'weapon', 35, 15),
(62, 'Iron Dagger', 'common', 'weapon', 20, 10),
(63, 'Bow', 'common', 'weapon', 25, 12),
(64, 'Arrow', 'common', 'weapon', 5, 2),
(65, 'Fire Wand', 'rare', 'weapon', 45, 20),
(66, 'Ice Staff', 'rare', 'weapon', 50, 20),
(67, 'Thunder Hammer', 'rare', 'weapon', 60, 25),
(68, 'Dragon Blade', 'legendary', 'weapon', 85, 40),
(69, 'Mithril Sword', 'rare', 'weapon', 55, 30),
(70, 'Bronze Axe', 'common', 'weapon', 30, 15),
(71, 'Shadow Dagger', 'rare', 'weapon', 48, 22),
(72, 'Light Spear', 'rare', 'weapon', 52, 25),
(73, 'Ancient Sword', 'legendary', 'weapon', 90, 50),
(74, 'Crossbow', 'common', 'weapon', 28, 18),
(75, 'Phoenix Blade', 'legendary', 'weapon', 95, 45);

-- === ARMOR (Products) - IDs 76-85 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(76, 'Steel Armor', 'rare', 'armor', 0, 25),
(77, 'Leather Armor', 'common', 'armor', 0, 15),
(78, 'Mithril Armor', 'rare', 'armor', 0, 35),
(79, 'Dragon Armor', 'legendary', 'armor', 0, 50),
(80, 'Bronze Helmet', 'common', 'armor', 0, 10),
(81, 'Steel Shield', 'common', 'armor', 0, 18),
(82, 'Crystal Shield', 'rare', 'armor', 0, 28),
(83, 'Phoenix Armor', 'legendary', 'armor', 0, 55),
(84, 'Shadow Cloak', 'rare', 'armor', 0, 22),
(85, 'Light Armor', 'rare', 'armor', 0, 25);

-- === CONSUMABLES (Products) - IDs 86-95 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(86, 'Mana Potion', 'rare', 'tool', 0, 8),
(87, 'Healing Potion', 'common', 'tool', 0, 6),
(88, 'Strength Elixir', 'rare', 'tool', 0, 10),
(89, 'Speed Potion', 'common', 'tool', 0, 7),
(90, 'Invisibility Potion', 'rare', 'tool', 0, 12),
(91, 'Fire Resistance Potion', 'rare', 'tool', 0, 9),
(92, 'Ice Resistance Potion', 'rare', 'tool', 0, 9),
(93, 'Antidote', 'common', 'tool', 0, 5),
(94, 'Stamina Potion', 'common', 'tool', 0, 6),
(95, 'Regeneration Potion', 'rare', 'tool', 0, 11);

-- === ACCESSORIES (Products) - IDs 96-100 ===
INSERT INTO items (item_id, name, rarity, item_type, base_attack, craft_time_seconds) VALUES
(96, 'Golden Crown', 'rare', 'magic', 0, 20),
(97, 'Magic Ring', 'rare', 'magic', 10, 15),
(98, 'Dragon Amulet', 'legendary', 'magic', 15, 30),
(99, 'Phoenix Pendant', 'legendary', 'magic', 20, 28),
(100, 'Ancient Artifact', 'legendary', 'magic', 25, 40);

-- Reset item sequence
SELECT setval('items_item_id_seq', 100);
