// Shrinks header once user scrolls past threshold
export function initCompactHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const onScroll = () => {
    const shouldCompact = window.scrollY > 40;
    header.classList.toggle("header--compact", shouldCompact);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
