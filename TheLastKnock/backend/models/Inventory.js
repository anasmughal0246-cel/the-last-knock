const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);