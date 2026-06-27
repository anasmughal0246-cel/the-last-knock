const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/index.html';
});

let editingId   = null;
let allChapters = [];

// ── Load stats ──
async function loadStats() {
  try {
    const res  = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }
    document.getElementById('stat-users').textContent    = data.stats.totalUsers;
    document.getElementById('stat-chapters').textContent = data.stats.totalChapters;
    document.getElementById('stat-games').textContent    = data.stats.totalGames;
  } catch(e) { console.error(e); }
}

// ── Load chapters ──
async function loadChapters() {
  const list = document.getElementById('chapters-list');
  list.innerHTML = '<div class="spinner"></div>';
  try {
    const res  = await fetch('/api/admin/chapters', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    allChapters = data.chapters;
    list.innerHTML = '';
    data.chapters.forEach(ch => {
      const row = document.createElement('div');
      row.className = 'chapter-row fade-in-up';
      row.innerHTML = `
        <div class="chapter-row-info">
          <div class="chapter-row-num">CHAPTER ${ch.chapterNumber}</div>
          <div class="chapter-row-title">${ch.title}</div>
          <div class="chapter-row-meta">
            ${ch.choices.length} choices &nbsp;|&nbsp;
            ${ch.isEnding ? '🏁 Ending: ' + ch.endingType : '📖 Story'} &nbsp;|&nbsp;
            🎵 ${ch.ambience}
            ${ch.timeLimit ? '&nbsp;|&nbsp; ⏱️ ' + ch.timeLimit + 's' : ''}
          </div>
        </div>
        <div class="chapter-row-actions">
          <button class="btn-edit" onclick="openEditChapter('${ch._id}')">✏️ Edit</button>
          <button class="btn-del"  onclick="deleteChapter('${ch._id}', '${ch.title}')">🗑️ Delete</button>
        </div>
      `;
      list.appendChild(row);
    });
  } catch(e) { list.innerHTML = '<p style="color:#888">Error loading chapters</p>'; }
}

// ── Load users ──
async function loadUsers() {
  const list = document.getElementById('users-list');
  list.innerHTML = '<div class="spinner"></div>';
  try {
    const res  = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    list.innerHTML = '';
    data.users.forEach(u => {
      const row = document.createElement('div');
      row.className = 'user-row';
      row.innerHTML = `
        <div class="user-row-info">
          <div class="user-name">${u.username}</div>
          <div class="user-email">${u.email}</div>
        </div>
        <span class="user-role ${u.role === 'admin' ? 'admin-role' : ''}">${u.role}</span>
      `;
      list.appendChild(row);
    });
  } catch(e) { list.innerHTML = '<p style="color:#888">Error loading users</p>'; }
}

// ── Tabs ──
function showTab(tab) {
  document.getElementById('tab-chapters').classList.toggle('hidden', tab !== 'chapters');
  document.getElementById('tab-users').classList.toggle('hidden',    tab !== 'users');
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'chapters') || (i === 1 && tab === 'users'));
  });
  if (tab === 'users') loadUsers();
}

// ── Modal ──
function openAddChapter() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Add Chapter';
  document.getElementById('m-number').value    = '';
  document.getElementById('m-title').value     = '';
  document.getElementById('m-content').value   = '';
  document.getElementById('m-ambience').value  = 'ambient';
  document.getElementById('m-timelimit').value = '0';
  document.getElementById('m-isending').checked = false;
  document.getElementById('ending-type-row').style.display = 'none';
  document.getElementById('modal-alert').innerHTML = '';
  document.getElementById('chapter-modal').classList.remove('hidden');
}

function openEditChapter(id) {
  const ch = allChapters.find(c => c._id === id);
  if (!ch) return;
  editingId = id;
  document.getElementById('modal-title').textContent  = 'Edit Chapter';
  document.getElementById('m-number').value    = ch.chapterNumber;
  document.getElementById('m-title').value     = ch.title;
  document.getElementById('m-content').value   = ch.content;
  document.getElementById('m-ambience').value  = ch.ambience || 'ambient';
  document.getElementById('m-timelimit').value = ch.timeLimit || 0;
  document.getElementById('m-isending').checked = ch.isEnding;
  document.getElementById('ending-type-row').style.display = ch.isEnding ? 'block' : 'none';
  if (ch.endingType) document.getElementById('m-endingtype').value = ch.endingType;
  document.getElementById('modal-alert').innerHTML = '';
  document.getElementById('chapter-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('chapter-modal').classList.add('hidden');
  editingId = null;
}

document.getElementById('m-isending').addEventListener('change', (e) => {
  document.getElementById('ending-type-row').style.display = e.target.checked ? 'block' : 'none';
});

async function saveChapter() {
  const body = {
    chapterNumber: parseInt(document.getElementById('m-number').value),
    title:         document.getElementById('m-title').value.trim(),
    content:       document.getElementById('m-content').value.trim(),
    ambience:      document.getElementById('m-ambience').value,
    timeLimit:     parseInt(document.getElementById('m-timelimit').value) || null,
    isEnding:      document.getElementById('m-isending').checked,
    endingType:    document.getElementById('m-isending').checked ? document.getElementById('m-endingtype').value : null,
    choices:       editingId ? allChapters.find(c => c._id === editingId)?.choices || [] : [],
  };

  if (!body.chapterNumber || !body.title || !body.content) {
    showModalAlert('Chapter number, title and content are required', 'error');
    return;
  }

  const url    = editingId ? `/api/admin/chapters/${editingId}` : '/api/admin/chapters';
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    showModalAlert(editingId ? 'Chapter updated!' : 'Chapter created!', 'success');
    setTimeout(() => { closeModal(); loadChapters(); loadStats(); }, 1000);
  } catch(e) { showModalAlert(e.message, 'error'); }
}

async function deleteChapter(id, title) {
  if (!confirm(`Delete chapter "${title}"? This cannot be undone.`)) return;
  try {
    await fetch(`/api/admin/chapters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadChapters();
    loadStats();
  } catch(e) { alert(e.message); }
}

function showModalAlert(msg, type) {
  const el = document.getElementById('modal-alert');
  el.className = `modal-alert ${type}`;
  el.textContent = msg;
}

// ── Init ──
loadStats();
loadChapters();