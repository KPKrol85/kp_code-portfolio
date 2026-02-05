import { prefersReducedMotion } from "./prefers-reduced-motion.js";

export const initCounters = () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach((el) => (el.textContent = el.dataset.counter));
    return;
  }

  const animate = (el) => {
    const target = Number(el.dataset.counter || 0);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = current;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
};
