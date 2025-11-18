// backend/routes/session.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Reset a player's session inventory to a clean slate with starter weapons
router.post('/session/reset', async (req, res) => {
  const playerId = Number(req.body?.playerId ?? 1);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM inventory WHERE player_id = $1', [playerId]);

    // Add 5 low-damage starter weapons (attackDamage <= 25) so hotbar is populated
    // This ensures player has weapons immediately and hotbar isn't empty
    const baseWeapons = ['Arrow', 'Iron Dagger', 'Bow', 'Steel Sword', 'Bronze Axe'];
    
    for (const weaponName of baseWeapons) {
      const weapon = await client.query("SELECT item_id FROM items WHERE name = $1 LIMIT 1", [weaponName]);
      if (weapon.rows.length) {
        await client.query(
          `INSERT INTO inventory(player_id, item_id, qty) VALUES ($1, $2, 1)
           ON CONFLICT (player_id, item_id) DO UPDATE SET qty = 1`,
          [playerId, weapon.rows[0].item_id]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('reset session error', err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

export default router;
