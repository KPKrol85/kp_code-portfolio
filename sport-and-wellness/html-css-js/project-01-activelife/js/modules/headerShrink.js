export function initHeaderShrink() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
