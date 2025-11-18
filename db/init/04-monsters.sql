-- 04-monsters.sql

-- Calculate player total attack power
CREATE OR REPLACE FUNCTION get_player_attack(p_player INT)
RETURNS BIGINT AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COALESCE(SUM(i.qty * it.base_attack),0)
    INTO total
  FROM inventory i
  JOIN items it ON i.item_id = it.item_id
  WHERE i.player_id = p_player;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Attack a monster: reduces HP, handles defeat and rewards
CREATE OR REPLACE FUNCTION attack_monster(p_player INT, p_monster INT)
RETURNS TEXT AS $$
DECLARE
  dmg BIGINT;
  hp_before BIGINT;
  hp_after BIGINT;
  reward_item INT;
  reward_qty INT;
  mstate TEXT;
BEGIN
  -- Serialize player actions (combat, rewards) per player
  PERFORM pg_advisory_xact_lock(p_player);
  -- Fetch current monster state
  SELECT current_hp, state INTO hp_before, mstate
  FROM player_monsters
  WHERE player_id = p_player AND monster_id = p_monster
  FOR UPDATE;

  IF NOT FOUND THEN
    -- First encounter: create new monster instance
    INSERT INTO player_monsters (player_id, monster_id, current_hp)
    SELECT p_player, m.monster_id, m.max_hp
    FROM monsters m WHERE m.monster_id = p_monster;
    hp_before := (SELECT max_hp FROM monsters WHERE monster_id = p_monster);
    mstate := 'ALIVE';
  END IF;

  IF mstate = 'DEAD' THEN
    RETURN 'Monster already defeated.';
  END IF;

  -- Compute player damage minus monster defense
  dmg := GREATEST(get_player_attack(p_player) -
                 (SELECT defense FROM monsters WHERE monster_id = p_monster), 1);

  hp_after := GREATEST(hp_before - dmg, 0);

  UPDATE player_monsters
     SET current_hp = hp_after, last_hit_ts = now()
   WHERE player_id = p_player AND monster_id = p_monster;

  INSERT INTO events(player_id, event_type, payload)
  VALUES (p_player, 'ATTACK',
          jsonb_build_object('monster', p_monster, 'damage', dmg, 'hp_after', hp_after));

  IF hp_after = 0 THEN
     -- mark dead
     UPDATE player_monsters
        SET state='DEAD'
      WHERE player_id=p_player AND monster_id=p_monster;

     SELECT reward_item_id, reward_qty
       INTO reward_item, reward_qty
       FROM monsters WHERE monster_id=p_monster;

     PERFORM set_config('app.event_reason','REWARD', true);
     INSERT INTO inventory(player_id,item_id,qty)
     VALUES (p_player, reward_item, reward_qty)
     ON CONFLICT (player_id,item_id) DO UPDATE
       SET qty = inventory.qty + EXCLUDED.qty;

     INSERT INTO events(player_id,event_type,payload)
     VALUES (p_player,'MONSTER_DEFEATED',
             jsonb_build_object('monster',p_monster,'reward_item',reward_item,'reward_qty',reward_qty));

     RETURN format('Monster defeated! Reward +%s item %s',reward_qty,reward_item);
  ELSE
     RETURN format('You hit for %s damage. Remaining HP: %s',dmg,hp_after);
  END IF;
END;
$$ LANGUAGE plpgsql;
