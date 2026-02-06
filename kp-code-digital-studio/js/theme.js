(() => {
  const THEME_STORAGE_KEY = 'theme-preference';
  const THEME_VALUES = ['light', 'dark'];

  const getStoredTheme = () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_VALUES.includes(stored) ? stored : null;
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
    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
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

  const initToggle = () => {
    const toggle = document.querySelector('#theme-toggle');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      syncToggle();
    });
  };

  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    syncToggle();
    initToggle();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (getStoredTheme()) {
      return;
    }
    const nextTheme = event.matches ? 'dark' : 'light';
    setTheme(nextTheme, { persist: false });
    syncToggle();
  });

  window.KPTheme = {
    THEME_STORAGE_KEY,
    getPreferredTheme,
    setTheme,
    applyTheme,
    syncToggle,
  };
})();
