-- 09-recipe_closure.sql
-- TRANSITIVE CLOSURE FOR RECIPES (precomputed dependency tree)

CREATE TABLE IF NOT EXISTS recipe_closure (
  parent_item INT REFERENCES items(item_id),
  child_item INT REFERENCES items(item_id),
  total_qty BIGINT NOT NULL,
  PRIMARY KEY (parent_item, child_item)
);

-- Populate closure
INSERT INTO recipe_closure(parent_item, child_item, total_qty)
WITH RECURSIVE c(parent_item, child_item, qty) AS (
  SELECT result_item_id, ingredient_item_id, quantity
  FROM recipes
  UNION ALL
  SELECT c.parent_item, r.ingredient_item_id, c.qty * r.quantity
  FROM recipes r
  JOIN c ON r.result_item_id = c.child_item
)
SELECT parent_item, child_item, SUM(qty)
FROM c
GROUP BY parent_item, child_item;

-- Refresh closure when recipes change
CREATE OR REPLACE FUNCTION refresh_recipe_closure() RETURNS trigger AS $$
BEGIN
  DELETE FROM recipe_closure;

  INSERT INTO recipe_closure(parent_item, child_item, total_qty)
  WITH RECURSIVE c(parent_item, child_item, qty) AS (
    SELECT result_item_id, ingredient_item_id, quantity
    FROM recipes
    UNION ALL
    SELECT c.parent_item, r.ingredient_item_id, c.qty * r.quantity
    FROM recipes r
    JOIN c ON r.result_item_id = c.child_item
  )
  SELECT parent_item, child_item, SUM(qty)
  FROM c
  GROUP BY parent_item, child_item;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recipe_closure_refresh ON recipes;
CREATE TRIGGER trg_recipe_closure_refresh
AFTER INSERT OR UPDATE OR DELETE ON recipes
FOR EACH STATEMENT EXECUTE FUNCTION refresh_recipe_closure();
