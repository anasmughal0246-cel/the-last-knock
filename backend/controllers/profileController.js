const User         = require('../models/User');
const UserProgress = require('../models/UserProgress');

const getProfile = async (req, res, next) => {
  try {
    const user        = await User.findById(req.user._id).populate('achievements');
    const allProgress = await UserProgress.find({ user: req.user._id, isCompleted: true });

    res.json({
      success: true,
      profile: {
        username:     user.username,
        email:        user.email,
        totalScore:   user.totalScore,
        gamesPlayed:  allProgress.length,
        achievements: user.achievements,
        joinedAt:     user.createdAt,
      },
    });
  } catch (err) { next(err); }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find(
      { totalScore: { $gt: 0 } },
      'username totalScore gamesPlayed'
    ).sort({ totalScore: -1 }).limit(20).lean();

    res.json({ success: true, leaderboard: users });
  } catch (err) { next(err); }
};

module.exports = { getProfile, getLeaderboard };