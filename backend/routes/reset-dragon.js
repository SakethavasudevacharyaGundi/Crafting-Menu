// backend/routes/reset-dragon.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { player_id } = req.body;
    const playerId = Number(player_id) || 1;
    
    console.log('🔄 Resetting dragon for player:', playerId);
    
    // Get dragon monster_id
    const dragonResult = await pool.query(
      "SELECT monster_id FROM monsters WHERE name='Dragon' LIMIT 1"
    );
    const dragonId = dragonResult.rows[0]?.monster_id || 1;
    
    // Reset dragon HP to max
    const updateResult = await pool.query(
      `UPDATE player_monsters 
       SET current_hp = (SELECT max_hp FROM monsters WHERE monster_id = $2),
           state = 'ALIVE',
           last_hit_ts = NULL
       WHERE player_id = $1 AND monster_id = $2
       RETURNING current_hp, 
                 (SELECT max_hp FROM monsters WHERE monster_id = $2) as max_hp`,
      [playerId, dragonId]
    );
    
    if (updateResult.rows.length === 0) {
      // Dragon doesn't exist for this player, create it
      const insertResult = await pool.query(
        `INSERT INTO player_monsters (player_id, monster_id, current_hp, state)
         SELECT $1, $2, max_hp, 'ALIVE'
         FROM monsters WHERE monster_id = $2
         RETURNING current_hp, 
                   (SELECT max_hp FROM monsters WHERE monster_id = $2) as max_hp`,
        [playerId, dragonId]
      );
      
      console.log('✅ Dragon created:', insertResult.rows[0]);
      return res.json({ 
        success: true, 
        hp: Number(insertResult.rows[0].current_hp),
        maxHp: Number(insertResult.rows[0].max_hp),
        message: 'Dragon created and ready'
      });
    }
    
    console.log('✅ Dragon reset:', updateResult.rows[0]);
    res.json({ 
      success: true, 
      hp: Number(updateResult.rows[0].current_hp),
      maxHp: Number(updateResult.rows[0].max_hp),
      message: 'Dragon HP reset to full'
    });
  } catch (err) {
    console.error('❌ Reset dragon error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
