// features/compact-header.js
export function initCompactHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Bierzemy wysokość headera z CSS (fallback 68px)
  const root = document.documentElement;
  const cssH = parseInt(getComputedStyle(root).getPropertyValue("--header-h"), 10) || 68;

  // Histereza: włącz compact po większym progu, wyłącz po mniejszym
  const ENTER = Math.round(cssH * 0.8); // np. ~54px
  const LEAVE = Math.round(cssH * 0.4); // np. ~27px

  let compact = false; // aktualny stan
  let ticking = false;

  const apply = () => {
    const y = window.scrollY;

    // Wejście w compact
    if (!compact && y > ENTER) {
      compact = true;
      header.classList.add("is-compact");
    }
    // Wyjście z compact
    else if (compact && y < LEAVE) {
      compact = false;
      header.classList.remove("is-compact");
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(apply);
      ticking = true;
    }
  };

  // Start
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  apply();
}
