const express = require('express');
const router = express.Router();
const { getEndings } = require('../controllers/endingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEndings);

module.exports = router;