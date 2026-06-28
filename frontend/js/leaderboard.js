document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const body        = document.getElementById('lb-body');

  // Show loading
  body.innerHTML = `
    <tr>
      <td colspan="4" style="text-align:center;padding:40px">
        <div class="spinner"></div>
        <div style="color:#888;font-family:'Share Tech Mono',monospace;font-size:13px;margin-top:12px">
          Loading your stats...
        </div>
      </td>
    </tr>`;

  try {
    // Get profile directly — faster than leaderboard
    const res  = await fetch('/api/profile', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();

    if (!data.success) throw new Error('Failed to load');

    const profile = data.profile;

    // Get rank separately
    const lbRes  = await fetch('/api/profile/leaderboard', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const lbData = await lbRes.json();

    const rank = lbData.leaderboard
      ? lbData.leaderboard.findIndex(u => u.username === profile.username) + 1
      : 0;

    const rankIcon = rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank > 0 ? `#${rank}` : '-';

    body.innerHTML = `
      <tr class="lb-me">
        <td class="lb-rank" style="font-size:1.5rem">${rankIcon}</td>
        <td>
          <div style="font-family:'Creepster',cursive;font-size:1.3rem;color:#e8e8e8">
            ${profile.username}
          </div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#c0392b;margin-top:4px">
            YOU
          </div>
        </td>
        <td class="lb-score" style="font-size:1.3rem">${profile.totalScore || 0}</td>
        <td style="color:#888;font-family:'Share Tech Mono',monospace;font-size:13px">
          ${profile.gamesPlayed || 0} games
        </td>
      </tr>
      <tr>
        <td colspan="4" style="
          text-align:center;
          padding:16px;
          color:#555;
          font-family:'Share Tech Mono',monospace;
          font-size:12px;
          border-top:1px solid #1a1a1a;
          letter-spacing:0.05em;
        ">
          ${rank > 0
            ? `RANKED ${rankIcon} OUT OF ${lbData.leaderboard.length} SURVIVORS`
            : 'PLAY THE GAME TO GET RANKED'}
        </td>
      </tr>
      <tr>
        <td colspan="4" style="text-align:center;padding:20px">
          <a href="story.html" style="
            padding:12px 28px;
            background:#8b0000;
            color:#fff;
            border:1px solid #c0392b;
            border-radius:4px;
            font-family:'Share Tech Mono',monospace;
            font-size:13px;
            text-decoration:none;
            display:inline-block;
            transition:all 0.2s;
          ">&#9654; Play to Improve Score</a>
        </td>
      </tr>
    `;

  } catch (err) {
    body.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:#888;padding:40px">
          Could not load stats. Please try again.
        </td>
      </tr>`;
  }
});