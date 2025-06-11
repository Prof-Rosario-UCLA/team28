const Match = require('../models/Match');
const { getSimilarityBetweenUsers } = require('../utils/qdrantUtils'); 

const matchController = {
  createMatch: async (userId1, userId2) => {
    const similarityScore = await getSimilarityBetweenUsers(userId1, userId2);
    const match = new Match({ users: [userId1, userId2], matchScore: similarityScore });
    await match.save();
    return match;
  },
  // Get all matches for current user
  getMyMatches: async (req, res) => {
    try {
      const me = req.user.userId || req.user._id;
      
      const matches = await Match.find({ 
        users: me 
      })
      .populate('users', 'name profile')
      .sort({ createdAt: -1 });

      // Flatten
      const users = matches.flatMap(match => 
        match.users
          .filter(user => user._id.toString() !== me.toString()) 
          .map(user => {
            const { _id, name, profile } = user;
            return {
              _id,
              name,
              ...profile, // flatten profile fields
              matchScore: match.matchScore || 0
            };
          })
      );

      res.json(users);
    } catch (err) {
      console.error('Error fetching matches:', err);
      res.status(500).json({ message: 'Error fetching matches', error: err.message });
    }
  }
};

module.exports = matchController;