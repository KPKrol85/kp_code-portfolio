export function initCompactHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const SCROLL_THRESHOLD = 40;
  let isCompact = false;

  const handleScroll = () => {
    const shouldCompact = window.scrollY > SCROLL_THRESHOLD;
    if (shouldCompact === isCompact) return;

    isCompact = shouldCompact;
    header.classList.toggle("header--compact", shouldCompact);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });
}
