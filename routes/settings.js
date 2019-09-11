const express = require('express');
const router = express.Router();
const controller = require('../controllers/settings');
const passport = require('passport');

// localhost:5000/api/settings
router.get('/', passport.authenticate('jwt', {session: false}), controller.getAllSettings);

module.exports = router;