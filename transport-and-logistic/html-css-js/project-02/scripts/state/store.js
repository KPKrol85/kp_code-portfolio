const defaultPreferences = {
  theme: FleetStorage.get("fleet-theme", "light"),
  compact: FleetStorage.get("fleet-compact", false),
  dashboardRangeDays: FleetStorage.get("fleet-dashboard-range", 30),
};

const defaultAuth = FleetStorage.get("fleet-auth", { isAuthenticated: false, user: null });
const DOMAIN_STORAGE_KEY = "fleet-domain-v1";
const ACTIVITY_STORAGE_KEY = "fleet-activity-v1";
const LIST_PREFS_STORAGE_KEY = "fleet-list-prefs-v1";

const nowIso = () => new Date().toISOString();
const todayIso = () => new Date().toISOString().slice(0, 10);
const cloneList = (items = []) => items.map((item) => ({ ...item }));
const ensureIds = (items = [], prefix) =>
  items.map((item, index) => (item.id ? { ...item } : { ...item, id: `${prefix}-${String(index + 1).padStart(3, "0")}` }));
const isValidDomain = (data) =>
  data &&
  Array.isArray(data.orders) &&
  Array.isArray(data.fleet) &&
  Array.isArray(data.drivers);
const normalizeDomain = (data) => ({
  orders: ensureIds(cloneList(data.orders || []), "FO"),
  fleet: ensureIds(cloneList(data.fleet || []), "VH"),
  drivers: ensureIds(cloneList(data.drivers || []), "DRV"),
});
const buildDomainFromSeed = () => {
  if (!window.FleetSeed) return { orders: [], fleet: [], drivers: [] };
  return normalizeDomain({
    orders: FleetSeed.orders || [],
    fleet: FleetSeed.vehicles || [],
    drivers: FleetSeed.drivers || [],
  });
};
const buildActivityFromSeed = () => {
  if (!window.FleetSeed) return [];
  return cloneList(FleetSeed.activities || []);
};
const generateId = (prefix) => {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
};

const defaultFiltersFallback = {
  orders: { status: "all", priority: "all", search: "" },
  fleet: { status: "all", search: "" },
  drivers: { status: "all", search: "" },
};

const defaultFilters = FleetStorage.get("fleet-filters", defaultFiltersFallback);
const defaultListPrefsFallback = {
  orders: { sortBy: "updated", sortDir: "desc", pageSize: 10, visibleCount: 10 },
  fleet: { sortBy: "id", sortDir: "asc", pageSize: 10, visibleCount: 10 },
  drivers: { sortBy: "name", sortDir: "asc", pageSize: 10, visibleCount: 10 },
};
const defaultListPrefs = FleetStorage.get(LIST_PREFS_STORAGE_KEY, defaultListPrefsFallback);

