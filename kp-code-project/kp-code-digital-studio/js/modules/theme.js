/*
 * Theme preference management and theme toggle behavior.
 */

const THEME_STORAGE_KEY = 'theme-preference';
const THEME_VALUES = ['light', 'dark'];
const THEME_COLORS = {
  light: '#ffffff',
  dark: '#0f1115',
};

const isThemeValue = (theme) => THEME_VALUES.includes(theme);

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeValue(stored) ? stored : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () => {
  if (!window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getPreferredTheme = () => getStoredTheme() || getSystemTheme();

const applyTheme = (theme) => {
  if (!isThemeValue(theme)) {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', THEME_COLORS[theme]);
  });
};

const setTheme = (theme, { persist = true } = {}) => {
  if (!isThemeValue(theme)) {
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
  toggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');

  const nextThemeLabel = currentTheme === 'dark' ? 'jasny' : 'ciemny';
  const label = `Przełącz na motyw ${nextThemeLabel}`;
  toggle.setAttribute('aria-label', label);
  toggle.setAttribute('title', label);
};

export const initTheme = () => {
  const syncTheme = () => {
    applyTheme(getPreferredTheme());
    syncToggle();
  };

  syncTheme();

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      syncToggle();
    });
  }

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (event) => {
      if (getStoredTheme()) {
        return;
      }

      setTheme(event.matches ? 'dark' : 'light', { persist: false });
      syncToggle();
    });
  }

  window.addEventListener('pageshow', syncTheme);
  window.addEventListener('storage', (event) => {
    if (event.key !== THEME_STORAGE_KEY) {
      return;
    }

    syncTheme();
  });

  window.KPTheme = {
    THEME_STORAGE_KEY,
    THEME_VALUES,
    THEME_COLORS,
    getStoredTheme,
    getSystemTheme,
    getPreferredTheme,
    setTheme,
    applyTheme,
    syncToggle,
  };
};
