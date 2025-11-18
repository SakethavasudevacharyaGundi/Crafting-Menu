// backend/routes/attack.js
import express from 'express';
import { pool } from '../db.js';
import { withRetry } from '../utils/retry.js';
const router = express.Router();

router.post('/', async (req, res) => {
  let { player_id, monster_id, item_id, damage } = req.body;
  console.log('POST /api/attack body=', req.body);
  if (!player_id) {
    return res.status(400).json({ error: 'player_id required' });
  }
  try {
    // Default to Dragon if monster_id not provided
    if (!monster_id) {
      const drow = await pool.query("SELECT monster_id FROM monsters WHERE name='Dragon' LIMIT 1");
      monster_id = drow.rows[0]?.monster_id || 1;
    }
    // Normalize types
    player_id = Number(player_id);
    monster_id = Number(monster_id);
    const dmgNumRaw = Number(damage);
    // Server-side safety: clamp damage to [1, 50] to avoid one-shot kills or NaN
    const dmgNum = Number.isFinite(dmgNumRaw) ? Math.max(1, Math.min(50, Math.floor(dmgNumRaw))) : 1;
    // If client provides an explicit damage (computed from selected weapon), prefer it
    if (dmgNum > 0) {
      await pool.query('BEGIN');
      // Ensure player has an instance of the monster
      const monRes = await pool.query(
        `SELECT pm.current_hp, m.max_hp
         FROM player_monsters pm
         JOIN monsters m ON m.monster_id = pm.monster_id
         WHERE pm.player_id = $1::int AND pm.monster_id = $2::int
         FOR UPDATE`,
        [player_id, monster_id]
      );

      let currentHp;
      let maxHp;
      if (monRes.rows.length === 0) {
        // Create instance with monster's max_hp
        const m = await pool.query('SELECT max_hp FROM monsters WHERE monster_id=$1', [monster_id]);
        maxHp = Number(m.rows[0]?.max_hp || 1000);
        currentHp = maxHp;
        await pool.query(
          'INSERT INTO player_monsters(player_id, monster_id, current_hp, state) VALUES ($1,$2,$3,\'ALIVE\')',
          [player_id, monster_id, currentHp]
        );
      } else {
        currentHp = Number(monRes.rows[0].current_hp);
        maxHp = Number(monRes.rows[0].max_hp);
      }

      console.log(`🎯 Before attack: currentHp=${currentHp}, damage=${dmgNum}`);

      // Use clamped damage
      const dmg = dmgNum;
      const newHp = Math.max(0, currentHp - dmg);
      
      console.log(`🎯 After calculation: newHp=${newHp} (currentHp=${currentHp} - dmg=${dmg})`);
      
      await pool.query(
        'UPDATE player_monsters SET current_hp=$1::bigint, last_hit_ts=now(), state=CASE WHEN $1::bigint=0 THEN \'DEAD\' ELSE \'ALIVE\' END WHERE player_id=$2::int AND monster_id=$3::int',
        [newHp, player_id, monster_id]
      );
      await pool.query(
        'INSERT INTO events(player_id, event_type, payload) VALUES ($1::int,\'ATTACK\', jsonb_build_object(\'monster\',$2::int, \'damage\',$3::bigint, \'hp_after\',$4::bigint))',
        [player_id, monster_id, dmg, newHp]
      );
      await pool.query('COMMIT');
      return res.json({ success: true, hp: newHp, maxHp, damage: dmg });
    }

    // Fallback to DB function which computes damage from inventory
    const result = await withRetry(() =>
      pool.query('SELECT attack_monster($1::int,$2::int) AS result', [player_id, monster_id])
    );
    res.json({ success: true, message: result.rows[0].result });
  } catch (err) {
    console.error(err);
    try { await pool.query('ROLLBACK'); } catch(_) {}
    res.status(400).json({ error: err.message });
  }
});

export default router;
