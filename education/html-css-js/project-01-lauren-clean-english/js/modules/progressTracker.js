export const initProgressTracker = () => {
  const items = document.querySelectorAll('[data-progress-item] .progress__toggle');
  if (!items.length) return;

  items.forEach((button) => {
    button.addEventListener('click', () => {
      const isPressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!isPressed));
      button.querySelector('.progress__icon').textContent = isPressed ? '○' : '✓';
    });
  });
};
