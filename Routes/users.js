const express = require('express');
const router = express.Router();
const config = require('../appConfig');

// Get user by ID
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  if (config.USE_MOCK_DATA) {
    try {
      const users = require('../Mock/users.mock.json');
      const user = users.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Failed to load mock users:', error);
      return res.status(500).json({ error: 'Error reading user data' });
    }
  }

  res.status(501).json({ message: 'DB user fetch not implemented' });
});

// Mock login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (config.USE_MOCK_DATA) {
    try {
      const users = require('../Mock/users.mock.json');
      const user = users.find(u => u.username === username && u.hashedPassword === password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Failed to load mock users:', error);
      return res.status(500).json({ error: 'Error reading user data' });
    }
  }

  res.status(501).json({ message: 'DB login not implemented' });
});

module.exports = router;