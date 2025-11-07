// nav.js – hamburger menu + focus trap + Esc
export function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  let lastFocused = null;

  function isOpen() { return nav.classList.contains('is-open'); }
  function open() {
    lastFocused = document.activeElement;
    nav.classList.add('is-open');
    document.body.classList.add('is-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    const first = focusables()[0];
    if (first) first.focus();
  }
  function close() {
    nav.classList.remove('is-open');
    document.body.classList.remove('is-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  }

  function focusables() {
    return [...nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled'));
  }

  toggle.addEventListener('click', () => {
    isOpen() ? close() : open();
  });

  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof Element && t.matches('a')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

