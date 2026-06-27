document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login.html'; return; }

  Sound.init();

  // ── Logout button ──
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/index.html';
    });
  }

  // ── Load saved preferences ──
  const soundToggle     = document.getElementById('sound-toggle');
  const uiSoundToggle   = document.getElementById('ui-sound-toggle');
  const typewriterSpeed = document.getElementById('typewriter-speed');
  const flickerToggle   = document.getElementById('flicker-toggle');
  const flicker         = document.querySelector('.flicker-overlay');

  soundToggle.checked   = localStorage.getItem('soundEnabled')    !== '0';
  uiSoundToggle.checked = localStorage.getItem('uiSoundEnabled')  !== '0';
  flickerToggle.checked = localStorage.getItem('flickerEnabled')  !== '0';

  const savedSpeed = localStorage.getItem('typewriterSpeed') || '20';
  typewriterSpeed.value = savedSpeed;

  if (!flickerToggle.checked && flicker) flicker.style.display = 'none';

  // ── Sound toggle ──
  soundToggle.addEventListener('change', () => {
    localStorage.setItem('soundEnabled', soundToggle.checked ? '1' : '0');
    Sound.setEnabled(soundToggle.checked);
    showAlert('Sound ' + (soundToggle.checked ? 'enabled' : 'disabled'), 'success');
  });

  // ── UI Sound toggle ──
  uiSoundToggle.addEventListener('change', () => {
    localStorage.setItem('uiSoundEnabled', uiSoundToggle.checked ? '1' : '0');
    showAlert('UI sounds ' + (uiSoundToggle.checked ? 'enabled' : 'disabled'), 'success');
  });

  // ── Typewriter speed ──
  typewriterSpeed.addEventListener('change', () => {
    localStorage.setItem('typewriterSpeed', typewriterSpeed.value);
    showAlert('Typewriter speed updated', 'success');
  });

  // ── Flicker toggle ──
  flickerToggle.addEventListener('change', () => {
    localStorage.setItem('flickerEnabled', flickerToggle.checked ? '1' : '0');
    if (flicker) flicker.style.display = flickerToggle.checked ? 'block' : 'none';
    showAlert('Flicker effect ' + (flickerToggle.checked ? 'enabled' : 'disabled'), 'success');
  });

  // ── Change password ──
  document.getElementById('change-password-btn').addEventListener('click', async () => {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword     = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword)
      return showAlert('All password fields are required', 'error');
    if (newPassword !== confirmPassword)
      return showAlert('New passwords do not match', 'error');
    if (newPassword.length < 6)
      return showAlert('Password must be at least 6 characters', 'error');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert('Password updated successfully!', 'success');
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value     = '';
      document.getElementById('confirm-password').value = '';
    } catch (err) {
      showAlert(err.message, 'error');
    }
  });

  // ── Reset progress ──
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (!confirm('Reset all story progress? This cannot be undone.')) return;
    try {
      await fetch('/api/progress', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showAlert('Progress reset successfully!', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    }
  });

  // ── Delete account ──
  document.getElementById('delete-btn').addEventListener('click', async () => {
    if (!confirm('DELETE your account permanently? All data will be lost forever.')) return;
    if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
    try {
      await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.clear();
      window.location.href = '/index.html';
    } catch (err) {
      showAlert(err.message, 'error');
    }
  });

  function showAlert(message, type) {
    const el = document.getElementById('account-alert');
    if (!el) return;
    el.innerHTML = `<div class="settings-alert ${type}">${message}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 3000);
  }
});