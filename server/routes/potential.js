const express = require('express');
const router = express.Router();
const potentialController = require('../controllers/potentialController');
const auth = require('../middleware/auth');
const { getCachedMatches, setCachedMatches, invalidateMatchesCache } = require('../config/cacheUtils');

// Get potential matches
router.get('/', auth, async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    // Try to get matches from cache first
    const cachedMatches = await getCachedMatches(userId);
    if (cachedMatches) {
      console.log(`:) Cache HIT for user ${userId}`);
      return res.json(cachedMatches);
    }

    console.log(`:( Cache MISS for user ${userId}`);

    // If not in cache, get from database
    const matches = await potentialController.getPotentialMatches(userId);
    await setCachedMatches(userId, matches);
    res.json(matches);
  } catch (error) {
    console.error('Error in potential matches route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Like a potential match
router.post('/like/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;
    await potentialController.processLike(currentUserId, userId);
    console.log(`Invalidating the cache for user ${currentUserId}`);
    await invalidateMatchesCache(currentUserId);
    res.json({ message: 'Like processed successfully' });
  } catch (error) {
    console.error('Error in like route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;