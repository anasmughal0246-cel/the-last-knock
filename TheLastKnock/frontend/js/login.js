document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    window.location.href = '/dashboard.html';
    return;
  }

  const form     = document.getElementById('login-form');
  const btn      = document.getElementById('login-btn');
  const alertBox = document.getElementById('alert-box');

  function showAlert(message, type = 'error') {
    alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) return showAlert('Email and password are required.');

    btn.disabled = true;
    btn.textContent = 'Entering the dark...';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      showAlert('Welcome back! Redirecting...', 'success');
      setTimeout(() => { window.location.href = '/dashboard.html'; }, 800);

    } catch (err) {
      showAlert(err.message || 'Login failed.');
      btn.disabled = false;
      btn.textContent = 'Enter the Dark';
    }
  });
});