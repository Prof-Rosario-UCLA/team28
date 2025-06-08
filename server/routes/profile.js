// profile.js handles operations for profile page

const express = require('express');
const router = express.Router();
const { insertProfile } = require('../controllers/profilesController');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { encodeVector, upsertProfileVector } = require('../utils/qdrantUtils');

// update user profile (called by onboarding form and profile page)
router.put('/update', auth, async (req, res) => {
  try {
    const { profile } = req.body;
    console.log('1. Received profile update request:', { userId: req.user.userId });
    
    // update user in mongodb
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { profile },
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');
    console.log('2. Updated MongoDB profile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // convert profile to vector and store in qdrant (updates or inserts)
    console.log('3. Converting profile to vector...');
    const vector = encodeVector(profile);
    console.log('4. Generated vector:', vector);

    // Convert MongoDB ObjectId to numeric ID for Qdrant
    const qdrantId = parseInt(req.user.userId.toString().slice(-6), 16);
    console.log('5. Using Qdrant ID:', qdrantId);

    console.log('6. Storing vector in Qdrant...');
    await upsertProfileVector(qdrantId, vector, {
      name: user.name,
      email: user.email,
      mongoId: req.user.userId.toString() // Store MongoDB ID in payload for reference
    });
    console.log('7. Successfully stored vector in Qdrant');

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
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