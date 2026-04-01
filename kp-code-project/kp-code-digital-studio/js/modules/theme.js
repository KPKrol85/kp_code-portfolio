/*
 * Theme preference management and theme toggle behavior.
 */

const THEME_STORAGE_KEY = 'theme-preference';
const THEME_VALUES = ['light', 'dark'];

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_VALUES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const getPreferredTheme = () => {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
};

const setTheme = (theme, { persist = true } = {}) => {
  if (!THEME_VALUES.includes(theme)) {
    return;
  }

  applyTheme(theme);

  if (!persist) {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures and keep the active theme in-memory only.
  }
};

const syncToggle = () => {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) {
    return;
  }

  const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
  toggle.setAttribute('aria-label', currentTheme);
  toggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
};

export const initTheme = () => {
  applyTheme(getPreferredTheme());
  syncToggle();

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      syncToggle();
    });
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (event) => {
    if (getStoredTheme()) {
      return;
    }

    setTheme(event.matches ? 'dark' : 'light', { persist: false });
    syncToggle();
  });

  window.KPTheme = {
    THEME_STORAGE_KEY,
    getPreferredTheme,
    setTheme,
    applyTheme,
    syncToggle,
  };
};
