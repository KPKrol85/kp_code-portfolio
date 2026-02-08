const headerShrinkNoop = () => {};

let isHeaderShrinkInitialized = false;
let destroyHeaderShrink = headerShrinkNoop;

export function initHeaderShrink() {
  if (isHeaderShrinkInitialized) {
    return destroyHeaderShrink;
  }

  const header = document.querySelector("[data-header]");
  if (!header) {
    destroyHeaderShrink = headerShrinkNoop;
    return destroyHeaderShrink;
  }

  const ac = new AbortController();
  const { signal } = ac;
  let rafId = null;

  const applyShrink = () => {
    rafId = null;
    if (window.scrollY > 12) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  const onScroll = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(applyShrink);
  };

  applyShrink();
  window.addEventListener("scroll", onScroll, { passive: true, signal });

  isHeaderShrinkInitialized = true;

  destroyHeaderShrink = () => {
    ac.abort();
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    header.classList.remove("header--scrolled");
    isHeaderShrinkInitialized = false;
    destroyHeaderShrink = headerShrinkNoop;
  };

  return destroyHeaderShrink;
}
