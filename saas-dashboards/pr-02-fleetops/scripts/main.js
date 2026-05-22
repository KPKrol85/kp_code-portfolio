(function init() {
  if (window.FleetStore?.initDomain) {
    FleetStore.initDomain();
  }
  if (window.FleetStore?.initActivity) {
    FleetStore.initActivity();
  }

  const savedTheme = FleetStore.state.preferences.theme;
  if (!savedTheme) {
    FleetStore.setTheme("light");
  } else {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  if (FleetStore.state.preferences.compact) {
    document.body.dataset.compact = "true";
  }

  const syncOnlineStatus = () => {
    if (window.FleetStore?.setOnlineStatus) {
      const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
      FleetStore.setOnlineStatus(isOnline);
    }
  };

  const registerServiceWorker = () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("[FleetOps] Service worker registration failed", error);
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  };

  window.addEventListener("online", syncOnlineStatus);
  window.addEventListener("offline", syncOnlineStatus);
  syncOnlineStatus();

  window.addEventListener("hashchange", () => FleetRouter.routeTo(window.location.hash));

  const hasHash = window.location.hash && window.location.hash !== "#";

  if (!hasHash && FleetStore.state.auth.isAuthenticated) {
    const last = FleetStorage.get("fleet-last-route", "/app");
    window.location.hash = `#${last}`;
  } else {
    FleetRouter.routeTo(window.location.hash);
  }

  registerServiceWorker();
})();
