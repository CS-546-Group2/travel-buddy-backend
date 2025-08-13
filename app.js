import './appConfig.js';  // dotenv loads from here (imports are processed first)
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize mongo
connectDB();

// Cors configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? (process.env.ALLOWED_ORIGINS === '*' ? '*' : process.env.ALLOWED_ORIGINS.split(','))
    : ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
import tripRoutes from './Routes/trips.js';
import userRoutes from './Routes/users.js';
import collabRoutes from './Routes/collaboration.js';
import preferenceRoutes from './Routes/preferences.js';

// Health check
app.get('/api/ping', (_req, res) => {
  logger.info('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// Route bindings (MUST come before fallback route)
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/preferences', preferenceRoutes);

// Fallback unmatched route (MUST come after route bindings)
app.use(/(.*)/, (req, res) => {
  res.status(404).json({error: "Not found!"});
});

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error('❌ Global error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`🚀 Backend listening on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
