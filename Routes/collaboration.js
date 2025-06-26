const express = require('express');
const router = express.Router();
const config = require('../appConfig');

router.get('/', (req, res) => {
  if (config.USE_MOCK_DATA) {
    try {
      const mockData = require('../Mock/collaborations.mock.json');
      return res.status(200).json(mockData);
    } catch (err) {
      console.error('❌ Error loading mock collaborations:', err);
      return res.status(500).json({ error: 'Failed to load mock data' });
    }
  }

  res.status(501).json({ message: 'DB fetch not implemented' });
});

// Fetch collaborations for a specific userId
router.get('/user/:userId', (req, res) => {
  if (config.USE_MOCK_DATA) {
    try {
      const data = require('../Mock/collaborations.mock.json');
      const filtered = data.filter(item => item.invitedUserId === req.params.userId);
      return res.status(200).json(filtered);
    } catch (err) {
      console.error('❌ Error reading collaborations by user:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  res.status(501).json({ message: 'DB fetch not implemented' });
});

// Fetch collaborations for a specific tripId
router.get('/trip/:tripId', (req, res) => {
  if (config.USE_MOCK_DATA) {
    try {
      const data = require('../Mock/collaborations.mock.json');
      const filtered = data.filter(item => item.tripId === req.params.tripId);
      return res.status(200).json(filtered);
    } catch (err) {
      console.error('❌ Error reading collaborations by trip:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  res.status(501).json({ message: 'DB fetch not implemented' });
});

module.exports = router;
