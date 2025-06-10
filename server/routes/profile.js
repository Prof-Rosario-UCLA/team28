const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Update user profile (called by onboarding form and profile page)
router.put('/update', auth, profileController.updateProfile);

// Get user profile (called by profile page)
router.get('/me', auth, profileController.getMyProfile);

module.exports = router;