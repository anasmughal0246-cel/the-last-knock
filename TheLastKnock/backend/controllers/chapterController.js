const Chapter = require('../models/Chapter');
const storyEngine = require('../services/storyEngineService');
const UserProgress = require('../models/UserProgress');

// GET /api/chapters/:id
const getChapter = async (req, res, next) => {
  try {
    const chapter = await storyEngine.getChapter(parseInt(req.params.id));
    const progress = await storyEngine.getProgress(req.user._id);

    // Filter hidden choices based on inventory
    const visibleChoices = chapter.choices.filter(c => {
      if (c.isHidden && c.requiredItem && !progress.inventory.includes(c.requiredItem)) return false;
      return true;
    });

    res.json({
      success: true,
      chapter: { ...chapter.toObject(), choices: visibleChoices },
      progress: {
        inventory: progress.inventory,
        score: progress.score,
        currentChapter: progress.currentChapter,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/chapters/:id/choice
const makeChoice = async (req, res, next) => {
  try {
    const { choiceIndex } = req.body;
    const chapterNumber = parseInt(req.params.id);

    const result = await storyEngine.makeChoice(req.user._id, chapterNumber, choiceIndex);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// GET /api/chapters (all chapters - admin only)
const getAllChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.find().sort({ chapterNumber: 1 });
    res.json({ success: true, chapters });
  } catch (error) {
    next(error);
  }
};

module.exports = { getChapter, makeChoice, getAllChapters };