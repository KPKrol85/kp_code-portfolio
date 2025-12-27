const defaultPreferences = {
  theme: FleetStorage.get("fleet-theme", "light"),
  compact: FleetStorage.get("fleet-compact", false),
};

const defaultAuth = FleetStorage.get("fleet-auth", { isAuthenticated: false, user: null });

const defaultFiltersFallback = {
  orders: { status: "all", priority: "all", search: "" },
  fleet: { status: "all", search: "" },
  drivers: { status: "all", search: "" },
};

const defaultFilters = FleetStorage.get("fleet-filters", defaultFiltersFallback);

const Store = {
  state: {
    auth: defaultAuth,
    preferences: defaultPreferences,
    filters: defaultFilters,
  },
  listeners: [],

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.persist();
    this.listeners.forEach((cb) => cb(this.state));
  },

  onChange(cb) {
    this.listeners.push(cb);
  },

  persist() {
    FleetStorage.set("fleet-theme", this.state.preferences.theme);
    FleetStorage.set("fleet-compact", this.state.preferences.compact);
    FleetStorage.set("fleet-auth", this.state.auth);
    FleetStorage.set("fleet-filters", this.state.filters);
  },

  toggleTheme() {
    const next = this.state.preferences.theme === "light" ? "dark" : "light";
    this.setState({ preferences: { ...this.state.preferences, theme: next } });
    document.documentElement.setAttribute("data-theme", next);
    if (window.FleetUI && FleetUI.syncThemeImages) FleetUI.syncThemeImages();
  },

  setTheme(theme) {
    this.setState({ preferences: { ...this.state.preferences, theme } });
    document.documentElement.setAttribute("data-theme", theme);
    if (window.FleetUI && FleetUI.syncThemeImages) FleetUI.syncThemeImages();
  },

  setCompact(compact) {
    this.setState({ preferences: { ...this.state.preferences, compact } });
    if (compact) document.body.dataset.compact = "true";
    else delete document.body.dataset.compact;
  },

  setOrderFilters(partial) {
    const nextOrders = { ...this.state.filters.orders, ...partial };
    this.setState({ filters: { ...this.state.filters, orders: nextOrders } });
  },

  setFleetFilters(partial) {
    const nextFleet = { ...this.state.filters.fleet, ...partial };
    this.setState({ filters: { ...this.state.filters, fleet: nextFleet } });
  },

  setDriverFilters(partial) {
    const nextDrivers = { ...this.state.filters.drivers, ...partial };
    this.setState({ filters: { ...this.state.filters, drivers: nextDrivers } });
  },

  login(user) {
    this.setState({ auth: { isAuthenticated: true, user } });
  },

  logout() {
    this.logoutFlow({ redirectTo: "/login" });
  },

  logoutFlow(options = {}) {
    const { redirectTo = "/login", clearIntended = true, resetFilters = false } = options;

    if (clearIntended) {
      FleetStorage.remove("fleet-intended-route");
      FleetStorage.remove("fleet-last-route");
    }

    this.setState({ auth: { isAuthenticated: false, user: null } });

    if (resetFilters) {
      this.setState({ filters: defaultFiltersFallback });
    }

    window.location.hash = `#${redirectTo}`;
  },

  resetDemo() {
    FleetStorage.remove("fleet-auth");
    FleetStorage.remove("fleet-theme");
    FleetStorage.remove("fleet-compact");
    FleetStorage.remove("fleet-filters");

    this.setState({
      auth: { isAuthenticated: false, user: null },
      preferences: { theme: "light", compact: false },
      filters: defaultFiltersFallback,
    });

    document.documentElement.setAttribute("data-theme", "light");
    delete document.body.dataset.compact;
    if (window.FleetUI && FleetUI.syncThemeImages) FleetUI.syncThemeImages();
  },
};

window.FleetStore = Store;
