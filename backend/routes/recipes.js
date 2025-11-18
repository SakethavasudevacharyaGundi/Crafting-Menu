// backend/routes/recipes.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all craftable items for a player with crafting status
router.get('/craftable/:playerId?', async (req, res) => {
  try {
    const playerId = req.params.playerId || 1; // Default to demo player
    
    const result = await pool.query(
      'SELECT * FROM get_craftable_items($1)',
      [playerId]
    );
    
    res.json({ 
      success: true, 
      craftable_items: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get craftable items' });
  }
});

// Get recipe ingredients for a specific item
router.get('/recipe/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    
    const result = await pool.query(
      'SELECT * FROM get_item_recipe($1)',
      [itemId]
    );
    
    res.json({ 
      success: true, 
      recipe: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get recipe' });
  }
});

// Get expanded recipe (base materials needed)
router.get('/expand/:itemId/:quantity?', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const quantity = parseInt(req.params.quantity) || 1;
    
    const result = await pool.query(
      'SELECT * FROM expand_recipe($1, $2)',
      [itemId, quantity]
    );
    
    // Get item names for the base materials
    if (result.rows.length > 0) {
      const itemIds = result.rows.map(row => row.item_id);
      const itemsResult = await pool.query(
        'SELECT item_id, name, rarity, item_type FROM items WHERE item_id = ANY($1)',
        [itemIds]
      );
      
      const itemsMap = {};
      itemsResult.rows.forEach(item => {
        itemsMap[item.item_id] = item;
      });
      
      const expandedRecipe = result.rows.map(row => ({
        ...itemsMap[row.item_id],
        total_qty: row.total_qty
      }));
      
      res.json({ 
        success: true, 
        expanded_recipe: expandedRecipe
      });
    } else {
      res.json({ 
        success: true, 
        expanded_recipe: [],
        message: 'This is a base item (no recipe required)'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to expand recipe' });
  }
});

// Legacy endpoint - get all items with recipes (weapons only)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.item_id, 
        i.name, 
        i.base_attack, 
        i.rarity,
        i.item_type,
        i.craft_time_seconds,
        COALESCE(
          json_agg(
            json_build_object(
              'ingredient_id', r.ingredient_item_id,
              'qty', r.quantity,
              'name', ing.name,
              'rarity', ing.rarity,
              'type', ing.item_type
            )
          ) FILTER (WHERE r.ingredient_item_id IS NOT NULL),
          '[]'
        ) as ingredients
      FROM items i
      LEFT JOIN recipes r ON i.item_id = r.result_item_id
      LEFT JOIN items ing ON r.ingredient_item_id = ing.item_id
      WHERE EXISTS (SELECT 1 FROM recipes WHERE result_item_id = i.item_id)
      GROUP BY i.item_id
      ORDER BY 
        CASE i.rarity 
          WHEN 'legendary' THEN 4 
          WHEN 'epic' THEN 3 
          WHEN 'rare' THEN 2 
          WHEN 'common' THEN 1 
          ELSE 0 
        END DESC,
        i.base_attack DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
