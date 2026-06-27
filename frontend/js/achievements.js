document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  const grid = document.getElementById('ach-grid');

  try {
    const res  = await fetch('/api/achievements', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    const all      = data.achievements || [];
    const unlocked = data.unlocked     || [];
    const unlockedIds = unlocked.map(u => u._id || u);

    let totalPoints = 0;
    let unlockedCount = 0;

    grid.innerHTML = '';

    // Sort: unlocked first
    const sorted = [...all].sort((a, b) => {
      const aU = unlockedIds.includes(a._id);
      const bU = unlockedIds.includes(b._id);
      return bU - aU;
    });

    sorted.forEach((ach, i) => {
      const isUnlocked = unlockedIds.includes(ach._id);
      if (isUnlocked) {
        unlockedCount++;
        totalPoints += ach.points || 0;
      }

      const card = document.createElement('div');
      card.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'} fade-in-up`;
      card.style.animationDelay = (i * 0.06) + 's';

      card.innerHTML = `
        <div class="ach-icon">${ach.icon || '🏆'}</div>
        <div class="ach-info">
          <div class="ach-name">${ach.title}</div>
          <div class="ach-desc">${ach.description}</div>
          <div class="ach-points">+${ach.points} pts</div>
        </div>
        <div class="ach-badge">${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}</div>
      `;
      grid.appendChild(card);
    });

    document.getElementById('ach-count').textContent  = unlockedCount;
    document.getElementById('ach-points').textContent = totalPoints;

    if (all.length === 0) {
      grid.innerHTML = '<p style="color:#666;text-align:center;grid-column:1/-1">No achievements found</p>';
    }

  } catch (err) {
    grid.innerHTML = `<p style="color:#ff6b6b;text-align:center;grid-column:1/-1">Error: ${err.message}</p>`;
  }
});