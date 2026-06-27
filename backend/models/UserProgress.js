const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentChapter: { type: Number, default: 1 },
  inventory: [{ type: String }],
  choicesMade: [{
    chapterNumber: Number,
    choiceText: String,
    timestamp: { type: Date, default: Date.now },
  }],
  score: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
  isCompleted: { type: Boolean, default: false },
  endingReached: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);