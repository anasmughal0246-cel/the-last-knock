const UserProgress = require('../models/UserProgress');

const getProgress = async (req, res, next) => {
  try {
    const progress = await UserProgress.findOne({ user: req.user._id, isCompleted: false });
    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

const saveProgress = async (req, res, next) => {
  try {
    const { currentChapter, inventory, score } = req.body;
    let progress = await UserProgress.findOne({ user: req.user._id, isCompleted: false });
    if (!progress) progress = await UserProgress.create({ user: req.user._id });
    if (currentChapter) progress.currentChapter = currentChapter;
    if (inventory) progress.inventory = inventory;
    if (score) progress.score = score;
    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

const resetProgress = async (req, res, next) => {
  try {
    await UserProgress.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'Progress reset!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, saveProgress, resetProgress };