const Chapter     = require('../models/Chapter');
const User        = require('../models/User');
const UserProgress= require('../models/UserProgress');

// Dashboard stats
const getStats = async (req, res, next) => {
  try {
    const totalUsers    = await User.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalGames    = await UserProgress.countDocuments({ isCompleted: true });
    const recentUsers   = await User.find().sort({ createdAt: -1 }).limit(5).select('username email createdAt');
    res.json({ success: true, stats: { totalUsers, totalChapters, totalGames }, recentUsers });
  } catch (err) { next(err); }
};

// Get all chapters
const getChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find().sort({ chapterNumber: 1 });
    res.json({ success: true, chapters });
  } catch (err) { next(err); }
};

// Get single chapter
const getChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    res.json({ success: true, chapter });
  } catch (err) { next(err); }
};

// Create chapter
const createChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.create(req.body);
    res.status(201).json({ success: true, chapter });
  } catch (err) { next(err); }
};

// Update chapter
const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!chapter) return res.status(404).json({ success: false, message: 'Chapter not found' });
    res.json({ success: true, chapter });
  } catch (err) { next(err); }
};

// Delete chapter
const deleteChapter = async (req, res, next) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chapter deleted' });
  } catch (err) { next(err); }
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
};

// Make user admin
const makeAdmin = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

module.exports = { getStats, getChapters, getChapter, createChapter, updateChapter, deleteChapter, getUsers, makeAdmin };