// backend/routes/inventory.js
import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get player inventory with categorization and detailed item info
router.get('/:player_id', async (req, res) => {
  try {
    const { player_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM get_player_inventory($1)',
      [player_id]
    );
    res.json({ 
      success: true, 
      inventory: result.rows 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch inventory' });
  }
});

// Get inventory categorized by item type
router.get('/:player_id/categorized', async (req, res) => {
  try {
    const { player_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM get_player_inventory($1)',
      [player_id]
    );
    
    // Group items by type
    const categorized = {
      materials: result.rows.filter(item => item.item_type === 'material'),
      weapons: result.rows.filter(item => item.item_type === 'weapon'),
      armor: result.rows.filter(item => item.item_type === 'armor'),
      magic: result.rows.filter(item => item.item_type === 'magic'),
      tools: result.rows.filter(item => item.item_type === 'tool')
    };
    
    res.json({ 
      success: true, 
      inventory: categorized,
      total_items: result.rows.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch categorized inventory' });
  }
});

export default router;
