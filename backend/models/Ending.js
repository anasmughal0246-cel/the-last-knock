const mongoose = require('mongoose');

const endingSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '💀' },
}, { timestamps: true });

module.exports = mongoose.model('Ending', endingSchema);