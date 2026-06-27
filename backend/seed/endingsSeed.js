const mongoose = require('mongoose');
const Ending = require('../models/Ending');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const endings = [
  { type: 'escape',    title: 'The Escape',     description: 'You ran and survived. The darkness could not claim you tonight.', icon: '🌅' },
  { type: 'trapped',   title: 'Trapped Forever', description: 'The darkness consumed you. There is no escape from what surrounds you.', icon: '💀' },
  { type: 'sacrifice', title: 'The Sacrifice',   description: 'You saved yourself at a terrible cost. Something remains behind forever.', icon: '🩸' },
  { type: 'unknown',   title: 'Lost in the Dark',description: 'Your fate is unknown. The night swallowed you whole.', icon: '❓' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    await Ending.deleteMany({});
    await Ending.insertMany(endings);
    console.log('✅ Endings seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();