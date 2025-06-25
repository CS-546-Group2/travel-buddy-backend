const express = require('express');
const router = express.Router();
const config = require('../appConfig');

// Load mock trips once
const mockTrips = require('../Mock/trips.mock.json');

router.get('/:userId/:tripId', (req, res) => {
  const { userId, tripId } = req.params;

  if (config.USE_MOCK_DATA) {
    const trip = mockTrips.find(
      (t) => t._id === tripId && t.userId === userId
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json(trip);
  }

  res.status(501).json({ message: 'Real trip fetch not implemented' });
});

module.exports = router;
