auth.requireGuest();

const form     = document.getElementById('register-form');
const btn      = document.getElementById('register-btn');
const alertBox = document.getElementById('alert-box');

function showAlert(message, type = 'error') {
  alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username        = document.getElementById('username').value.trim();
  const email           = document.getElementById('email').value.trim();
  const password        = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!username || !email || !password || !confirmPassword)
    return showAlert('All fields are required.');
  if (password !== confirmPassword)
    return showAlert('Passwords do not match.');
  if (password.length < 6)
    return showAlert('Password must be at least 6 characters.');

  btn.disabled = true;
  btn.textContent = 'Creating profile...';

  try {
    const data = await api.register({ username, email, password });
    auth.setSession(data.token, data.user);
    showAlert('Welcome, survivor! Redirecting...', 'success');
    setTimeout(() => { window.location.href = '/dashboard.html'; }, 1000);
  } catch (err) {
    showAlert(err.message || 'Registration failed. Try again.');
    btn.disabled = false;
    btn.textContent = 'Begin the Story';
  }
});