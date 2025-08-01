import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

console.log('✅ preferences.js is ACTIVELY running');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('📥 POST /api/preferences');
  console.log('🔥 RAW BODY:', req.body);

  const {
    _id,
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    age,
    createdAt,
    travelPreferences = {}
  } = req.body || {};

  const {
    budgetRange,
    travelStyle,
    accommodationStyle,
    interests
  } = travelPreferences;

  // 🔎 Check for missing fields
  const missing = [];
  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) missing.push('_id');
  if (!firstName) missing.push('firstName');
  if (!lastName) missing.push('lastName');
  if (!email) missing.push('email');
  if (!username) missing.push('username');
  if (!hashedPassword) missing.push('hashedPassword');
  if (age === undefined || isNaN(Number(age))) missing.push('age');
  if (!createdAt) missing.push('createdAt');
  if (!budgetRange) missing.push('travelPreferences.budgetRange');
  if (!travelStyle) missing.push('travelPreferences.travelStyle');
  if (!accommodationStyle) missing.push('travelPreferences.accommodationStyle');
  if (!Array.isArray(interests)) missing.push('travelPreferences.interests');

  if (missing.length > 0) {
    console.log('❌ MISSING FIELDS:', missing);
    return res.status(400).json({ error: 'Missing required fields', missing });
  }

  // ✅ Prepare update payload
  const update = {
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    age: Number(age),
    createdAt,
    travelPreferences: {
      budgetRange,
      travelStyle,
      accommodationStyle,
      interests
    },
    updatedAt: new Date()
  };

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('✅ Preferences updated for user:', updatedUser._id);

    return res.status(200).json({
      message: 'User preferences saved successfully',
      data: updatedUser
    });
  } catch (err) {
    console.error('❌ [Preferences Update] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
