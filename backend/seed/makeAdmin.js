require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const dns      = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const makeAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  const user = await User.findOneAndUpdate(
   { email: 'anasmughal0246@gmail.com' },   // your email
    { role: 'admin' },
    { new: true }
  );
  if (user) console.log(`✅ ${user.username} is now admin!`);
  else console.log('❌ User not found — check email');
  process.exit(0);
};

makeAdmin();