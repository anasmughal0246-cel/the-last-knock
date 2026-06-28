document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const nameEl = document.querySelector('.nav-username');
  if (nameEl) nameEl.textContent = user.username || 'Survivor';

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  // Show active genre
  const currentGenre = localStorage.getItem('selectedGenre') || 'horror';
  highlightGenre(currentGenre);
});

function selectGenre(genre) {
  localStorage.setItem('selectedGenre', genre);
  highlightGenre(genre);
  // Reset progress when genre changes
  api.resetProgress().catch(() => {});
}

function highlightGenre(genre) {
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.classList.remove('genre-active');
  });
  const activeBtn = document.querySelector('.genre-btn.' + genre);
  if (activeBtn) activeBtn.classList.add('genre-active');
}

async function newGame() {
  if (confirm('Start a new game? Your current progress will be lost.')) {
    await api.resetProgress();
    window.location.href = 'story.html';
  }
}