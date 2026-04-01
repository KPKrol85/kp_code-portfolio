/*
 * Scroll-reveal behavior for sections and grouped reveal items.
 */

const REVEAL_SELECTOR = "[data-reveal], [data-reveal-item]";
const REVEAL_OPTIONS = {
  root: null,
  rootMargin: "0px 0px -6% 0px",
  threshold: 0.08,
};

const markVisible = (element) => {
  element.classList.add("reveal", "is-visible");
  element.classList.remove("reveal--pending");
};

const armReveal = (element) => {
  element.classList.add("reveal", "reveal--pending");
  element.classList.remove("is-visible");
};

const setStaggerOrder = () => {
  const revealGroups = document.querySelectorAll("[data-reveal-group]");
  revealGroups.forEach((group) => {
    const items = Array.from(group.querySelectorAll("[data-reveal-item]"));
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-index", String(index));
    });
  });
};

const isInitiallyVisible = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.bottom > 0 && rect.top <= viewportHeight * 0.9;
};

export const initReveal = () => {
  const revealElements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
  if (!revealElements.length) {
    return;
  }

  setStaggerOrder();

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach(markVisible);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      markVisible(entry.target);
      observer.unobserve(entry.target);
    });
  }, REVEAL_OPTIONS);

  revealElements.forEach((element) => {
    if (isInitiallyVisible(element)) {
      markVisible(element);
      return;
    }

    armReveal(element);
    observer.observe(element);
  });
};
