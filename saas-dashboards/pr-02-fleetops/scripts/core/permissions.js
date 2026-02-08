const Roles = {
  ADMIN: "admin",
  DISPATCHER: "dispatcher",
  DRIVER: "driver",
};

const Actions = {
  ORDERS_CREATE: "orders:create",
  ORDERS_EDIT: "orders:edit",
  ORDERS_DELETE: "orders:delete",
  FLEET_CREATE: "fleet:create",
  FLEET_EDIT: "fleet:edit",
  FLEET_DELETE: "fleet:delete",
  DRIVERS_CREATE: "drivers:create",
  DRIVERS_EDIT: "drivers:edit",
  DRIVERS_DELETE: "drivers:delete",
};

const roleLabels = {
  [Roles.ADMIN]: "Admin",
  [Roles.DISPATCHER]: "Dispatcher",
  [Roles.DRIVER]: "Driver",
};

const actionLabels = {
  [Actions.ORDERS_CREATE]: "tworzenie zlecen",
  [Actions.ORDERS_EDIT]: "edycja zlecen",
  [Actions.ORDERS_DELETE]: "usuwanie zlecen",
  [Actions.FLEET_CREATE]: "dodawanie pojazdow",
  [Actions.FLEET_EDIT]: "edycja pojazdow",
  [Actions.FLEET_DELETE]: "usuwanie pojazdow",
  [Actions.DRIVERS_CREATE]: "dodawanie kierowcow",
  [Actions.DRIVERS_EDIT]: "edycja kierowcow",
  [Actions.DRIVERS_DELETE]: "usuwanie kierowcow",
};

const DemoUsers = [
  { id: "u_admin_1", role: Roles.ADMIN, displayName: "Admin Demo" },
  { id: "u_disp_1", role: Roles.DISPATCHER, displayName: "Dispatcher Demo" },
  { id: "u_drv_1", role: Roles.DRIVER, displayName: "Driver Demo" },
];

const defaultUser = DemoUsers[0];

const resolveUser = (context = {}) =>
  context.user ||
  (window.FleetStore && FleetStore.state && FleetStore.state.currentUser) ||
  defaultUser;

const isOwner = (record, user) => record && user && record.createdBy && record.createdBy === user.id;

const can = (action, context = {}) => {
  const user = resolveUser(context);
  if (!user || !action) return false;

  if (user.role === Roles.ADMIN) return true;

  if (user.role === Roles.DRIVER) {
    return false;
  }

  if (user.role === Roles.DISPATCHER) {
    if (action.endsWith(":create")) return true;
    if (action.endsWith(":delete")) return false;
    if (action.endsWith(":edit")) return isOwner(context.record, user);
  }

  return false;
};

const explainDeny = (action, context = {}) => {
  const user = resolveUser(context);
  const role = user ? roleLabels[user.role] || user.role : "Uzytkownik";
  const actionLabel = actionLabels[action] || "akcja";

  if (user && user.role === Roles.DRIVER) {
    return `${role} ma tylko podglad - ${actionLabel} zablokowane.`;
  }

  if (user && user.role === Roles.DISPATCHER && action && action.endsWith(":edit")) {
    return `Tylko wlasne rekordy - ${actionLabel} niedozwolone.`;
  }

  return `${role} nie ma uprawnien na ${actionLabel}.`;
};

const applyDisabledState = (el, allowed, message) => {
  if (!el) return;
  el.setAttribute("aria-disabled", allowed ? "false" : "true");
  const isDropdownItem = el.classList.contains("dropdown-item");
  if ("disabled" in el && !isDropdownItem) {
    el.disabled = !allowed;
  }
  if (!allowed) {
    if (message) el.setAttribute("title", message);
    el.classList.add("is-disabled");
  } else {
    el.removeAttribute("title");
    el.classList.remove("is-disabled");
  }
};

const guard = (action, context = {}) => {
  if (can(action, context)) return true;
  const message = explainDeny(action, context);
  if (window.Toast && typeof Toast.show === "function") {
    Toast.show(`Brak uprawnien: ${message}`, "warning");
  }
  if (window.FleetStore && typeof FleetStore.addActivity === "function") {
    FleetStore.addActivity({
      title: "Permission blocked",
      detail: message,
      time: new Date().toISOString(),
    });
  }
  return false;
};

window.FleetPermissions = {
  Roles,
  Actions,
  DemoUsers,
  defaultUser,
  can,
  explainDeny,
  applyDisabledState,
  guard,
};
