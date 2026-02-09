import { prefersReducedMotion } from "./prefers-reduced-motion.js";

export const initScrollType = () => {
  const targets = document.querySelectorAll("[data-scroll-type]");
  if (!targets.length || prefersReducedMotion()) return;

  const onScroll = () => {
    const offset = window.scrollY;
    targets.forEach((el) => {
      const speed = 0.03;
      const translate = Math.min(24, offset * speed);
      el.style.transform = `translateY(${translate}px)`;
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};
