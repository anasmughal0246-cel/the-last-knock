document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const nameEl = document.querySelector('.nav-username');
  if (nameEl) nameEl.textContent = user.username || 'Survivor';

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  // Show admin link if admin email
  try {
    const res  = await fetch('/api/auth/me', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    if (data.user && data.user.email === 'anasmughal0246@gmail.com') {
      const nav        = document.querySelector('.dash-nav');
      const logoutBtn  = document.getElementById('logout-btn');
      const adminLink  = document.createElement('a');
      adminLink.href        = 'admin.html';
      adminLink.textContent = '&#128295; Admin';
      adminLink.style.cssText = 'color:#b8860b;font-family:Share Tech Mono,monospace;font-size:14px;text-decoration:none;';
      nav.insertBefore(adminLink, logoutBtn);
    }
  } catch(e) {}

  // Show active genre
  const currentGenre = localStorage.getItem('selectedGenre') || 'horror';
  highlightGenre(currentGenre);
});

function selectGenre(genre) {
  localStorage.setItem('selectedGenre', genre);
  highlightGenre(genre);
  // Reset progress when switching genre
  const token = localStorage.getItem('token');
  fetch('/api/progress', {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  }).catch(() => {});
}

function highlightGenre(genre) {
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.classList.remove('genre-active');
  });
  const activeBtn = document.querySelector('.genre-btn.' + genre);
  if (activeBtn) activeBtn.classList.add('genre-active');

  const label = document.getElementById('genre-label');
  if (label) label.textContent = 'SELECTED: ' + genre.toUpperCase();
}

async function newGame() {
  if (!confirm('Start a new game? Your current progress will be lost.')) return;
  await fetch('/api/progress', {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
  window.location.href = 'story.html';
}