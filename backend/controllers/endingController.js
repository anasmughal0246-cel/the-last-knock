const Ending = require('../models/Ending');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

const getEndings = async (req, res, next) => {
  try {
    const all = await Ending.find();
    const completed = await UserProgress.find({ user: req.user._id, isCompleted: true });
    const reachedTypes = completed.map(p => p.endingReached);

    const endings = all.map(e => ({
      ...e.toObject(),
      unlocked: reachedTypes.includes(e.type),
    }));

    res.json({ success: true, endings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEndings };