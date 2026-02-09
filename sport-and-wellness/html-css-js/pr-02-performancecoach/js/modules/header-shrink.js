const getShrinkThreshold = () => {
  const viewportWidth = window.innerWidth;

  // Deliberate 48-64px range keeps expanded state visible near top and avoids jitter.
  if (viewportWidth >= 1024) return 64;
  if (viewportWidth >= 768) return 56;
  return 48;
};

export const initHeaderShrink = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  let threshold = getShrinkThreshold();
  let isTicking = false;
  let isShrunk = null;

  const applyHeaderState = () => {
    isTicking = false;
    const shouldShrink = window.scrollY > threshold;
    if (shouldShrink === isShrunk) return;

    header.classList.toggle("is-shrunk", shouldShrink);
    isShrunk = shouldShrink;
  };

  const requestUpdate = () => {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(applyHeaderState);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    threshold = getShrinkThreshold();
    requestUpdate();
  });

  requestUpdate();
};
