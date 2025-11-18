// backend/routes/monster.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get current dragon HP for a player
router.get('/:playerId', async (req, res) => {
  try {
    const playerId = Number(req.params.playerId) || 1;
    const result = await pool.query(`
      SELECT 
        pm.monster_id,
        m.name,
        m.max_hp,
        pm.current_hp,
        pm.state
      FROM player_monsters pm
      JOIN monsters m ON pm.monster_id = m.monster_id
      WHERE pm.player_id = $1 AND m.name = 'Dragon'
      LIMIT 1
    `, [playerId]);
    
    if (result.rows.length === 0) {
      return res.json({ hp: 1000, maxHp: 1000, name: 'Dragon' });
    }
    
    const monster = result.rows[0];
    res.json({
      hp: Number(monster.current_hp),
      maxHp: Number(monster.max_hp),
      name: monster.name,
      state: monster.state
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
