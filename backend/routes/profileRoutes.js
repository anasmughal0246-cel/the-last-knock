const express = require('express');
const router  = express.Router();
const { getProfile, updateAvatar, getLeaderboard } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',            protect, getProfile);
router.put('/avatar',      protect, updateAvatar);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;