// matches.js handles operations for match page

const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const auth = require('../middleware/auth');

// Get all matches for current user
router.get('/my-matches', auth, async (req, res) => {
  try {
    const matches = await Match.find({ 
      users: req.user._id,
      status: 'active'
    })
    .populate('users', 'firstName lastName profile')
    .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
});

// Create a new match
router.post('/', auth, async (req, res) => {
  try {
    const { otherUserId, matchScore, compatibility } = req.body;
    
    const match = new Match({
      users: [req.user._id, otherUserId],
      matchScore,
      compatibility
    });

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error creating match', error: error.message });
  }
});

// Update match status
router.patch('/:matchId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findOneAndUpdate(
      { 
        _id: req.params.matchId,
        users: req.user._id 
      },
      { 
        status,
        lastInteraction: Date.now()
      },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error updating match', error: error.message });
  }
});

module.exports = router; 