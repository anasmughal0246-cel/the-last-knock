const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  points: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);