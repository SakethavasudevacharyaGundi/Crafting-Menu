-- 05-unlocks.sql

CREATE TABLE IF NOT EXISTS unlocks (
  player_id INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(item_id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (player_id,item_id)
);

-- Suppose defeating Iron Beast unlocks Iron Sword recipe
CREATE TABLE IF NOT EXISTS monster_unlocks (
  monster_id INTEGER REFERENCES monsters(monster_id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(item_id) ON DELETE CASCADE,
  PRIMARY KEY (monster_id,item_id)
);

INSERT INTO monster_unlocks(monster_id,item_id)
SELECT (SELECT monster_id FROM monsters WHERE name='Iron Beast'),
       (SELECT item_id FROM items WHERE name='Iron Sword')
ON CONFLICT DO NOTHING;

-- Trigger to grant unlocks after monster defeat
CREATE OR REPLACE FUNCTION grant_unlocks() RETURNS trigger AS $$
BEGIN
  IF NEW.event_type='MONSTER_DEFEATED' THEN
    INSERT INTO unlocks(player_id,item_id)
    SELECT NEW.player_id, mu.item_id
      FROM monster_unlocks mu
     WHERE (mu.monster_id = (NEW.payload->>'monster')::INT)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_grant_unlocks ON events;
CREATE TRIGGER trg_grant_unlocks
AFTER INSERT ON events
FOR EACH ROW EXECUTE FUNCTION grant_unlocks();
