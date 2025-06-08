// potential.js handles operations for potential matches page

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getUserVector, searchSimilarUsers } = require('../utils/qdrantUtils');

// get potential matches for a user
router.get('/', auth, async (req, res) => {
  try {
    // 1. get similar users from Qdrant
    const similarUsers = await searchSimilarUsers(req.user.userId);
    
    // 2. get full user data for all similar users from MongoDB
    const userIds = similarUsers.map(match => match.id);
    const users = await User.find({ 
      _id: { $in: userIds } 
    }).select('-password');

    // 3. combine user data with similarity scores and sort by similarity
    const potentialMatches = users
      .map(user => ({
        ...user.toObject(),
        similarity: similarUsers.find(match => match.id === user._id.toString())?.score || 0 
      }))
      .sort((a, b) => b.similarity - a.similarity); // sort by similarity score in descending order
      // TODO: add a filter to exclude users that are already in the user's matches
      // TODO: display similarity score on the frontend

    res.json(potentialMatches);
  } catch (error) {
    console.error('Error getting potential matches:', error);
    res.status(500).json({ message: 'Error getting potential matches', error: error.message });
  }
});

module.exports = router; 