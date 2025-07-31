import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Route imports
import tripRoutes from './Routes/trips.js';
import userRoutes from './Routes/users.js';
import collabRoutes from './Routes/collaboration.js';
import preferenceRoutes from './Routes/preferences.js';


// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Health check
app.get('/api/ping', (req, res) => {
  console.log('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// Route bindings
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/preferences', preferenceRoutes); 

// Server listener
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
