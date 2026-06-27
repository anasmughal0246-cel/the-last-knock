document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  const grid = document.getElementById('endings-grid');

  try {
    const data = await api.getEndings();
    grid.innerHTML = '';

    data.endings.forEach(e => {
      const card = document.createElement('div');
      card.className = `ach-card ${e.unlocked ? 'unlocked' : 'locked'} fade-in-up`;
      card.innerHTML = `
        <div class="ach-icon">${e.icon}</div>
        <div class="ach-info">
          <h3>${e.title}</h3>
          <p>${e.unlocked ? e.description : '???  Play to discover this ending'}</p>
          <div class="ach-status">${e.unlocked ? '✅ Discovered' : '🔒 Undiscovered'}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `<p style="color:#888">Error: ${err.message}</p>`;
  }
});