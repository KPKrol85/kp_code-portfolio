(function init() {
  if (window.FleetStore?.initDomain) {
    FleetStore.initDomain();
  }
  if (window.FleetStore?.initActivity) {
    FleetStore.initActivity();
  }

  const savedTheme = FleetStore.state.preferences.theme;
  if (!savedTheme) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    FleetStore.setTheme(prefersDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  if (FleetStore.state.preferences.compact) {
    document.body.dataset.compact = "true";
  }

  window.addEventListener("hashchange", () => FleetRouter.routeTo(window.location.hash));

  const hasHash = window.location.hash && window.location.hash !== "#";

  if (!hasHash && FleetStore.state.auth.isAuthenticated) {
    const last = FleetStorage.get("fleet-last-route", "/app");
    window.location.hash = `#${last}`;
  } else {
    FleetRouter.routeTo(window.location.hash);
  }
})();
