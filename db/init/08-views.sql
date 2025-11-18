-- 08-views.sql

-- Player stats summary
CREATE OR REPLACE VIEW v_player_stats AS
SELECT p.player_id, p.name,
       COALESCE(SUM(i.qty * it.base_attack),0) AS total_attack_power,
       COUNT(DISTINCT pm.monster_id) FILTER (WHERE pm.state='DEAD') AS monsters_defeated,
       COUNT(DISTINCT u.item_id) AS recipes_unlocked
FROM players p
LEFT JOIN inventory i ON p.player_id = i.player_id
LEFT JOIN items it ON i.item_id = it.item_id
LEFT JOIN player_monsters pm ON p.player_id = pm.player_id
LEFT JOIN unlocks u ON p.player_id = u.player_id
GROUP BY p.player_id, p.name;

-- Crafting dependency view
CREATE OR REPLACE VIEW v_recipes AS
SELECT r.result_item_id, it1.name AS result, r.ingredient_item_id,
       it2.name AS ingredient, r.quantity
FROM recipes r
JOIN items it1 ON r.result_item_id = it1.item_id
JOIN items it2 ON r.ingredient_item_id = it2.item_id;
