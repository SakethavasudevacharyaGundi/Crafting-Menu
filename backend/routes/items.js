// backend/routes/items.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Fetch all items with core combat and crafting attributes
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT item_id, name, rarity, base_attack, craft_time_seconds FROM items ORDER BY item_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch items' });
  }
});

export default router;
