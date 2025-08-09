import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import logger from './utils/logger.js'; //  use shared logger

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------- Middleware (before routes) ----------
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

// Request logger (simple)
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------- DB connection ----------
connectDB()
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch((err) =>
    logger.error('❌ MongoDB connection error', { error: err.message, stack: err.stack })
  );

// ---------- Routes ----------
import tripRoutes from './Routes/trips.js';
import userRoutes from './Routes/users.js';
import collabRoutes from './Routes/collaboration.js';
import preferenceRoutes from './Routes/preferences.js';

// Health check
app.get('/api/ping', (_req, res) => {
  logger.info('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// API routes
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/preferences', preferenceRoutes);

// Optional test route (Postman)
app.post('/api/test', (req, res) => {
  logger.info('🧪 Test POST received', { body: req.body });
  res.json({ message: 'Test successful', received: req.body });
});

// Fallback unmatched route
app.use((req, res) => {
  logger.warn('🚨 Unmatched request', { method: req.method, url: req.originalUrl });
  res.status(404).json({ error: 'Route not found', url: req.originalUrl });
});

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error('❌ Global error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  logger.info(`🚀 Backend listening on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

