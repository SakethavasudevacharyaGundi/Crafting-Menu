-- 06-audit.sql

-- audit: inventory_log
CREATE TABLE IF NOT EXISTS inventory_log (
  log_id SERIAL PRIMARY KEY,
  player_id INTEGER,
  item_id INTEGER,
  delta BIGINT,           -- positive for addition, negative for deduction
  before_qty BIGINT,
  after_qty BIGINT,
  reason TEXT,            -- e.g., 'CRAFT', 'SPAWN', 'REWARD', 'ATTACK', or TG_OP
  ref_event_id INTEGER,   -- optional foreign key to events.event_id
  created_at TIMESTAMP DEFAULT now()
);

-- Trigger function to log changes on inventory
CREATE OR REPLACE FUNCTION trg_log_inventory() RETURNS TRIGGER AS $$
DECLARE
  reason_text TEXT;
BEGIN
  -- Allow caller to set a contextual reason within the transaction
  reason_text := current_setting('app.event_reason', true);
  IF reason_text IS NULL OR length(reason_text) = 0 THEN
    reason_text := TG_OP; -- fallback to operation name
  END IF;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO inventory_log(player_id, item_id, delta, before_qty, after_qty, reason)
    VALUES (NEW.player_id, NEW.item_id, NEW.qty, 0, NEW.qty, reason_text);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO inventory_log(player_id, item_id, delta, before_qty, after_qty, reason)
    VALUES (NEW.player_id, NEW.item_id, NEW.qty - OLD.qty, OLD.qty, NEW.qty, reason_text);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO inventory_log(player_id, item_id, delta, before_qty, after_qty, reason)
    VALUES (OLD.player_id, OLD.item_id, -OLD.qty, OLD.qty, 0, reason_text);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger (AFTER for final qty)
DROP TRIGGER IF EXISTS inventory_audit_trg ON inventory;
CREATE TRIGGER inventory_audit_trg
AFTER INSERT OR UPDATE OR DELETE ON inventory
FOR EACH ROW EXECUTE FUNCTION trg_log_inventory();
