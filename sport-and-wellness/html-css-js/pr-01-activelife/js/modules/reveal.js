const revealNoop = () => {};
let isRevealInitialized = false;
let destroyReveal = revealNoop;

function revealAllImmediately(elements) {
  elements.forEach((el) => {
    el.classList.add("is-revealed");
    el.dataset.revealReady = "true";
  });
}

export function initReveal() {
  if (isRevealInitialized) {
    return destroyReveal;
  }

  const root = document.documentElement;
  root.classList.add("js");

  const elements = document.querySelectorAll("[data-reveal]");

  if (!elements.length) {
    destroyReveal = revealNoop;
    return destroyReveal;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealAllImmediately(elements);
    isRevealInitialized = true;
    destroyReveal = () => {
      isRevealInitialized = false;
      destroyReveal = revealNoop;
    };
    return destroyReveal;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          entry.target.dataset.revealReady = "true";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => {
    if (el.dataset.revealReady === "true") {
      return;
    }

    observer.observe(el);
    el.dataset.revealReady = "true";
  });

  isRevealInitialized = true;
  destroyReveal = () => {
    observer.disconnect();
    isRevealInitialized = false;
    destroyReveal = revealNoop;
  };

  return destroyReveal;
}
