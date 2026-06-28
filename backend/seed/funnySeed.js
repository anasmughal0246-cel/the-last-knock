const mongoose = require('mongoose');
const Chapter = require('../models/Chapter');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const funnyChapters = [
  {
    chapterNumber: 101,
    genre: 'funny',
    title: 'The Haunted Biryani',
    content: `It's 2 AM and you're starving. You open the fridge and find leftover biryani from 3 days ago. Suddenly the biryani container starts shaking. A tiny ghost pops out wearing a chef's hat. "FINALLY!" it shouts. "Someone to appreciate my cooking! I've been haunting this biryani for 3 days waiting for someone brave enough to eat it!"`,
    ambience: 'ambient',
    timeLimit: null,
    choices: [
      { text: 'Eat the biryani — ghost or not, you\'re hungry', nextChapter: 102, scorePoints: 20 },
      { text: 'Ask the ghost for a fresh batch', nextChapter: 103, scorePoints: 15 },
      { text: 'Run screaming from your own kitchen', nextChapter: 104, scorePoints: 5 },
    ],
  },
  {
    chapterNumber: 102,
    genre: 'funny',
    title: 'Best Biryani Ever',
    content: `You eat the biryani. It's INCREDIBLE. The ghost starts crying tears of joy. "You actually ate it! No one ever eats my biryani!" Between sobs, he hands you a golden spoon. "You are now the chosen one — destined to eat all haunted food in the city." Your stomach rumbles. This might be the best and worst day of your life.`,
    ambience: 'ambient',
    choices: [
      { text: 'Accept your destiny as the Haunted Food Champion', nextChapter: 105, scorePoints: 30 },
      { text: 'Ask if there\'s haunted dessert too', nextChapter: 106, scorePoints: 25 },
    ],
  },
  {
    chapterNumber: 103,
    genre: 'funny',
    title: 'Ghost Chef Gordon',
    content: `The ghost gasps. "A FRESH BATCH?! Do you know how long it takes to haunt biryani?! THREE DAYS of marinating in the spirit world!" He pulls out a tiny ghost cookbook. "Fine. But you have to be my Masterchef judge." Your kitchen suddenly fills with 5 ghost contestants all holding pots and glaring at each other.`,
    ambience: 'ambient',
    choices: [
      { text: 'Judge the ghost cooking competition', nextChapter: 107, scorePoints: 35 },
      { text: 'Quietly back away and order pizza', nextChapter: 108, scorePoints: 10 },
    ],
  },
  {
    chapterNumber: 104,
    genre: 'funny',
    title: 'The Dramatic Exit',
    content: `You run screaming. The ghost chases you through your apartment waving a ladle. "WAIT! At least take a container for tomorrow!" You jump out the window — thankfully you live on the ground floor. You land in your neighbor's BBQ party. Everyone stares. A ghost floats through the wall holding a biryani container with a bow on it.`,
    ambience: 'ambient',
    choices: [
      { text: 'Accept the biryani gracefully', nextChapter: 102, scorePoints: 15 },
      { text: 'Introduce the ghost to your neighbors', nextChapter: 109, scorePoints: 30 },
    ],
  },
  {
    chapterNumber: 105,
    genre: 'funny',
    title: 'Haunted Food Champion',
    content: `You become legendary. Ghost restaurants open for you everywhere. The haunted samosas of Karachi, the cursed chapli kabab of Peshawar, the possessed gulab jamun of Lahore — all yours. You write a food blog called "Eating with the Dead" and get 2 million followers. Life is strange but delicious.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'escape',
    choices: [],
  },
  {
    chapterNumber: 106,
    genre: 'funny',
    title: 'Haunted Dessert',
    content: `"Haunted dessert?!" The ghost screams with excitement and pulls out a haunted kheer that glows purple. You eat it. You can now talk to desserts. The gulab jamun in the pantry has been trying to tell you something for years. This is fine.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'unknown',
    choices: [],
  },
  {
    chapterNumber: 107,
    genre: 'funny',
    title: 'Ghost Masterchef',
    content: `You judge the competition. Ghost #3 wins with a haunted haleem. Everyone cries ectoplasm. You are crowned "Judge of the Spirit World Kitchen" and given a tiny ghost crown. Your life has taken a very unexpected turn but honestly you've had worse Tuesdays.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'escape',
    choices: [],
  },
  {
    chapterNumber: 108,
    genre: 'funny',
    title: 'Pizza Saves the Day',
    content: `You order pizza. The delivery guy arrives in 30 minutes. He is also a ghost. "We all are," he says sadly, handing you the box. The pizza is excellent. You leave a 5 star review. In the comments you write "great service, delivery ghost was very professional."`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'unknown',
    choices: [],
  },
  {
    chapterNumber: 109,
    genre: 'funny',
    title: 'Ghost of the Party',
    content: `Your neighbor adopts the biryani ghost. He becomes the life of every BBQ. Gets his own Instagram. 500k followers in a week. You get 10% as his manager. The ghost biryani wins a national food award. You both cry at the ceremony. Best friendship ever.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'escape',
    choices: [],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected...');
    await Chapter.deleteMany({ genre: 'funny' });
    await Chapter.insertMany(funnyChapters);
    console.log('✅ Funny chapters seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();