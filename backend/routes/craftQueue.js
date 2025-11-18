// backend/routes/craftQueue.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

router.get('/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT queue_id, player_id, result_item_id, qty, started_at, finish_at, status
       FROM craft_queue WHERE player_id = $1 ORDER BY queue_id DESC`,
      [player_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch craft queue' });
  }
});

export default router;
