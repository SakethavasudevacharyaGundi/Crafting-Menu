-- 17-comprehensive-recipes-100.sql
-- Complete recipe system for 100-item crafting system

-- === COMPONENT RECIPES (Base materials -> Components) ===

-- Iron Ingot (31) = Iron Ore x3 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(31, 3, 3), (31, 5, 1);

-- Copper Ingot (32) = Copper Ore x3 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(32, 4, 3), (32, 5, 1);

-- Gold Ingot (33) = Gold Ore x3 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(33, 21, 3), (33, 5, 1);

-- Leather Strap (34) = Animal Hide x2 + String x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(34, 14, 2), (34, 18, 1);

-- Wood Plank (35) = Wood Log x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(35, 1, 2);

-- Glass (36) = Sand x3
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(36, 8, 3);

-- Brick (37) = Clay x3
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(37, 9, 3);

-- Mana Dust (38) = Mana Essence x2 + Crystal Shard x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(38, 28, 2), (38, 23, 1);

-- Silver Ingot (39) = Silver Ore x3 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(39, 22, 3), (39, 5, 1);

-- Mithril Bar (40) = Mithril Ore x3 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(40, 24, 3), (40, 5, 1);

-- Steel Ingot (41) = Iron Ingot x2 + Coal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(41, 31, 2), (41, 5, 1);

-- Bronze Ingot (42) = Copper Ingot x1 + Iron Ingot x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(42, 32, 1), (42, 31, 1);

-- Cloth (43) = Plant Fiber x3 + Flax Thread x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(43, 7, 3), (43, 11, 2);

-- Rope (44) = Plant Fiber x4
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(44, 7, 4);

-- Refined Leather (45) = Animal Hide x3 + Fish Oil x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(45, 14, 3), (45, 20, 1);

-- Dragon Leather (46) = Dragon Scale x2 + Refined Leather x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(46, 25, 2), (46, 45, 1);

-- Enchanted Gem (47) = Crystal Shard x3 + Mana Dust x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(47, 23, 3), (47, 38, 2);

-- Tungsten Bar (48) = Tungsten Ore x3 + Coal x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(48, 30, 3), (48, 5, 2);

-- Obsidian Blade (49) = Obsidian x2 + Steel Ingot x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(49, 26, 2), (49, 41, 1);

-- Phoenix Down (50) = Phoenix Feather x3 + Mana Essence x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(50, 27, 3), (50, 28, 1);

-- Magic Thread (51) = Flax Thread x3 + Mana Dust x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(51, 11, 3), (51, 38, 1);

-- Ancient Steel (52) = Steel Ingot x3 + Ancient Relic x1 + Mithril Bar x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(52, 41, 3), (52, 29, 1), (52, 40, 1);

-- Crystal Core (53) = Crystal Shard x4 + Mana Essence x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(53, 23, 4), (53, 28, 2);

-- Dragon Bone (54) = Bone Fragment x5 + Dragon Scale x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(54, 13, 5), (54, 25, 2);

-- Mystic Oil (55) = Fish Oil x2 + Herb Leaf x3 + Mana Essence x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(55, 20, 2), (55, 12, 3), (55, 28, 1);

-- Enchanted Wood (56) = Wood Plank x3 + Mana Dust x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(56, 35, 3), (56, 38, 1);

-- Holy Water (57) = Water Flask x2 + Herb Leaf x2 + Crystal Shard x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(57, 10, 2), (57, 12, 2), (57, 23, 1);

-- Shadow Essence (58) = Charcoal x3 + Mana Essence x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(58, 17, 3), (58, 28, 2);

-- Light Crystal (59) = Crystal Shard x3 + Phoenix Feather x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(59, 23, 3), (59, 27, 1);

-- Dark Crystal (60) = Crystal Shard x3 + Shadow Essence x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(60, 23, 3), (60, 58, 1);

-- === WEAPON RECIPES ===

-- Steel Sword (61) = Iron Ingot x5 + Leather Strap x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(61, 31, 5), (61, 34, 2);

-- Iron Dagger (62) = Iron Ingot x3 + Leather Strap x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(62, 31, 3), (62, 34, 1);

-- Bow (63) = Wood Plank x3 + String x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(63, 35, 3), (63, 18, 2);

-- Arrow (64) = Stick x1 + Stone Chunk x1 + Feather x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(64, 16, 1), (64, 2, 1), (64, 15, 1);

-- Fire Wand (65) = Wood Plank x2 + Mana Dust x1 + Phoenix Feather x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(65, 35, 2), (65, 38, 1), (65, 27, 1);

-- Ice Staff (66) = Enchanted Wood x2 + Mana Dust x2 + Crystal Shard x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(66, 56, 2), (66, 38, 2), (66, 23, 1);

-- Thunder Hammer (67) = Steel Ingot x4 + Mana Essence x2 + Crystal Core x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(67, 41, 4), (67, 28, 2), (67, 53, 1);

-- Dragon Blade (68) = Ancient Steel x3 + Dragon Scale x2 + Dragon Bone x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(68, 52, 3), (68, 25, 2), (68, 54, 1);

-- Mithril Sword (69) = Mithril Bar x4 + Leather Strap x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(69, 40, 4), (69, 34, 2);

