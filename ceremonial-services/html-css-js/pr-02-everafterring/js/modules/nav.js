import { qs, qsa, setExpanded, trapFocus } from '../utils.js';
import { SELECTORS } from '../config.js';

export const initNav = () => {
  const navToggle = qs(SELECTORS.navToggle);
  const navPanel = qs(SELECTORS.navPanel);
  const dropdownToggle = qs(SELECTORS.dropdownToggle);
  const dropdownMenu = qs(SELECTORS.dropdownMenu);
  let removeTrap = null;

  if (navToggle?.dataset.initialized === 'true') return;

  if (navPanel && window.innerWidth <= 860) {
    navPanel.hidden = true;
    setExpanded(navToggle, false);
  }

  const activateTrap = () => {
    const isMobileViewport = window.innerWidth <= 860;
    const isNavOpen = navToggle?.getAttribute('aria-expanded') === 'true';

    if (!navPanel || removeTrap || !isMobileViewport || !isNavOpen) return;
    removeTrap = trapFocus(navPanel);
  };

  const deactivateTrap = () => {
    removeTrap?.();
    removeTrap = null;
  };

  const closeNav = ({ returnFocus = false } = {}) => {
    if (!navPanel || !navToggle) return;
    deactivateTrap();
    navPanel.hidden = true;
    setExpanded(navToggle, false);
    if (returnFocus) {
      navToggle.focus();
    }
  };

  const openNav = () => {
    if (!navPanel || !navToggle) return;
    navPanel.hidden = false;
    setExpanded(navToggle, true);
    activateTrap();
    const firstLink = qs('a, button', navPanel);
    firstLink?.focus();
  };

  navToggle?.addEventListener('click', () => {
    if (!navPanel || !navToggle) return;
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeNav({ returnFocus: true });
    } else {
      openNav();
    }
  });

  const handleEscape = (event) => {
    if (event.key !== 'Escape') return;
    if (navToggle?.getAttribute('aria-expanded') === 'true') {
      closeNav({ returnFocus: true });
    }
    if (dropdownToggle?.getAttribute('aria-expanded') === 'true') {
      closeDropdown();
      dropdownToggle.focus();
    }
  };

  document.addEventListener('keydown', handleEscape);

  const closeDropdown = () => {
    if (!dropdownMenu || !dropdownToggle) return;
    dropdownMenu.dataset.open = 'false';
    setExpanded(dropdownToggle, false);
  };

  const openDropdown = () => {
    if (!dropdownMenu || !dropdownToggle) return;
    dropdownMenu.dataset.open = 'true';
    setExpanded(dropdownToggle, true);
    const firstItem = qs('a', dropdownMenu);
    firstItem?.focus();
  };

  dropdownToggle?.addEventListener('click', () => {
    const isOpen = dropdownToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  dropdownToggle?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dropdownToggle.click();
    }
  });

  document.addEventListener('click', (event) => {
    if (!dropdownMenu || !dropdownToggle) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!dropdownMenu.contains(target) && !dropdownToggle.contains(target)) {
      closeDropdown();
    }
  });

  if (dropdownMenu) {
    qsa('a', dropdownMenu).forEach((link) => {
      link.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeDropdown();
          dropdownToggle?.focus();
        }
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      deactivateTrap();
      navPanel?.removeAttribute('hidden');
      setExpanded(navToggle, false);
    } else if (navToggle?.getAttribute('aria-expanded') !== 'true') {
      deactivateTrap();
      navPanel?.setAttribute('hidden', '');
    }
  });

  navToggle && (navToggle.dataset.initialized = 'true');

  return () => {
    deactivateTrap();
    document.removeEventListener('keydown', handleEscape);
  };
};
