const express = require('express');
const router  = express.Router();
const { getProfile, getLeaderboard } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',            protect, getProfile);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;