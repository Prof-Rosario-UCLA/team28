const express = require('express');
const router = express.Router();
const potentialController = require('../controllers/potentialController');
const auth = require('../middleware/auth');

// Get potential matches for a user
router.get('/', auth, potentialController.getPotentialMatches);

module.exports = router;