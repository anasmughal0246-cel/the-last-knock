const Chapter = require('../models/Chapter');
const UserProgress = require('../models/UserProgress');
const StoryChoice = require('../models/StoryChoice');

const storyEngine = {
  // Get chapter by number
  async getChapter(chapterNumber) {
    const chapter = await Chapter.findOne({ chapterNumber });
    if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);
    return chapter;
  },

  // Get or create user progress
  async getProgress(userId) {
    let progress = await UserProgress.findOne({ user: userId, isCompleted: false });
    if (!progress) {
      progress = await UserProgress.create({ user: userId });
    }
    return progress;
  },

  // Process a choice
  async makeChoice(userId, chapterNumber, choiceIndex) {
    const chapter = await storyEngine.getChapter(chapterNumber);
    const choice = chapter.choices[choiceIndex];
    if (!choice) throw new Error('Invalid choice');

    const progress = await storyEngine.getProgress(userId);

    // Check required item
    if (choice.requiredItem && !progress.inventory.includes(choice.requiredItem)) {
      throw new Error(`You need the ${choice.requiredItem} to make this choice`);
    }

    // Update inventory
    if (choice.addsItem) progress.inventory.push(choice.addsItem);
    if (choice.removesItem) {
      progress.inventory = progress.inventory.filter(i => i !== choice.removesItem);
    }

    // Update score
    progress.score += choice.scorePoints || 0;

    // Save choice
    progress.choicesMade.push({
      chapterNumber,
      choiceText: choice.text,
    });

    // Move to next chapter
    progress.currentChapter = choice.nextChapter;

    // Check if ending
    const nextChapter = await Chapter.findOne({ chapterNumber: choice.nextChapter });
    if (nextChapter && nextChapter.isEnding) {
      progress.isCompleted = true;
      progress.endTime = new Date();
      progress.endingReached = nextChapter.endingType;
    }

    await progress.save();

    // Log choice
    await StoryChoice.create({
      user: userId,
      chapterNumber,
      choiceText: choice.text,
      nextChapter: choice.nextChapter,
    });

    return { progress, nextChapter: choice.nextChapter, choice };
  },
};

module.exports = storyEngine;