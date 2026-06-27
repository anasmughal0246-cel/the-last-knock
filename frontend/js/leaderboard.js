document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  const me = JSON.parse(localStorage.getItem('user') || '{}');

  try {
    const res  = await fetch('/api/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const users = data.leaderboard || data.users || [];

    // Podium — top 3
    const podium  = document.getElementById('lb-podium');
    const medals  = ['🥇','🥈','🥉'];
    const classes = ['rank-2','rank-1','rank-3'];
    const order   = [1, 0, 2]; // display: 2nd, 1st, 3rd

    podium.innerHTML = '';
    order.forEach(i => {
      const u = users[i];
      if (!u) return;
      const card = document.createElement('div');
      card.className = `podium-card ${classes[i]} fade-in-up`;
      card.innerHTML = `
        <span class="podium-medal">${medals[i]}</span>
        <div class="podium-name">${u.username}</div>
        <div class="podium-score">⚡ ${u.totalScore || 0}</div>
      `;
      podium.appendChild(card);
    });

    // Full list
    const list = document.getElementById('lb-list');
    list.innerHTML = '';

    if (users.length === 0) {
      list.innerHTML = '<p style="color:#666;text-align:center">No players yet. Be the first!</p>';
      return;
    }

    users.forEach((u, i) => {
      const isMe = u._id === me.id || u.username === me.username;
      const row  = document.createElement('div');
      row.className = `lb-row fade-in-up ${isMe ? 'is-me' : ''}`;
      row.style.animationDelay = (i * 0.05) + 's';
      row.innerHTML = `
        <div class="lb-rank">${i + 1}</div>
        <div class="lb-avatar">${u.username.charAt(0).toUpperCase()}</div>
        <div class="lb-name">${u.username}</div>
        <div class="lb-games">${u.gamesPlayed || 0} games</div>
        <div class="lb-score">⚡ ${u.totalScore || 0}</div>
      `;
      list.appendChild(row);
    });

  } catch (err) {
    document.getElementById('lb-list').innerHTML =
      `<p style="color:#ff6b6b;text-align:center">Error: ${err.message}</p>`;
  }
});