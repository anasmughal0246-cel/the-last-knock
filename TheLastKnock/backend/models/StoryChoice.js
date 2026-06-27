const mongoose = require('mongoose');

const storyChoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapterNumber: { type: Number, required: true },
  choiceText: { type: String, required: true },
  nextChapter: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StoryChoice', storyChoiceSchema);