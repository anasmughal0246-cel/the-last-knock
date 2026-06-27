const Achievement = require('../models/Achievement');
const User = require('../models/User');

const getAchievements = async (req, res, next) => {
  try {
    const all = await Achievement.find();
    const user = await User.findById(req.user._id).populate('achievements');
    const unlockedKeys = user.achievements.map(a => a.key);

    const achievements = all.map(a => ({
      ...a.toObject(),
      unlocked: unlockedKeys.includes(a.key),
    }));

    res.json({ success: true, achievements });
  } catch (err) {
    next(err);
  }
};

const unlockAchievement = async (req, res, next) => {
  try {
    const { key } = req.body;
    const achievement = await Achievement.findOne({ key });
    if (!achievement) return next(new Error('Achievement not found'));

    const user = await User.findById(req.user._id);
    if (!user.achievements.includes(achievement._id)) {
      user.achievements.push(achievement._id);
      user.totalScore += achievement.points;
      await user.save();
    }

    res.json({ success: true, achievement });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAchievements, unlockAchievement };