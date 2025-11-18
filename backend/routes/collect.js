// backend/routes/collect.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// POST /api/collect
// body: { spawnId, playerId }
router.post('/collect', async (req, res) => {
  const { spawnId, playerId = 1 } = req.body || {};
  if (!spawnId) {
    return res.status(400).json({ ok: false, error: 'spawnId is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const sp = await client.query('SELECT * FROM spawn_instances WHERE spawn_id = $1', [spawnId]);
    if (!sp.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ ok: false, error: 'spawn not found' });
    }
    const spawn = sp.rows[0];

    // Upsert into inventory for this player
    await client.query(
      `INSERT INTO inventory (player_id, item_id, qty)
       VALUES ($1, $2, $3)
       ON CONFLICT (player_id, item_id)
       DO UPDATE SET qty = inventory.qty + EXCLUDED.qty`,
      [playerId, spawn.item_id, spawn.quantity]
    );

    // Remove spawn instance
    await client.query('DELETE FROM spawn_instances WHERE spawn_id = $1', [spawnId]);
    await client.query('COMMIT');

    const itemRow = await pool.query('SELECT item_id, name, rarity FROM items WHERE item_id = $1', [spawn.item_id]);
    const item = itemRow.rows[0];
    return res.json({ ok: true, added: { id: item.item_id, name: item.name, rarity: item.rarity, qty: spawn.quantity } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('collect error', err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

export default router;
