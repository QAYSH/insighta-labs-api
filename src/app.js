import express from 'express';
import corsMiddleware from './middleware/cors.js';
import profilesRouter from './routes/profiles.js';
import searchRouter from './routes/search.js';
import errorHandler from './middleware/errorHandler.js';
import pool from './config/database.js';  // Add this line

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/profiles', profilesRouter);
app.use('/api/profiles/search', searchRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM profiles');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      profileCount: parseInt(result.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

app.use(errorHandler);

export default app;