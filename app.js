import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middleware (place before routes)
app.use(express.json()); // Parse JSON bodies first
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});


// ✅ Connect to MongoDB
connectDB().then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ Route imports
import tripRoutes from './Routes/trips.js';
import userRoutes from './Routes/users.js';
import collabRoutes from './Routes/collaboration.js';
import preferenceRoutes from './Routes/preferences.js';
console.log('🧩 preferenceRoutes imported:', preferenceRoutes);

// ✅ Health check route
app.get('/api/ping', (req, res) => {
  console.log('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// ✅ API routes
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/preferences', preferenceRoutes);

// ✅ Optional test route for Postman
app.post('/api/test', (req, res) => {
  console.log('🧪 Test POST received:', req.body);
  res.json({ message: 'Test successful', received: req.body });
});

// ✅ Fallback unmatched route logger
app.use((req, res) => {
  console.log(`🚨 Unmatched request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', url: req.originalUrl });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});