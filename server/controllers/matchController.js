const Match = require('../models/Match');

const matchController = {
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
              ...profile // flatten profile fields
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