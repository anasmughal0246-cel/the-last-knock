const mongoose = require('mongoose');
const Chapter = require('../models/Chapter');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const chapters = [
  {
    chapterNumber: 1,
    title: 'The Knock',
    content: `It's 3:00 AM. You're alone in your house when you hear it — three slow, deliberate knocks on your front door. Your heart pounds. No one should be here at this hour. The knocks come again, louder this time. Something feels deeply wrong.`,
    ambience: 'heartbeat',
    timeLimit: 30,
    choices: [
      { text: 'Open the front door', nextChapter: 2, scorePoints: 10 },
      { text: 'Look through the peephole first', nextChapter: 3, scorePoints: 20 },
      { text: 'Ignore it and hide under your bed', nextChapter: 4, scorePoints: 5 },
    ],
  },
  {
    chapterNumber: 2,
    title: 'The Open Door',
    content: `You swing the door open. The porch is empty — but the air is ice cold and smells of earth and rot. A trail of muddy footprints leads from the door into your house. They weren't there before. Something came in while you hesitated.`,
    ambience: 'ambient',
    choices: [
      { text: 'Follow the footprints inside', nextChapter: 5, scorePoints: 15 },
      { text: 'Run out the front door', nextChapter: 6, scorePoints: 10 },
      { text: 'Grab the kitchen knife first', nextChapter: 7, addsItem: 'knife', scorePoints: 20 },
    ],
  },
  {
    chapterNumber: 3,
    title: 'The Peephole',
    content: `You press your eye to the peephole. At first — nothing. Then, slowly, a face fills your vision. Pale. Wrong. It smiles directly at you as if it can see through the door. It whispers your name.`,
    ambience: 'whisper',
    choices: [
      { text: 'Scream and back away', nextChapter: 4, scorePoints: 5 },
      { text: 'Stay silent and watch it', nextChapter: 8, scorePoints: 25 },
      { text: 'Shout "Who are you?!"', nextChapter: 2, scorePoints: 10 },
    ],
  },
  {
    chapterNumber: 4,
    title: 'Hiding',
    content: `You crawl under your bed, pulling the blanket down to hide yourself. The house goes silent. Then you hear it — slow footsteps on your stairs. One. Two. Three. They stop outside your bedroom door. A shadow appears under the gap.`,
    ambience: 'footsteps',
    choices: [
      { text: 'Stay perfectly still', nextChapter: 9, scorePoints: 15 },
      { text: 'Roll out and run for the window', nextChapter: 10, scorePoints: 20 },
    ],
  },
  {
    chapterNumber: 5,
    title: 'Following the Trail',
    content: `The footprints lead to your basement door, which hangs open. A dim light flickers below. You hear something breathing down there — slow and heavy. On the floor beside the door, you notice an old photograph. It shows your house, taken tonight, with a figure watching you from inside.`,
    ambience: 'ambient',
    choices: [
      { text: 'Go down into the basement', nextChapter: 11, scorePoints: 20 },
      { text: 'Grab the photograph and run outside', nextChapter: 6, addsItem: 'photograph', scorePoints: 15 },
      { text: 'Slam the basement door and barricade it', nextChapter: 12, scorePoints: 25 },
    ],
  },
  {
    chapterNumber: 6,
    title: 'Escape',
    content: `You run. The cold night air hits your face as you sprint down the empty street. You don't look back. You reach a neighbor's house and pound on the door. When they open it, they look past you with wide, horrified eyes.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'escape',
    choices: [],
  },
  {
    chapterNumber: 7,
    title: 'Armed',
    content: `The kitchen knife feels cold in your hand. You move through the house carefully. Then you reach the bathroom. The door is closed. Steam seeps from under it. Someone is in your shower.`,
    ambience: 'ambient',
    choices: [
      { text: 'Burst in with the knife ready', nextChapter: 13, scorePoints: 25 },
      { text: 'Wait outside silently', nextChapter: 14, scorePoints: 20 },
      { text: 'Run to the front door', nextChapter: 6, scorePoints: 10 },
    ],
  },
  {
    chapterNumber: 8,
    title: 'The Watcher',
    content: `You watch the face at your peephole for what feels like hours. It never blinks. Then it holds up its hand — and in its palm is a small key. It slides the key under your door. The face disappears.`,
    ambience: 'whisper',
    choices: [
      { text: 'Pick up the key', nextChapter: 15, addsItem: 'mysterious_key', scorePoints: 30 },
      { text: 'Leave the key and call the police', nextChapter: 16, scorePoints: 15 },
    ],
  },
  {
    chapterNumber: 9,
    title: 'The Long Night',
    content: `You don't move. You barely breathe. The shadow under the door stays for hours. Then silence. When pale light creeps through the curtains, you finally crawl out. The house is empty. But on your pillow sits a note: "I'll be back tomorrow night."`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'unknown',
    choices: [],
  },
  {
    chapterNumber: 10,
    title: 'The Window',
    content: `You roll from under the bed and sprint for the window. You drop to the garden below and run to the street — and stop. Every house on your street has its lights on. Every neighbor stands at their window, watching you. All of them wearing the same pale face you saw at your door.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'trapped',
    choices: [],
  },
  {
    chapterNumber: 11,
    title: 'The Basement',
    content: `You descend into the basement. In the center of the room sits a chair — and in the chair sits something wearing your face. It opens its eyes. "You should not have come down here," it says in your voice. "Now I don't have to go up there."`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'trapped',
    choices: [],
  },
  {
    chapterNumber: 12,
    title: 'The Sacrifice',
    content: `You barricade the basement door with everything you can find. The pounding from below grows frantic, then stops. Dawn comes. The house is silent. You saved yourself — but when you check the mirror, your reflection doesn't move when you do. It smiles. You don't.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'sacrifice',
    choices: [],
  },
  {
    chapterNumber: 13,
    title: 'The Confrontation',
    content: `You burst into the bathroom. The shower runs cold — no one inside. But the mirror is fogged and words are written: "GIVE IT BACK." You spin around. The thing from the door stands behind you. It reaches for you.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'trapped',
    choices: [],
  },
  {
    chapterNumber: 14,
    title: 'The Wait',
    content: `You wait. The shower turns off. Silence. Then the door slowly opens — and no one comes out. The bathroom is empty. The window is open. Whatever was in there is now outside. You hear it on the roof above you.`,
    ambience: 'ambient',
    choices: [
      { text: 'Run outside now', nextChapter: 6, scorePoints: 20 },
      { text: 'Grab your phone and hide', nextChapter: 9, scorePoints: 15 },
    ],
  },
  {
    chapterNumber: 15,
    title: 'The Key',
    content: `The key is cold and old. When you try your basement door lock, it opens with a soft click. Below, instead of your basement, you see a long corridor lit with candles. At the end — a door with light spilling under it.`,
    ambience: 'ambient',
    choices: [
      { text: 'Walk toward the light', nextChapter: 17, scorePoints: 40 },
      { text: 'Lock the door and throw away the key', nextChapter: 9, scorePoints: 20 },
    ],
  },
  {
    chapterNumber: 16,
    title: 'The Call',
    content: `You call the police. They arrive in minutes and find nothing. As the officers leave, one of them turns at the door. His face is the face from the peephole. He tips his hat. "Have a good night. We'll be watching."`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'trapped',
    choices: [],
  },
  {
    chapterNumber: 17,
    title: 'The Other Side',
    content: `You walk through the door at the end of the corridor. Warm light floods over you. You're in a meadow under a summer sky. The nightmare is behind you. But as you breathe in the clean air, you notice your shadow pointing the wrong way — back toward the dark door slowly closing behind you.`,
    ambience: 'ambient',
    isEnding: true,
    endingType: 'escape',
    choices: [],
  },
];

const seedChapters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('MongoDB Connected for seeding...');
    await Chapter.deleteMany({});
    await Chapter.insertMany(chapters);
    console.log(`✅ ${chapters.length} chapters seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedChapters();