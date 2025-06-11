const Match = require('../models/Match');
const Like = require('../models/Like');
const matchController = require('./matchController');
const { getSimilarityBetweenUsers } = require('../utils/qdrantUtils'); 

const likeController = {
  // Get users who liked me
  getLikedMe: async (req, res) => {
    try {
      const me = req.user.userId || req.user._id;

      const likes = await Like.find({ liked: me })
        .populate('liker', 'name profile');

      const users = likes.map((like) => {
        const { liker, matchScore } = like;
        const { _id, name, profile } = liker;
        console.log(matchScore);
        return {
          _id,
          name,
          ...profile,  // flatten profile fields
          matchScore: matchScore || 0 
        };
      });

      res.json(users);
    } catch (err) {
      console.error('Error fetching likes:', err);
      res.status(500).json({ message: 'Error fetching likes', error: err.message });
    }
  },

  // Like a user
  likeUser: async (req, res) => {
    try {
      const likerId = req.user.userId;
      const likedUserId = req.body.likedUserId;

      // Prevent self-likes
      if (likerId.toString() === likedUserId) {
        return res.status(400).json({ message: 'Cannot like yourself' });
      }

      // Avoid duplicate like
      const already = await Like.findOne({ liker: likerId, liked: likedUserId });
      if (already) {
        return res.status(400).json({ message: 'You have already liked this user' });
      }

      // Check for reciprocal like and Match if so
      const reciprocal = await Like.findOne({ liker: likedUserId, liked: likerId });
      if (reciprocal) {
        const match = await matchController.createMatch(likerId, likedUserId);
        await Like.deleteOne({ liker: likedUserId, liked: likerId });
        return res.status(201).json({ message: 'Match created', match });
      }

      // Else, create like
      const matchScore = await getSimilarityBetweenUsers(likerId, likedUserId)
      console.log(`Match score between ${likerId} and ${likedUserId}: ${matchScore}`);
      const newLike = new Like({ liker: likerId, liked: likedUserId , matchScore : matchScore });
      await newLike.save();
      res.status(201).json(newLike);

    } catch (err) {
      console.error('Error in liking user:', err);
      res.status(500).json({ message: 'Error liking user', error: err.message });
    }
  }
};

module.exports = likeController;