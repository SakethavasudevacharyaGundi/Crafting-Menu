// backend/routes/craft.js
import express from 'express';
import { pool } from '../db.js';
import { withRetry } from '../utils/retry.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { player_id, item_id, qty } = req.body;
  if (!player_id || !item_id || !qty) {
    return res.status(400).json({ success: false, error: 'player_id, item_id, qty required' });
  }
  try {
    await withRetry(() =>
      pool.query('SELECT craft_item_locked($1,$2,$3)', [player_id, item_id, qty])
    );
    res.json({ success: true, message: 'Item crafted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
