// backend/routes/recipeClosure.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Return aggregated closure rows for a parent item
router.get('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT rc.child_item AS item_id, it.name, rc.total_qty
       FROM recipe_closure rc
       JOIN items it ON it.item_id = rc.child_item
       WHERE rc.parent_item = $1
       ORDER BY it.name`,
      [item_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch recipe closure' });
  }
});

export default router;
