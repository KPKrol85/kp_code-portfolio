const isValidHash = (hash) => typeof hash === 'string' && hash.length > 1;

export const initAnchorFocus = () => {
  if (!isValidHash(window.location.hash)) return;

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  requestAnimationFrame(() => {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  });
};
