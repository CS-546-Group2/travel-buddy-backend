import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// TODO: Add JWT authentication middleware
// import auth from '../middleware/auth.js';

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-hashedPassword');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // TODO: Generate JWT token
    // const token = generateToken(user._id);

    res.status(200).json({
      user: user.toJSON(),
      // token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User signup with questionnaire
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      age,
      travelPreferences
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      hashedPassword: password, // Will be hashed by middleware
      age: age || null,
      travelPreferences: travelPreferences || {
        budgetRange: 'mid-range',
        travelStyle: 'balanced',
        interests: [],
        accommodationStyle: 'hotels',
        dietaryRestrictions: ['none'],
        accessibilityNeeds: ['none']
      },
      profileCompleted: false
    });

    await newUser.save();

    // TODO: Generate JWT token
    // const token = generateToken(newUser._id);

    res.status(201).json({
      user: newUser.toJSON(),
      // token: token
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile (including travel preferences)
router.put('/profile/:userId', async (req, res) => {
  try {
    const { travelPreferences, profileCompleted } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        travelPreferences,
        profileCompleted: profileCompleted || false
      },
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users (for collaboration)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).select('username email firstName lastName').limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// TODO: Add more user management endpoints:
// - Password reset
// - Account deletion
// - Email verification
// - Profile picture upload

export default router;