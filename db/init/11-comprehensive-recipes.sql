-- 11-comprehensive-recipes.sql
-- All crafting recipes for the 100-item system

-- TIER 3: REFINED MATERIALS RECIPES
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
-- Iron Ingot (21) = Iron Ore x2 + Coal x1
(21, 3, 2), (21, 8, 1),
-- Copper Ingot (22) = Copper Ore x2 + Coal x1
(22, 4, 2), (22, 8, 1),
-- Bronze Ingot (23) = Copper Ingot x1 + Iron Ingot x1
(23, 22, 1), (23, 21, 1),
-- Steel Ingot (24) = Iron Ingot x2 + Coal x1
(24, 21, 2), (24, 8, 1),
-- Leather Strip (25) = Fiber x2
(25, 5, 2),
-- Rope (26) = Fiber x3
(26, 5, 3),
-- Glass (27) = Sand x3 + Coal x1
(27, 10, 3), (27, 8, 1),
-- Magic Essence (28) = Herb x2 + Water x1 + Sun Crystal x1
(28, 9, 2), (28, 6, 1), (28, 16, 1),
-- Enchanted Cloth (29) = Fiber x3 + Shadow Essence x1
(29, 5, 3), (29, 15, 1),
-- Polished Stone (30) = Stone x2
(30, 2, 2),
-- Hardened Clay (31) = Clay x2 + Coal x1
(31, 7, 2), (31, 8, 1),
-- Alchemy Crystal (32) = Water x1 + Herb x2 + Star Fragment x1
(32, 6, 1), (32, 9, 2), (32, 20, 1),
-- Iron Handle (33) = Iron Ingot x1 + Wood x1
(33, 21, 1), (33, 1, 1),
-- Steel Handle (34) = Steel Ingot x1 + Leather Strip x1
(34, 24, 1), (34, 25, 1),
-- Bowstring (35) = Fiber x3 + Leather Strip x1
(35, 5, 3), (35, 25, 1),
-- Arcane Dust (36) = Sand x2 + Magic Essence x1
(36, 10, 2), (36, 28, 1),
-- Mystic Gem (37) = Glass x1 + Arcane Dust x1 + Star Fragment x1
(37, 27, 1), (37, 36, 1), (37, 20, 1),
-- Fire Crystal (38) = Magic Essence x1 + Sun Crystal x1
(38, 28, 1), (38, 16, 1),
-- Ice Crystal (39) = Magic Essence x1 + Frost Core x1
(39, 28, 1), (39, 17, 1),
-- Lightning Core (40) = Magic Essence x1 + Lightning Shard x1
(40, 28, 1), (40, 18, 1);

-- TIER 4: WEAPONS & TOOLS RECIPES
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
-- Wooden Sword (41) = Wood x2 + Rope x1
(41, 1, 2), (41, 26, 1),
-- Stone Axe (42) = Stone x3 + Wood x1
(42, 2, 3), (42, 1, 1),
-- Iron Sword (43) = Iron Ingot x2 + Iron Handle x1
(43, 21, 2), (43, 33, 1),
-- Steel Sword (44) = Steel Ingot x2 + Steel Handle x1
(44, 24, 2), (44, 34, 1),
-- Bronze Dagger (45) = Bronze Ingot x1 + Leather Strip x1
(45, 23, 1), (45, 25, 1),
-- War Hammer (46) = Steel Ingot x3 + Wood x1
(46, 24, 3), (46, 1, 1),
-- Bow (47) = Wood x2 + Bowstring x1
(47, 1, 2), (47, 35, 1),
-- Crossbow (48) = Wood x2 + Steel Ingot x1 + Rope x1
(48, 1, 2), (48, 24, 1), (48, 26, 1),
-- Fire Wand (49) = Mystic Gem x1 + Fire Crystal x1
(49, 37, 1), (49, 38, 1),
-- Ice Wand (50) = Mystic Gem x1 + Ice Crystal x1
(50, 37, 1), (50, 39, 1),
-- Thunder Wand (51) = Mystic Gem x1 + Lightning Core x1
(51, 37, 1), (51, 40, 1),
-- Poison Dagger (52) = Bronze Dagger x1 + Herb x2 + Blood Stone x1
(52, 45, 1), (52, 9, 2), (52, 19, 1),
-- Longsword (53) = Steel Sword x1 + Steel Ingot x1 + Leather Strip x1
(53, 44, 1), (53, 24, 1), (53, 25, 1),
-- Battle Axe (54) = Steel Ingot x3 + Wood x1
(54, 24, 3), (54, 1, 1),
-- Spear (55) = Wood x1 + Steel Ingot x1 + Leather Strip x1
(55, 1, 1), (55, 24, 1), (55, 25, 1),
-- Mace (56) = Iron Ingot x3 + Leather Strip x1
(56, 21, 3), (56, 25, 1),
-- Shuriken (57) = Steel Ingot x1 + Polished Stone x1
(57, 24, 1), (57, 30, 1),
-- Pickaxe (58) = Iron Ingot x2 + Wood x1
(58, 21, 2), (58, 1, 1),
-- Torch (59) = Wood x1 + Coal x1
(59, 1, 1), (59, 8, 1),
-- Staff (60) = Wood x2 + Magic Essence x1
(60, 1, 2), (60, 28, 1),
-- Wand Core (61) = Magic Essence x1 + Polished Stone x1
(61, 28, 1), (61, 30, 1),
-- Magic Rod (62) = Wand Core x1 + Mystic Gem x1
(62, 61, 1), (62, 37, 1),
-- Dragon Spear (63) = Spear x1 + Dragon Scale x1 + Fire Crystal x1
(63, 55, 1), (63, 11, 1), (63, 38, 1),
-- Shadow Blade (64) = Steel Sword x1 + Shadow Essence x1 + Magic Essence x1
(64, 44, 1), (64, 15, 1), (64, 28, 1),
-- Sun Hammer (65) = War Hammer x1 + Sun Crystal x1 + Star Fragment x1
(65, 46, 1), (65, 16, 1), (65, 20, 1);

