const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const tripRoutes = require('./Routes/trips');

app.use(cors());
app.use(express.json());

// Ping test route
app.get('/api/ping', (req, res) => {
  console.log('✅ Ping received from frontend');
  res.json({ message: 'Backend is alive!' });
});

// Add trip route
app.use('/api/trips', tripRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
