const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const initMobileNav = () => {
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.querySelector('[data-drawer]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  if (!toggle || !drawer || !closeBtn) return;

  let lastFocused = null;

  const openDrawer = () => {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    const focusable = drawer.querySelectorAll(focusableSelectors);
    if (focusable.length) {
      focusable[0].focus();
    }
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  const onKeydown = (event) => {
    if (!drawer.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closeDrawer();
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll(focusableSelectors));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (event) => {
    if (event.target.matches('.nav__link')) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', onKeydown);
};
