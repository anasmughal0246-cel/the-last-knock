const Chapter = require('../models/Chapter');
const UserProgress = require('../models/UserProgress');
const StoryChoice = require('../models/StoryChoice');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// Achievement rules — which action unlocks which key
const ACHIEVEMENT_RULES = {
  first_choice:  () => true,                          // always on first choice
  knife_wielder: (choice) => choice.addsItem === 'knife',
  key_holder:    (choice) => choice.addsItem === 'mysterious_key',
  into_the_dark: (choice) => choice.nextChapter === 11,
  the_watcher:   (choice) => choice.nextChapter === 8,
  explorer:      (_, progress) => progress.choicesMade.length >= 4,
};

async function unlockAchievement(userId, key) {
  try {
    const achievement = await Achievement.findOne({ key });
    if (!achievement) return;
    const user = await User.findById(userId);
    if (user.achievements.includes(achievement._id)) return; // already unlocked
    user.achievements.push(achievement._id);
    user.totalScore += achievement.points;
    await user.save();
    return achievement; // return so we can notify frontend
  } catch (e) { /* silent fail */ }
}

const storyEngine = {
  async getChapter(chapterNumber) {
    const chapter = await Chapter.findOne({ chapterNumber });
    if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);
    return chapter;
  },

  async getProgress(userId) {
    let progress = await UserProgress.findOne({ user: userId, isCompleted: false });
    if (!progress) progress = await UserProgress.create({ user: userId });
    return progress;
  },

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
    if (choice.addsItem)    progress.inventory.push(choice.addsItem);
    if (choice.removesItem) progress.inventory = progress.inventory.filter(i => i !== choice.removesItem);

    // Update score
    progress.score += choice.scorePoints || 0;
    progress.choicesMade.push({ chapterNumber, choiceText: choice.text });
    progress.currentChapter = choice.nextChapter;

    // Check ending
    const nextChapter = await Chapter.findOne({ chapterNumber: choice.nextChapter });
    if (nextChapter && nextChapter.isEnding) {
      progress.isCompleted  = true;
      progress.endTime      = new Date();
      progress.endingReached = nextChapter.endingType;

      // Add final score to user total
      const user = await User.findById(userId);
      user.totalScore += progress.score;
      await user.save();

      // Unlock survivor/sacrifice/ending achievements
      if (nextChapter.endingType === 'escape')    await unlockAchievement(userId, 'survivor');
      if (nextChapter.endingType === 'sacrifice') await unlockAchievement(userId, 'sacrifice');

      // Speed runner — under 3 minutes
      const timeTaken = (new Date() - progress.startTime) / 1000;
      if (timeTaken < 180) await unlockAchievement(userId, 'speed_runner');
    }

    await progress.save();

    // Log choice
    await StoryChoice.create({ user: userId, chapterNumber, choiceText: choice.text, nextChapter: choice.nextChapter });

    // Check achievement rules
    const newAchievements = [];
    for (const [key, rule] of Object.entries(ACHIEVEMENT_RULES)) {
      if (rule(choice, progress)) {
        const ach = await unlockAchievement(userId, key);
        if (ach) newAchievements.push(ach);
      }
    }

    return { progress, nextChapter: choice.nextChapter, choice, newAchievements };
  },
};

module.exports = storyEngine;