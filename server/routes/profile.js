const express = require('express');
const router = express.Router();
const { insertProfile } = require('../controllers/profilesController');
const User = require('../models/User');
const auth = require('../middleware/auth');

// update user profile (called by onboarding form and profile page)
router.put('/update', auth, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { profile },
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// get user profile (called by profile page)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the response to match the client's expected structure
    const profileData = {
      profile: {
        ...user.profile,
        fullName: user.name,
        createdAt: user.createdAt
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router;