let timerInterval = null;

function startTimer(seconds, onTimeUp) {
  clearInterval(timerInterval);
  const fill = document.getElementById('timer-fill');
  const container = document.getElementById('timer-container');
  if (!fill) return;

  container.style.display = 'block';
  fill.style.width = '100%';
  fill.style.transition = 'none';

  let remaining = seconds;

  setTimeout(() => {
    fill.style.transition = `width ${seconds}s linear`;
    fill.style.width = '0%';
  }, 100);

  timerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 5) {
      fill.style.background = '#ff0000';
    }
    if (remaining <= 0) {
      clearInterval(timerInterval);
      if (onTimeUp) onTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  const container = document.getElementById('timer-container');
  if (container) container.style.display = 'none';
}

window.startTimer = startTimer;
window.stopTimer  = stopTimer;