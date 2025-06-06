// auth.js: this file contains the routes for the auth controller, called by the app.js file

const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);           // login endpoint (called by login form)

// Protected routes
router.get('/me', auth, getCurrentUser); // get current user endpoint (called by profile page)
router.post('/logout', auth, async (req, res) => { // logout endpoint (called by navbar) 
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
});

module.exports = router; 