import { qsa } from './dom.js';
import { prefersReducedMotion } from '../utils.js';

export const initReveal = () => {
  if (prefersReducedMotion()) return;
  const elements = qsa('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.forEach((el) => observer.observe(el));
};
