import express from 'express';
import TravelPreference from '../models/TravelPreference.js';

const router = express.Router();

// POST /api/preferences
router.post('/', async (req, res) => {
  try {
    const { userId, travelStyle, budgetRange, accommodationStyle, interests } = req.body;

    // Validate required fields
    if (!userId || !travelStyle || !budgetRange || !accommodationStyle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert travel preferences for the user
    const preference = await TravelPreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          travelStyle,
          budgetRange,
          accommodationStyle,
          interests: interests || []
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Preferences saved successfully', data: preference });
  } catch (err) {
    console.error('[TravelPreferences] Error:', err);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

export default router;