const Store = {
  state: {
    auth: defaultAuth,
    preferences: defaultPreferences,
    filters: defaultFilters,
    listPrefs: defaultListPrefs,
    domain: { orders: [], fleet: [], drivers: [] },
    activity: [],
  },
  listeners: [],
  domainReady: false,

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
    FleetStorage.set("fleet-dashboard-range", this.state.preferences.dashboardRangeDays);
    FleetStorage.set("fleet-auth", this.state.auth);
    FleetStorage.set("fleet-filters", this.state.filters);
    FleetStorage.set(LIST_PREFS_STORAGE_KEY, this.state.listPrefs);
    FleetStorage.set(ACTIVITY_STORAGE_KEY, this.state.activity);
    if (this.domainReady) {
      FleetStorage.set(DOMAIN_STORAGE_KEY, this.state.domain);
    }
  },

  initDomain() {
    const stored = FleetStorage.get(DOMAIN_STORAGE_KEY, null);
    const domain = isValidDomain(stored) ? normalizeDomain(stored) : buildDomainFromSeed();
    this.domainReady = true;
    this.setState({ domain });
  },

  initActivity() {
    const stored = FleetStorage.get(ACTIVITY_STORAGE_KEY, null);
    const activity = Array.isArray(stored) ? cloneList(stored) : buildActivityFromSeed();
    this.setState({ activity });
  },

  resetDomainData() {
    const domain = buildDomainFromSeed();
    this.domainReady = true;
    this.setState({ domain });
  },

  updateDomainList(key, updater) {
    const current = this.state.domain[key] || [];
    const next = updater(current);
    this.setState({ domain: { ...this.state.domain, [key]: next } });
  },

  addOrder(payload = {}) {
    const now = nowIso();
    const order = {
      ...payload,
      id: payload.id || generateId("FO"),
      createdAt: payload.createdAt || now,
      updatedAt: now,
      updated: payload.updated || now,
    };
    this.updateDomainList("orders", (list) => [...list, order]);
  },

  updateOrder(id, patch = {}) {
    const now = nowIso();
    this.updateDomainList("orders", (list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, ...patch, updatedAt: now, updated: now }
          : item
      )
    );
  },

  deleteOrder(id) {
    this.updateDomainList("orders", (list) => list.filter((item) => item.id !== id));
  },

  addActivity(payload = {}) {
    const activity = {
      title: payload.title || "Nowe zdarzenie",
      detail: payload.detail || "",
      time: payload.time || nowIso(),
    };
    const next = [activity, ...(this.state.activity || [])];
    this.setState({ activity: next });
  },

  addVehicle(payload = {}) {
    const now = nowIso();
    const vehicle = {
      ...payload,
      id: payload.id || generateId("VH"),
      createdAt: payload.createdAt || now,
      updatedAt: now,
      lastCheck: payload.lastCheck || todayIso(),
    };
    this.updateDomainList("fleet", (list) => [...list, vehicle]);
  },

  updateVehicle(id, patch = {}) {
    const now = nowIso();
    this.updateDomainList("fleet", (list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: now } : item))
    );
  },

  deleteVehicle(id) {
    this.updateDomainList("fleet", (list) => list.filter((item) => item.id !== id));
  },

  addDriver(payload = {}) {
    const now = nowIso();
    const driver = {
      ...payload,
      id: payload.id || generateId("DRV"),
      createdAt: payload.createdAt || now,
      updatedAt: now,
    };
    this.updateDomainList("drivers", (list) => [...list, driver]);
  },

  updateDriver(id, patch = {}) {
    const now = nowIso();
    this.updateDomainList("drivers", (list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: now } : item))
    );
  },

  deleteDriver(id) {
    this.updateDomainList("drivers", (list) => list.filter((item) => item.id !== id));
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

  setDashboardRangeDays(days) {
    this.setState({ preferences: { ...this.state.preferences, dashboardRangeDays: days } });
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

  setListPrefs(moduleKey, patch) {
    const current = this.state.listPrefs[moduleKey] || {};
    const nextModule = { ...current, ...patch };
    this.setState({ listPrefs: { ...this.state.listPrefs, [moduleKey]: nextModule } });
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
    FleetStorage.remove("fleet-dashboard-range");
    FleetStorage.remove("fleet-filters");
    FleetStorage.remove(DOMAIN_STORAGE_KEY);
    FleetStorage.remove(ACTIVITY_STORAGE_KEY);
    FleetStorage.remove(LIST_PREFS_STORAGE_KEY);

    this.setState({
      auth: { isAuthenticated: false, user: null },
      preferences: { theme: "light", compact: false, dashboardRangeDays: 30 },
      filters: defaultFiltersFallback,
      listPrefs: defaultListPrefsFallback,
      activity: buildActivityFromSeed(),
    });

    document.documentElement.setAttribute("data-theme", "light");
    delete document.body.dataset.compact;
    if (window.FleetUI && FleetUI.syncThemeImages) FleetUI.syncThemeImages();

    this.resetDomainData();
  },
};

window.FleetStore = Store;
