// backend/routes/monsters.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT monster_id, name, max_hp, defense, spawn_level FROM monsters ORDER BY spawn_level'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch monsters' });
  }
});

export default router;
