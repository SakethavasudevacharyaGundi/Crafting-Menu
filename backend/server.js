// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { pool } from './db.js';
import craftRoutes from './routes/craft.js';
import attackRoutes from './routes/attack.js';
import resetDragonRoutes from './routes/reset-dragon.js';
import inventoryRoutes from './routes/inventory.js';
import statsRoutes from './routes/stats.js';
import spawnRoutes from './routes/spawn.js';
import collectRoutes from './routes/collect.js';
import itemsRoutes from './routes/items.js';
import craftQueueRoutes from './routes/craftQueue.js';
import recipeClosureRoutes from './routes/recipeClosure.js';
import monstersRoutes from './routes/monsters.js';
import recipesRoutes from './routes/recipes.js';
import monsterRoutes from './routes/monster.js';
import sessionRoutes from './routes/session.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount routes
app.use('/api/craft', craftRoutes);
app.use('/api/attack', attackRoutes);
app.use('/api/reset-dragon', resetDragonRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/spawn', spawnRoutes);
app.use('/api', collectRoutes);
app.use('/api/monsters', monstersRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/craft-queue', craftQueueRoutes);
app.use('/api/recipe_closure', recipeClosureRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/monster', monsterRoutes);
app.use('/api', sessionRoutes);

// Health check
app.get('/', (_req, res) => res.send('Crafting backend running ✅'));

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
