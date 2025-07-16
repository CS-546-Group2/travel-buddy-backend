const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Route imports
const tripRoutes = require('./Routes/trips');
const userRoutes = require('./Routes/users');
const collabRoutes = require('./Routes/collaboration'); // assuming filename is collaboration.js

// Middleware - More permissive CORS for development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// ✅ Health check
app.get('/api/ping', (req, res) => {
  console.log('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// ✅ Route bindings
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collabRoutes);

// ✅ Server listener
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
