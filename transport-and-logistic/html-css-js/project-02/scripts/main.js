(function init() {
  const savedTheme = FleetStore.state.preferences.theme;
  if (!savedTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    FleetStore.setTheme(prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  if (FleetStore.state.preferences.compact) {
    document.body.dataset.compact = 'true';
  }

  window.addEventListener('hashchange', () => FleetRouter.routeTo(window.location.hash));
  FleetRouter.routeTo(window.location.hash);
})();
