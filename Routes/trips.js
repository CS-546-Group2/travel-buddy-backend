const express = require('express');
const router = express.Router();
const config = require('../appConfig');

// ✅ Get all trips for a given user (needed by frontend after login)
// THIS MUST COME FIRST to avoid route conflicts
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  if (config.USE_MOCK_DATA) {
    try {
      const mockTrips = require('../Mock/trips.mock.json');
      const userTrips = mockTrips.filter(t => t.userId === userId);
      console.log(`✅ Found ${userTrips.length} trips for user ${userId}`);
      return res.status(200).json(userTrips);
    } catch (err) {
      console.error('❌ Error filtering trips:', err);
      return res.status(500).json({ error: 'Failed to filter trips' });
    }
  }

  res.status(501).json({ message: 'Real trip list not implemented' });
});

// ✅ Get a specific trip by userId and tripId
router.get('/:userId/:tripId', (req, res) => {
  const { userId, tripId } = req.params;

  if (config.USE_MOCK_DATA) {
    try {
      const mockTrips = require('../Mock/trips.mock.json');
      const trip = mockTrips.find(
        t => t._id === tripId && t.userId === userId
      );

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      return res.status(200).json(trip);
    } catch (err) {
      console.error('❌ Error loading trips:', err);
      return res.status(500).json({ error: 'Failed to load trips' });
    }
  }

  res.status(501).json({ message: 'Real trip fetch not implemented' });
});

module.exports = router;
