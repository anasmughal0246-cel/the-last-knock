const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('achievements');
    const allProgress = await UserProgress.find({ user: req.user._id, isCompleted: true });

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        totalScore: user.totalScore,
        gamesPlayed: allProgress.length,
        achievements: user.achievements,
        avatar: user.avatar,
        role: user.role,
        joinedAt: user.createdAt,
        endingsFound: allProgress.map(p => p.endingReached).filter(Boolean),
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return next(new Error('Avatar is required'));

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );

    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username totalScore gamesPlayed avatar')
      .sort({ totalScore: -1 })
      .limit(10);

    res.json({ success: true, leaderboard: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateAvatar, getLeaderboard };