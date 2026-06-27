const auth = {
  setSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },
  isLoggedIn() { return !!localStorage.getItem('token'); },
  requireAuth() {
    if (!auth.isLoggedIn()) window.location.href = '/login.html';
  },
  requireGuest() {
    if (auth.isLoggedIn()) window.location.href = '/dashboard.html';
  },
  logout() {
    auth.clearSession();
    window.location.href = '/index.html';
  },
};
window.auth = auth;

document.addEventListener('DOMContentLoaded', () => {
  const user = auth.getUser();
  const logoutBtns = document.querySelectorAll('.logout-btn');
  const userNameEl = document.querySelector('.nav-username');
  logoutBtns.forEach(btn => btn.addEventListener('click', auth.logout));
  if (userNameEl && user) userNameEl.textContent = user.username;
});