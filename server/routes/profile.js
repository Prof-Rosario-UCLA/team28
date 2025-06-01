const express = require('express');
const router = express.Router();
const { insertProfile } = require('../controllers/profilesController');
//const auth = require('../middleware/auth');

// create a new profile
router.put('/', /*auth,*/ insertProfile);


module.exports = router;