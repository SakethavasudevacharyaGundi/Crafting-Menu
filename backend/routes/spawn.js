// backend/routes/spawn.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// POST /api/spawn
// Calls spawn_random_materials(n) and inserts rows into spawn_instances; returns { ok, spawned: [{spawnId, itemId, name, rarity, icon, quantity}] }
router.post('/', async (req, res) => {
  const { count = 1 } = req.body || {};
  const n = Math.max(1, Math.min(3, Number(count) || 1));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT * FROM spawn_random_materials($1)', [n]);
    const spawned = [];
    for (const row of result.rows) {
      const ins = await client.query(
        'INSERT INTO spawn_instances(item_id, quantity) VALUES ($1, $2) RETURNING spawn_id',
        [row.item_id, row.quantity]
      );
      spawned.push({
        spawnId: ins.rows[0].spawn_id,
        itemId: row.item_id,
        name: row.item_name || row.name,
        rarity: row.rarity,
        icon: row.icon_path || null,
        quantity: row.quantity
      });
    }
    await client.query('COMMIT');
    res.json({ ok: true, spawned });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('spawn error', err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

export default router;
