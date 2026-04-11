/*
 * Subtle, scroll-reactive binary decoration for the About page.
 */

export const initAboutBinaryRain = () => {
  const binaryRain = document.querySelector('.about-binary-rain');

  if (!binaryRain) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let hideTimeoutId = 0;

  const deactivate = () => {
    binaryRain.classList.remove('is-active');
  };

  const activate = () => {
    binaryRain.classList.add('is-active');
    window.clearTimeout(hideTimeoutId);
    hideTimeoutId = window.setTimeout(deactivate, 220);
  };

  window.addEventListener('scroll', activate, { passive: true });
};
