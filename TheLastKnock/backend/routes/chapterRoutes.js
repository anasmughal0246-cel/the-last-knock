const express = require('express');
const router = express.Router();
const { getChapter, makeChoice, getAllChapters } = require('../controllers/chapterController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       protect, getAllChapters);
router.get('/:id',    protect, getChapter);
router.post('/:id/choice', protect, makeChoice);

module.exports = router;