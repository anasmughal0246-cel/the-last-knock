const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  nextChapter: { type: Number, required: true },
  requiredItem: { type: String, default: null },
  addsItem: { type: String, default: null },
  removesItem: { type: String, default: null },
  scorePoints: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false },
});

const chapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, required: true, unique: true },
genre: {
  type: String,
  enum: ['horror', 'funny', 'mixed'],
  default: 'horror',
},
  title: { type: String, required: true },
  content: { type: String, required: true },
  choices: [choiceSchema],
  isEnding: { type: Boolean, default: false },
  endingType: { type: String, enum: ['escape', 'trapped', 'sacrifice', 'unknown', null], default: null },
  ambience: { type: String, default: 'ambient' },
  timeLimit: { type: Number, default: null },
  achievementTrigger: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);