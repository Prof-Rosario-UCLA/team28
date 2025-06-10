const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

//Fetch users who liked me
router.get('/liked-me', auth, likeController.getLikedMe);

//Like User
router.post('/', auth, likeController.likeUser);

module.exports = router;