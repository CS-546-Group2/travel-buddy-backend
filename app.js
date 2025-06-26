const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Route imports
const tripRoutes = require('./Routes/trips');
const userRoutes = require('./Routes/users');
const collabRoutes = require('./Routes/collaboration'); // assuming filename is collaboration.js

// Middleware
app.use(cors());
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
});
