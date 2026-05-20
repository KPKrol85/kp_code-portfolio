import { prefersReducedMotion, qsa } from '../utils.js';

const COUNTER_SELECTOR = '[data-counter-target]';

function animateCounter(el) {
  const target = Number(el.dataset.counterTarget || 0);
  const suffix = el.dataset.counterSuffix || '';

  if (!Number.isFinite(target) || target < 0) return;

  if (prefersReducedMotion()) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const duration = 900;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * (1 - (1 - progress) ** 3));
    el.textContent = `${value}${suffix}`;

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

export function initHomeEnhancements() {
  const counters = qsa(COUNTER_SELECTOR);
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((counter) => observer.observe(counter));
}
