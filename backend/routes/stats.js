// backend/routes/stats.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

router.get('/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM v_player_stats WHERE player_id = $1',
      [player_id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch stats' });
  }
});

export default router;
