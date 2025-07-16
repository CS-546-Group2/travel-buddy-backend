import express from 'express';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

const router = express.Router();

// TODO: Add authentication middleware
// import auth from '../middleware/auth.js';

// Get all trips for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, search } = req.query;

    let query = { userId, isDeleted: false };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { tripName: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    const trips = await Trip.find(query)
      .sort({ startDate: 1 })
      .populate('userId', 'firstName lastName username'); 

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific trip
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('userId', 'firstName lastName username');

    if (!trip || trip.isDeleted) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new trip
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      tripName,
      destination,
      startDate,
      endDate,
      budget,
      preferences
    } = req.body;

    // Validate required fields
    if (!userId || !tripName || !destination || !startDate || !endDate || !budget) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    if (start < new Date()) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    // Create new trip
    const newTrip = new Trip({
      userId,
      tripName,
      destination,
      startDate: start,
      endDate: end,
      budget,
      preferences: preferences || {
        travelStyle: 'balanced',
        interests: [],
        budgetRange: 'mid-range',
        accommodationStyle: 'hotels'
      }
    });

    await newTrip.save();

    // TODO: Trigger AI itinerary generation
    // await generateItinerary(newTrip._id);

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a trip
router.put('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedTrip || updatedTrip.isDeleted) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // TODO: Trigger AI re-generation if preferences changed
    // if (updateData.preferences) {
    //   await regenerateItinerary(tripId);
    // }

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a trip (soft delete)
router.delete('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      { isDeleted: true },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search trips
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { userId } = req.query;

    let searchQuery = {
      isDeleted: false,
      $or: [
        { tripName: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } }
      ]
    };

    if (userId) {
      searchQuery.userId = userId;
    }

    const trips = await Trip.find(searchQuery)
      .populate('userId', 'firstName lastName username')
      .sort({ startDate: 1 })
      .limit(20);

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trip statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Trip.aggregate([
      { $match: { userId: userId, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalTrips: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          avgBudget: { $avg: '$budget' },
          upcomingTrips: {
            $sum: {
              $cond: [{ $eq: ['$status', 'upcoming'] }, 1, 0]
            }
          },
          ongoingTrips: {
            $sum: {
              $cond: [{ $eq: ['$status', 'ongoing'] }, 1, 0]
            }
          },
          completedTrips: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.status(200).json(stats[0] || {
      totalTrips: 0,
      totalBudget: 0,
      avgBudget: 0,
      upcomingTrips: 0,
      ongoingTrips: 0,
      completedTrips: 0
    });
  } catch (error) {
    console.error('Error fetching trip stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// TODO: AI Planning Endpoints
// router.post('/:tripId/generate-itinerary', async (req, res) => {
//   // Generate AI itinerary
// });

// router.post('/:tripId/generate-recommendations', async (req, res) => {
//   // Generate AI recommendations
// });

// router.post('/:tripId/generate-tips', async (req, res) => {
//   // Generate travel tips
// });

export default router;
