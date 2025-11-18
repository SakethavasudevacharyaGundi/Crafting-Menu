-- 02-triggers.sql
-- prevent inserting a recipe that would create a cycle

CREATE OR REPLACE FUNCTION prevent_recipe_cycle() RETURNS trigger AS $$
DECLARE
  has_cycle BOOLEAN;
BEGIN
  -- If updating or inserting, check if result_item_id appears in the closure of NEW.ingredient_item_id
  WITH RECURSIVE closure(item_id) AS (
    SELECT NEW.ingredient_item_id
    UNION ALL
    SELECT r.ingredient_item_id FROM recipes r JOIN closure c ON r.result_item_id = c.item_id
  )
  SELECT EXISTS(SELECT 1 FROM closure WHERE item_id = NEW.result_item_id) INTO has_cycle;

  IF has_cycle THEN
    RAISE EXCEPTION 'Inserting this recipe would create a cycle involving item %', NEW.result_item_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_cycle ON recipes;

CREATE TRIGGER trg_prevent_cycle
BEFORE INSERT OR UPDATE ON recipes
FOR EACH ROW EXECUTE FUNCTION prevent_recipe_cycle();