-- TIER 5: ARMOR & DEFENSE RECIPES
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
-- Leather Armor (66) = Leather Strip x3 + Rope x1
(66, 25, 3), (66, 26, 1),
-- Iron Armor (67) = Iron Ingot x3 + Leather Strip x1
(67, 21, 3), (67, 25, 1),
-- Steel Armor (68) = Steel Ingot x4 + Leather Strip x2
(68, 24, 4), (68, 25, 2),
-- Bronze Armor (69) = Bronze Ingot x3 + Leather Strip x2
(69, 23, 3), (69, 25, 2),
-- Dragon Armor (70) = Steel Armor x1 + Dragon Scale x2
(70, 68, 1), (70, 11, 2),
-- Phoenix Armor (71) = Steel Armor x1 + Phoenix Feather x2
(71, 68, 1), (71, 12, 2),
-- Frost Armor (72) = Steel Armor x1 + Frost Core x2
(72, 68, 1), (72, 17, 2),
-- Lightning Armor (73) = Steel Armor x1 + Lightning Shard x2
(73, 68, 1), (73, 18, 2),
-- Shadow Cloak (74) = Enchanted Cloth x2 + Shadow Essence x1
(74, 29, 2), (74, 15, 1),
-- Holy Robe (75) = Enchanted Cloth x2 + Angel Tear x1
(75, 29, 2), (75, 14, 1),
-- Stone Shield (76) = Stone x3 + Leather Strip x1
(76, 2, 3), (76, 25, 1),
-- Iron Shield (77) = Iron Ingot x2 + Leather Strip x1
(77, 21, 2), (77, 25, 1),
-- Steel Shield (78) = Steel Ingot x2 + Leather Strip x1
(78, 24, 2), (78, 25, 1),
-- Dragon Shield (79) = Steel Shield x1 + Dragon Scale x1
(79, 78, 1), (79, 11, 1),
-- Magic Barrier (80) = Arcane Dust x2 + Magic Essence x1
(80, 36, 2), (80, 28, 1),
-- Blood Amulet (81) = Blood Stone x1 + Rope x1
(81, 19, 1), (81, 26, 1),
-- Frost Amulet (82) = Ice Crystal x1 + Rope x1
(82, 39, 1), (82, 26, 1),
-- Flame Ring (83) = Fire Crystal x1 + Polished Stone x1
(83, 38, 1), (83, 30, 1),
-- Lightning Ring (84) = Lightning Core x1 + Polished Stone x1
(84, 40, 1), (84, 30, 1),
-- Star Crown (85) = Star Fragment x2 + Enchanted Cloth x1
(85, 20, 2), (85, 29, 1);

-- TIER 6: LEGENDARY & MAGICAL ITEMS RECIPES
INSERT INTO recipes (result_item_id, ingredient_item_id, quantity) VALUES
-- Dragon Sword (86) = Steel Sword x1 + Dragon Scale x1 + Fire Crystal x1
(86, 44, 1), (86, 11, 1), (86, 38, 1),
-- Phoenix Wand (87) = Fire Wand x1 + Phoenix Feather x1 + Magic Essence x1
(87, 49, 1), (87, 12, 1), (87, 28, 1),
-- Holy Blade (88) = Longsword x1 + Angel Tear x1 + Sun Crystal x1
(88, 53, 1), (88, 14, 1), (88, 16, 1),
-- Demon Mace (89) = War Hammer x1 + Demon Horn x1 + Shadow Essence x1
(89, 46, 1), (89, 13, 1), (89, 15, 1),
-- Star Staff (90) = Magic Rod x1 + Star Fragment x2
(90, 62, 1), (90, 20, 2),
-- Frost Spear (91) = Spear x1 + Ice Crystal x1 + Frost Core x1
(91, 55, 1), (91, 39, 1), (91, 17, 1),
-- Thunder Bow (92) = Bow x1 + Lightning Core x1
(92, 47, 1), (92, 40, 1),
-- Blood Sword (93) = Steel Sword x1 + Blood Stone x2
(93, 44, 1), (93, 19, 2),
-- Sun Axe (94) = Battle Axe x1 + Sun Crystal x1
(94, 54, 1), (94, 16, 1),
-- Shadow Wand (95) = Magic Rod x1 + Shadow Essence x1 + Arcane Dust x1
(95, 62, 1), (95, 15, 1), (95, 36, 1),
-- Dragon Hammer (96) = War Hammer x1 + Dragon Scale x2 + Fire Crystal x1
(96, 46, 1), (96, 11, 2), (96, 38, 1),
-- Celestial Armor (97) = Star Fragment x2 + Angel Tear x1 + Enchanted Cloth x2
(97, 20, 2), (97, 14, 1), (97, 29, 2),
-- Eternal Blade (98) = Dragon Sword x1 + Star Fragment x1 + Angel Tear x1
(98, 86, 1), (98, 20, 1), (98, 14, 1),
-- Chrono Staff (99) = Star Staff x1 + Sun Crystal x1 + Frost Core x1
(99, 90, 1), (99, 16, 1), (99, 17, 1),
-- Infinity Relic (100) = Fire Crystal x1 + Ice Crystal x1 + Lightning Core x1 + Star Fragment x1
(100, 38, 1), (100, 39, 1), (100, 40, 1), (100, 20, 1);