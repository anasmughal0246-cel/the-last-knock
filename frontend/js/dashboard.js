document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const nameEl = document.querySelector('.nav-username');
  if (nameEl) nameEl.textContent = user.username || 'Survivor';

  // Hide admin link if not admin
  const adminLink = document.querySelector('a[href="admin.html"]');
  if (adminLink && user.role !== 'admin') {
    adminLink.style.display = 'none';
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });
});

async function newGame() {
  if (!confirm('Start a new game? Your current progress will be lost.')) return;
  const token = localStorage.getItem('token');
  await fetch('/api/progress', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  window.location.href = 'story.html';
}