const express = require('express');
const router = express.Router();
const { getProgress, saveProgress, resetProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',    protect, getProgress);
router.post('/',   protect, saveProgress);
router.delete('/', protect, resetProgress);

module.exports = router;