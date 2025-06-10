const User = require('../models/User'); 
const { upsertProfileVector, encodeVector } = require('../utils/qdrantUtils');

const insertProfile = async (req, res) => {
    try {
        console.log('Received profile data:', req.body);
        const { userId, profileData } = req.body;
        /* INSERT LOGIC HERE FOR MONGO DB */
        //Insert profile into Qdrant
        const userVector = encodeVector(profileData);
        const newProfile = await upsertProfileVector(userId, userVector);
        if (!newProfile) {
            return res.status(400).json({ message: 'Failed to create profile' });
        }

        res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
    } catch (error) {
        console.error('Error inserting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const profileController = {
  // Update user profile (called by onboarding form and profile page)
  updateProfile: async (req, res) => {
    try {
      const { profile } = req.body;
      const userId = req.user.userId;
      
      // Update user in mongodb
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { profile },
          updatedAt: Date.now()
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Convert profile to vector and store in qdrant (updates or inserts)
      const vector = encodeVector(profile);

      // Convert MongoDB ObjectId to numeric ID for Qdrant
      const qdrantId = parseInt(userId.toString().slice(-6), 16);

      //Upsert the vector in Qdrant
      await upsertProfileVector(qdrantId, vector, {
        name: user.name,
        email: user.email,
        mongoId: userId.toString() 
      });

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
  },

  // Get user profile (called by profile page)
  getMyProfile: async (req, res) => {
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
  }
};

module.exports = profileController;