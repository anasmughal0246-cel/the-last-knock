const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// GET /api/admin/stats
router.get('/stats', protect, adminMiddleware, async (req, res, next) => {
  try {
    const totalUsers     = await User.countDocuments();
    const totalChapters  = await Chapter.countDocuments();
    const gamesCompleted = await UserProgress.countDocuments({ isCompleted: true });
    res.json({ success: true, totalUsers, totalChapters, gamesCompleted });
  } catch (err) { next(err); }
});

// GET /api/admin/chapters
router.get('/chapters', protect, adminMiddleware, async (req, res, next) => {
  try {
    const chapters = await Chapter.find().sort({ chapterNumber: 1 });
    res.json({ success: true, chapters });
  } catch (err) { next(err); }
});

// GET /api/admin/users
router.get('/users', protect, adminMiddleware, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
});

// POST /api/admin/chapters
router.post('/chapters', protect, adminMiddleware, async (req, res, next) => {
  try {
    const chapter = await Chapter.create(req.body);
    res.json({ success: true, chapter });
  } catch (err) { next(err); }
});

// PUT /api/admin/chapters/:id
router.put('/chapters/:id', protect, adminMiddleware, async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, chapter });
  } catch (err) { next(err); }
});

// DELETE /api/admin/chapters/:id
router.delete('/chapters/:id', protect, adminMiddleware, async (req, res, next) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chapter deleted' });
  } catch (err) { next(err); }
});

module.exports = router;