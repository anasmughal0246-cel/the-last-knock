function initLoadingScreen(duration = 2200) {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  const messages = [
    'Lighting the candles...',
    'Opening the door...',
    'Something stirs in the dark...',
    'The house remembers you...',
    'Do not look behind you...',
  ];

  const msgEl = screen.querySelector('.loading-msg');
  let i = 0;
  const msgInterval = setInterval(() => {
    i = (i + 1) % messages.length;
    if (msgEl) msgEl.textContent = messages[i];
  }, 600);

  setTimeout(() => {
    clearInterval(msgInterval);
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
    }, 800);
  }, duration);
}