-- Bronze Axe (70) = Bronze Ingot x3 + Wood Plank x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(70, 42, 3), (70, 35, 1);

-- Shadow Dagger (71) = Obsidian Blade x2 + Shadow Essence x1 + Leather Strap x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(71, 49, 2), (71, 58, 1), (71, 34, 1);

-- Light Spear (72) = Steel Ingot x3 + Light Crystal x1 + Wood Plank x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(72, 41, 3), (72, 59, 1), (72, 35, 2);

-- Ancient Sword (73) = Ancient Steel x4 + Enchanted Gem x2 + Ancient Relic x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(73, 52, 4), (73, 47, 2), (73, 29, 1);

-- Crossbow (74) = Wood Plank x4 + Steel Ingot x2 + String x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(74, 35, 4), (74, 41, 2), (74, 18, 2);

-- Phoenix Blade (75) = Ancient Steel x3 + Phoenix Feather x3 + Phoenix Down x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(75, 52, 3), (75, 27, 3), (75, 50, 2);

-- === ARMOR RECIPES ===

-- Steel Armor (76) = Iron Ingot x8 + Leather Strap x4 + Silver Ingot x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(76, 31, 8), (76, 34, 4), (76, 39, 2);

-- Leather Armor (77) = Animal Hide x5 + String x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(77, 14, 5), (77, 18, 2);

-- Mithril Armor (78) = Mithril Bar x6 + Refined Leather x3 + Silver Ingot x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(78, 40, 6), (78, 45, 3), (78, 39, 2);

-- Dragon Armor (79) = Ancient Steel x5 + Dragon Scale x4 + Dragon Leather x3
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(79, 52, 5), (79, 25, 4), (79, 46, 3);

-- Bronze Helmet (80) = Bronze Ingot x3 + Leather Strap x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(80, 42, 3), (80, 34, 1);

-- Steel Shield (81) = Steel Ingot x4 + Wood Plank x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(81, 41, 4), (81, 35, 2);

-- Crystal Shield (82) = Crystal Core x2 + Steel Ingot x3 + Enchanted Gem x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(82, 53, 2), (82, 41, 3), (82, 47, 1);

-- Phoenix Armor (83) = Ancient Steel x6 + Phoenix Feather x5 + Phoenix Down x3
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(83, 52, 6), (83, 27, 5), (83, 50, 3);

-- Shadow Cloak (84) = Cloth x4 + Shadow Essence x2 + Dark Crystal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(84, 43, 4), (84, 58, 2), (84, 60, 1);

-- Light Armor (85) = Cloth x5 + Light Crystal x2 + Silver Ingot x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(85, 43, 5), (85, 59, 2), (85, 39, 2);

-- === CONSUMABLE RECIPES ===

-- Mana Potion (86) = Herb Leaf x3 + Mana Essence x1 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(86, 12, 3), (86, 28, 1), (86, 10, 1);

-- Healing Potion (87) = Herb Leaf x4 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(87, 12, 4), (87, 10, 1);

-- Strength Elixir (88) = Herb Leaf x3 + Dragon Scale x1 + Mystic Oil x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(88, 12, 3), (88, 25, 1), (88, 55, 1);

-- Speed Potion (89) = Feather x3 + Herb Leaf x2 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(89, 15, 3), (89, 12, 2), (89, 10, 1);

-- Invisibility Potion (90) = Shadow Essence x1 + Herb Leaf x3 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(90, 58, 1), (90, 12, 3), (90, 10, 1);

-- Fire Resistance Potion (91) = Phoenix Feather x1 + Herb Leaf x3 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(91, 27, 1), (91, 12, 3), (91, 10, 1);

-- Ice Resistance Potion (92) = Crystal Shard x1 + Herb Leaf x3 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(92, 23, 1), (92, 12, 3), (92, 10, 1);

-- Antidote (93) = Herb Leaf x2 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(93, 12, 2), (93, 10, 1);

-- Stamina Potion (94) = Herb Leaf x3 + Fish Oil x1 + Water Flask x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(94, 12, 3), (94, 20, 1), (94, 10, 1);

-- Regeneration Potion (95) = Herb Leaf x4 + Mana Essence x1 + Holy Water x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(95, 12, 4), (95, 28, 1), (95, 57, 1);

-- === ACCESSORY RECIPES ===

-- Golden Crown (96) = Gold Ingot x3 + Crystal Shard x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(96, 33, 3), (96, 23, 2);

-- Magic Ring (97) = Silver Ingot x2 + Enchanted Gem x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(97, 39, 2), (97, 47, 1);

-- Dragon Amulet (98) = Gold Ingot x2 + Dragon Scale x2 + Enchanted Gem x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(98, 33, 2), (98, 25, 2), (98, 47, 1);

-- Phoenix Pendant (99) = Gold Ingot x2 + Phoenix Feather x2 + Light Crystal x1
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(99, 33, 2), (99, 27, 2), (99, 59, 1);

-- Ancient Artifact (100) = Ancient Steel x2 + Ancient Relic x2 + Enchanted Gem x2
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
(100, 52, 2), (100, 29, 2), (100, 47, 2);
