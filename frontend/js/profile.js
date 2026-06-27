const HORROR_AVATARS = [
  { emoji: '👻', name: 'The Ghost' },
  { emoji: '💀', name: 'The Skull' },
  { emoji: '🧛', name: 'The Vampire' },
  { emoji: '🧟', name: 'The Zombie' },
  { emoji: '🕷️', name: 'The Spider' },
  { emoji: '🦇', name: 'The Bat' },
  { emoji: '🎃', name: 'The Pumpkin' },
  { emoji: '🕯️', name: 'The Candle' },
  { emoji: '🔮', name: 'The Oracle' },
  { emoji: '🌑', name: 'The Darkness' },
  { emoji: '🩸', name: 'The Blood' },
  { emoji: '🐺', name: 'The Wolf' },
  { emoji: '🕸️', name: 'The Web' },
  { emoji: '👁️', name: 'The Eye' },
  { emoji: '🗡️', name: 'The Blade' },
  { emoji: '🧿', name: 'The Curse' },
];

let currentAvatar = '👻';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  document.getElementById('change-avatar-btn').addEventListener('click', () => {
    document.getElementById('avatar-modal').classList.remove('hidden');
    renderAvatarGrid();
  });

  document.getElementById('avatar-close-btn').addEventListener('click', () => {
    document.getElementById('avatar-modal').classList.add('hidden');
  });

  document.getElementById('avatar-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('avatar-modal')) {
      document.getElementById('avatar-modal').classList.add('hidden');
    }
  });

  await loadProfile(token);
});

function getValidAvatar(avatar) {
  if (!avatar) return '👻';
  if (avatar.includes('.png') || avatar.includes('.jpg') || avatar.includes('http')) return '👻';
  return avatar;
}

function renderAvatarGrid() {
  const grid = document.getElementById('avatar-grid');
  grid.innerHTML = '';
  HORROR_AVATARS.forEach(av => {
    const btn = document.createElement('button');
    btn.className = 'avatar-option ' + (av.emoji === currentAvatar ? 'selected' : '');
    btn.innerHTML = '<span class="av-emoji">' + av.emoji + '</span><span class="av-name">' + av.name + '</span>';
    btn.addEventListener('click', () => selectAvatar(av.emoji));
    grid.appendChild(btn);
  });
}

async function selectAvatar(emoji) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/api/profile/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ avatar: emoji })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    currentAvatar = emoji;
    document.getElementById('profile-avatar').textContent = emoji;
    document.getElementById('avatar-modal').classList.add('hidden');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.avatar = emoji;
    localStorage.setItem('user', JSON.stringify(user));
    showToast('Avatar updated! ' + emoji);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#111;border:1px solid #8b0000;color:#e8e8e8;padding:14px 20px;border-radius:8px;font-family:Share Tech Mono,monospace;font-size:13px;z-index:999;box-shadow:0 0 20px rgba(139,0,0,0.3);';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const allEndings = [
  { type: 'escape',    icon: '🌅', name: 'Escape' },
  { type: 'trapped',   icon: '💀', name: 'Trapped' },
  { type: 'sacrifice', icon: '🩸', name: 'Sacrifice' },
  { type: 'unknown',   icon: '❓', name: 'Unknown' },
];

async function loadProfile(token) {
  try {
    const res = await fetch('/api/profile', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const data = await res.json();
    const user = data.user || data;

    currentAvatar = getValidAvatar(user.avatar);
    document.getElementById('profile-avatar').textContent = currentAvatar;
    document.getElementById('profile-username').textContent = user.username || 'Unknown';
    document.getElementById('profile-email').textContent = user.email || '';

    const badges = document.getElementById('profile-badges');
    badges.innerHTML = '';
    if (user.role === 'admin') badges.innerHTML += '<span class="profile-badge">Admin</span>';
    if ((user.totalScore || 0) > 100) badges.innerHTML += '<span class="profile-badge">Scorer</span>';
    if ((user.achievements || []).length >= 3) badges.innerHTML += '<span class="profile-badge">Collector</span>';

    document.getElementById('stat-score').textContent = user.totalScore || 0;
    document.getElementById('stat-games').textContent = user.gamesPlayed || 0;
    document.getElementById('stat-achievements').textContent = (user.achievements || []).length;

    const endingsFound = user.endingsFound || [];
    document.getElementById('stat-endings').textContent = endingsFound.length;

    const endingsGrid = document.getElementById('endings-grid');
    endingsGrid.innerHTML = '';
    allEndings.forEach(function(e) {
      const found = endingsFound.includes(e.type);
      const card = document.createElement('div');
      card.className = 'ending-card-small ' + (found ? 'found' : '') + ' fade-in-up';
      card.innerHTML = '<div class="e-icon">' + (found ? e.icon : '🔒') + '</div><div class="e-name">' + e.name + '</div><div class="e-status">' + (found ? 'Discovered' : 'Not yet found') + '</div>';
      endingsGrid.appendChild(card);
    });

    const achEl = document.getElementById('recent-ach');
    const achs = user.achievements || [];
    achEl.innerHTML = '';
    if (achs.length === 0) {
      achEl.innerHTML = '<p style="color:#666;font-size:1.1rem">No achievements yet. Play the story!</p>';
    } else {
      achs.slice(0, 5).forEach(function(ach) {
        const row = document.createElement('div');
        row.className = 'recent-ach-row fade-in-up';
        row.innerHTML = '<div class="recent-ach-icon">' + (ach.icon || '🏆') + '</div><div class="recent-ach-name">' + (ach.title || ach.key) + '</div><div class="recent-ach-pts">+' + (ach.points || 0) + ' pts</div>';
        achEl.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
  }
}