import { SELECTORS } from '../config.js';
import { qsa } from './dom.js';
import { prefersReducedMotion } from '../utils.js';

export const initReveal = () => {
  if (prefersReducedMotion()) return;
  const items = qsa(SELECTORS.reveal);
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
};
