// potential.js handles operations for potential matches page

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getUserVector, searchSimilarUsers } = require('../utils/qdrantUtils');

// get potential matches for a user
router.get('/', auth, async (req, res) => {
  try {
    // 1. Get similar users from Qdrant
    const qdrantId = parseInt(req.user.userId.toString().slice(-6), 16); // convert MongoDB ObjectId to numeric ID for Qdrant
    const similarUsers = await searchSimilarUsers(qdrantId, 20);
    
    // 2. Get full user data for all similar users from MongoDB
    const userIds = similarUsers
      .map(match => match.payload.mongoId)        
      .filter(id => id !== req.user.userId); 
    const users = await User.find({ 
      _id: { $in: userIds } 
    }).select('-password');

    // 3. Combine user data with similarity scores and sort by similarity
    const potentialMatches = users
      .map(user => ({
        ...user.toObject(),
        similarity: similarUsers.find(match => match.payload.mongoId === user._id.toString())?.score || 0
      }))
      .sort((a, b) => b.similarity - a.similarity);

    // TODO: add a filter to exclude users that are already in the user's matches
    // TODO: display similarity score on the frontend

    res.json(potentialMatches);
  } catch (error) {
    console.error('Error getting potential matches:', error);
    res.status(500).json({ message: 'Error getting potential matches', error: error.message });
  }
});

module.exports = router; 