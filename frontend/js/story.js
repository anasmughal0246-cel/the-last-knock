document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  Sound.init();
  initLoadingScreen(2400);

  try {
    const data = await api.getProgress();
    const startChapter = data.progress ? data.progress.currentChapter : 1;
    setTimeout(() => loadChapter(startChapter), 2500);
  } catch {
    setTimeout(() => loadChapter(1), 2500);
  }
});

const TOTAL_CHAPTERS = 17;
let currentChapter  = null;
let currentProgress = null;
let choicesLocked   = false;

const endings = {
  escape:    { icon: '🌅', title: 'You Escaped!',     text: 'Against all odds, you made it out alive. The night releases its grip — for now.' },
  trapped:   { icon: '💀', title: 'You Are Trapped',   text: 'The darkness has consumed you. There is no escape from The Last Knock.' },
  sacrifice: { icon: '🩸', title: 'The Sacrifice',     text: 'You saved others at a terrible cost. Your name will be remembered in the dark.' },
  unknown:   { icon: '❓', title: 'Lost in the Dark',  text: 'Your fate remains unknown. Some doors, once opened, never close.' },
};

function updateProgressBar(chapterNumber) {
  const pct = Math.min((chapterNumber / TOTAL_CHAPTERS) * 100, 100);
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';
}

async function loadChapter(chapterNumber) {
  choicesLocked = false;
  stopTimer();

  try {
    const data      = await api.getChapter(chapterNumber);
    currentChapter  = data.chapter;
    currentProgress = data.progress;

    document.getElementById('chapter-label').textContent   = 'Chapter ' + currentChapter.chapterNumber;
    document.getElementById('score').textContent           = currentProgress.score;
    document.getElementById('chapter-title').textContent   = currentChapter.title;

    const inv = currentProgress.inventory;
    document.getElementById('inventory-items').textContent = inv.length ? inv.join(' · ') : 'Empty';

    updateProgressBar(currentChapter.chapterNumber);
    Sound.startAmbience(currentChapter.ambience || 'ambient');

    const textEl = document.getElementById('story-text');
    document.getElementById('choices-container').innerHTML = '';

    const speed = parseInt(localStorage.getItem('typewriterSpeed') || '20');
    typeWriter(textEl, currentChapter.content, speed, () => {
      if (currentChapter.isEnding) {
        Sound.stopAmbience();
        Sound.playHorrorSting();
        showEnding(currentChapter.endingType, currentProgress.score);
        return;
      }
      renderChoices(currentChapter.choices);
      if (currentChapter.timeLimit) {
        const timerEl = document.getElementById('timer-display');
        if (timerEl) timerEl.classList.remove('hidden');
        startTimer(currentChapter.timeLimit, () => { if (!choicesLocked) makeChoice(0); });
      }
    });

  } catch (err) {
    document.getElementById('story-text').textContent = 'Error: ' + err.message;
  }
}

function renderChoices(choices) {
  const container = document.getElementById('choices-container');
  container.innerHTML = '';
  choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn fade-in-up';
    btn.textContent = choice.text;
    btn.style.animationDelay = (index * 0.1) + 's';
    btn.addEventListener('click', () => {
      Sound.playClick();
      makeChoice(index);
    });
    container.appendChild(btn);
  });
}

async function makeChoice(choiceIndex) {
  if (choicesLocked) return;
  choicesLocked = true;

  const timerEl = document.getElementById('timer-display');
  if (timerEl) timerEl.classList.add('hidden');
  stopTimer();

  const flash = document.getElementById('flash-overlay');
  flash.style.background = 'rgba(139,0,0,0.25)';
  flash.style.opacity    = '1';
  setTimeout(() => { flash.style.opacity = '0'; }, 300);

  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  try {
    const data = await api.makeChoice(currentChapter.chapterNumber, { choiceIndex });

    if (data.newAchievements && data.newAchievements.length) {
      data.newAchievements.forEach((ach, i) => {
        setTimeout(() => {
          Sound.playAchievementChime();
          showAchievementPopup(ach);
        }, i * 1200);
      });
    }

    setTimeout(() => loadChapter(data.nextChapter), 600);
  } catch (err) {
    alert(err.message);
    choicesLocked = false;
  }
}

function showAchievementPopup(ach) {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position:fixed; bottom:30px; right:30px; z-index:500;
    background:#111; border:1px solid #8b0000;
    border-radius:10px; padding:16px 20px;
    display:flex; align-items:center; gap:14px;
    box-shadow:0 0 20px rgba(139,0,0,0.4);
    animation:fadeInUp 0.4s ease;
    max-width:300px;
  `;
  popup.innerHTML = `
    <span style="font-size:2rem">${ach.icon}</span>
    <div>
      <div style="font-family:'Creepster',cursive;color:#c0392b;font-size:1.1rem">Achievement Unlocked!</div>
      <div style="color:#e8e8e8;font-size:0.95rem">${ach.title}</div>
      <div style="color:#b8860b;font-family:'Share Tech Mono',monospace;font-size:12px">+${ach.points} pts</div>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

function showEnding(type, score) {
  const ending = endings[type] || endings.unknown;
  document.getElementById('ending-icon').textContent  = ending.icon;
  document.getElementById('ending-title').textContent = ending.title;
  document.getElementById('ending-text').textContent  = ending.text;
  document.getElementById('final-score').textContent  = score;
  document.getElementById('ending-screen').classList.remove('hidden');

  localStorage.setItem('lastEnding', JSON.stringify({ type, score, title: ending.title }));
}

function shareEnding() {
  const ending = JSON.parse(localStorage.getItem('lastEnding') || '{}');
  const text = `I just played "The Last Knock" horror story and got the "${ending.title}" ending with ${ending.score} points! Can you survive? 👻🩸`;
  if (navigator.share) {
    navigator.share({ title: 'The Last Knock', text });
  } else {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! Share it with friends 👻');
  }
}

function restartGame() {
  api.resetProgress().then(() => {
    document.getElementById('ending-screen').classList.add('hidden');
    loadChapter(1);
  });
}