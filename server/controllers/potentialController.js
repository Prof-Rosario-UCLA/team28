const User = require('../models/User');
const Match = require('../models/Match');
const { getUserVector, searchSimilarUsers } = require('../utils/qdrantUtils');

const potentialController = {
  // Get potential matches for a user
  getPotentialMatches: async (req, res) => {
    try {
      console.log('1. Getting potential matches for user:', req.user.userId);
      
      // Get similar users from Qdrant
      const qdrantId = parseInt(req.user.userId.toString().slice(-6), 16); // convert MongoDB ObjectId to numeric ID for Qdrant
      const similarUsers = await searchSimilarUsers(qdrantId, 20);
      
      // Get full user data for all similar users from MongoDB
      const userIds = similarUsers
        .map(match => match.payload.mongoId)        
        .filter(id => id !== req.user.userId); 
      const users = await User.find({ 
        _id: { $in: userIds } 
      }).select('-password');

      // Combine user data with similarity scores and sort by similarity
      const potentialMatches = users
        .map(user => ({
          ...user.toObject(),
          similarity: similarUsers.find(match => match.payload.mongoId === user._id.toString())?.score || 0
        }))
        .sort((a, b) => b.similarity - a.similarity);

      // Filter to exclude users that are already in the user's matches or likes
      const myMatchesDocs = await Match.find({ users: req.user.userId }).select('users');
      const matchedUserIds = myMatchesDocs.flatMap(match => 
        match.users
          .filter(userId => userId.toString() !== req.user.userId.toString())
          .map(userId => userId.toString())
      );

      const filteredPotentialMatches = potentialMatches.filter(user => 
        !matchedUserIds.includes(user._id.toString())
      );
      // TODO: Potentially also filter for liked profiles
      // TODO: display similarity score on the frontend

      res.json(filteredPotentialMatches);
    } catch (error) {
      console.error('Error getting potential matches:', error);
      res.status(500).json({ message: 'Error getting potential matches', error: error.message });
    }
  }
};

module.exports = potentialController;