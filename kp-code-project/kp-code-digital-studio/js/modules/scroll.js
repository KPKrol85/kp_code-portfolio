/*
 * In-page anchor scrolling enhancements.
 */

export const initSmoothScroll = () => {
  const anchors = document.querySelectorAll('a[href^="#"]');
  if (!anchors.length) {
    return;
  }

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        target.scrollIntoView();
        return;
      }

      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};
