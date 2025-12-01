// Shrinks header once user scrolls past threshold
export function initCompactHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const SCROLL_THRESHOLD = 40;
  let isCompact = false;

  const handleScroll = () => {
    const shouldCompact = window.scrollY > SCROLL_THRESHOLD;

    // jeśli stan się nie zmienił, nic nie rób
    if (shouldCompact === isCompact) return;

    isCompact = shouldCompact;
    header.classList.toggle("header--compact", shouldCompact);
  };

  // uruchom raz na starcie (np. jak wejdziemy od razu w środek strony)
  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });
}
