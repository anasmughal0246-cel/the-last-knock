const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const achievements = [
  { key: 'first_choice',   title: 'First Step',       description: 'Made your first choice in the story.',         icon: '👣', points: 10 },
  { key: 'survivor',       title: 'Survivor',          description: 'Reached an escape ending.',                    icon: '🌅', points: 50 },
  { key: 'explorer',       title: 'Explorer',          description: 'Reached chapter 5 or beyond.',                 icon: '🗺️', points: 30 },
  { key: 'speed_runner',   title: 'Speed Runner',      description: 'Completed the story in under 3 minutes.',      icon: '⚡', points: 40 },
  { key: 'completionist',  title: 'Completionist',     description: 'Unlocked all 4 different endings.',            icon: '💯', points: 100 },
  { key: 'knife_wielder',  title: 'Armed and Ready',   description: 'Picked up the kitchen knife.',                 icon: '🔪', points: 20 },
  { key: 'key_holder',     title: 'Key Holder',        description: 'Picked up the mysterious key.',                icon: '🗝️', points: 25 },
  { key: 'the_watcher',    title: 'The Watcher',       description: 'Stayed silent and watched the face.',          icon: '👁️', points: 30 },
  { key: 'sacrifice',      title: 'The Sacrifice',     description: 'Reached the sacrifice ending.',                icon: '🩸', points: 40 },
  { key: 'into_the_dark',  title: 'Into the Dark',     description: 'Descended into the basement.',                 icon: '🕳️', points: 20 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    await Achievement.deleteMany({});
    await Achievement.insertMany(achievements);
    console.log('✅ Achievements seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();