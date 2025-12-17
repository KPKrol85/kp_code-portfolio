const defaultPreferences = {
  theme: FleetStorage.get("fleet-theme", "light"),
  compact: FleetStorage.get("fleet-compact", false),
};

const defaultAuth = FleetStorage.get("fleet-auth", { isAuthenticated: false, user: null });

const Store = {
  state: {
    auth: defaultAuth,
    preferences: defaultPreferences,
    filters: {
      orders: { status: "all", priority: "all", search: "" },
      fleet: { status: "all", search: "" },
      drivers: { status: "all", search: "" },
    },
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
  },
  toggleTheme() {
    const next = this.state.preferences.theme === "light" ? "dark" : "light";
    this.setState({ preferences: { ...this.state.preferences, theme: next } });
    document.documentElement.setAttribute("data-theme", next);
  },
  setTheme(theme) {
    this.setState({ preferences: { ...this.state.preferences, theme } });
    document.documentElement.setAttribute("data-theme", theme);
  },

  setCompact(compact) {
    this.setState({ preferences: { ...this.state.preferences, compact } });
    if (compact) {
      document.body.dataset.compact = "true";
    } else {
      delete document.body.dataset.compact;
    }
  },

  setOrderFilters(partial) {
    const nextOrders = { ...this.state.filters.orders, ...partial };
    this.setState({
      filters: {
        ...this.state.filters,
        orders: nextOrders,
      },
    });
  },

  login(user) {
    this.setState({ auth: { isAuthenticated: true, user } });
  },
  logout() {
    this.setState({ auth: { isAuthenticated: false, user: null } });
  },
  resetDemo() {
    FleetStorage.remove("fleet-auth");
    FleetStorage.remove("fleet-theme");
    FleetStorage.remove("fleet-compact");

    this.setState({
      auth: { isAuthenticated: false, user: null },
      preferences: { theme: "light", compact: false },
      filters: this.state.filters,
    });

    document.documentElement.setAttribute("data-theme", "light");
    delete document.body.dataset.compact;
  },
};

window.FleetStore = Store;
