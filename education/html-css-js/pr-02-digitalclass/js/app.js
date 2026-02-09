import { createStore } from "./core/store.js";
import { loadFromStorage } from "./core/storage.js";
import { migrateState } from "./core/migrate.js";
import { seedState } from "./core/seed.js";
import { selectCurrentUser } from "./core/selectors.js";
import { setCurrentUser, toggleTheme, setSearchQuery } from "./core/actions.js";
import { initDrawer } from "./ui/drawer.js";
import { qs, clearEl, createEl } from "./utils/dom.js";
import { createRouter } from "./router/router.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderClasses } from "./pages/classes.js";
import { renderClassDetail } from "./pages/classDetail.js";
import { renderGroups } from "./pages/groups.js";
import { renderGroupDetail } from "./pages/groupDetail.js";
import { renderChat } from "./pages/chat.js";
import { renderMaterials } from "./pages/materials.js";
import { renderMaterialDetail } from "./pages/materialDetail.js";
import { renderAssignments } from "./pages/assignments.js";
import { renderAssignmentDetail } from "./pages/assignmentDetail.js";
import { renderNotes } from "./pages/notes.js";
import { renderAdmin } from "./pages/admin.js";
import { renderSettings } from "./pages/settings.js";

const stored = migrateState(loadFromStorage());
const initial = stored || seedState();
const store = createStore(initial);
store.setState(initial);

const main = qs("#main");
const nav = qs("#mainNav");
const roleSwitcher = qs("#roleSwitcher");
const themeToggle = qs("#themeToggle");
const searchInput = qs("#globalSearch");

initDrawer();

const navItems = [
  { label: "Dashboard", href: "#/dashboard" },
  { label: "Classes", href: "#/classes" },
  { label: "Groups", href: "#/groups" },
  { label: "Chat", href: "#/chat" },
  { label: "Materials", href: "#/materials" },
  { label: "Assignments", href: "#/assignments" },
  { label: "Notes", href: "#/notes" },
  { label: "Admin", href: "#/admin", role: "admin" },
  { label: "Settings", href: "#/settings" },
];

const renderNav = (state, currentPath) => {
  nav.innerHTML = "";
  navItems
    .filter((item) => !item.role || item.role === selectCurrentUser(state)?.role)
    .forEach((item) => {
      const link = createEl("a", { text: item.label, attrs: { href: item.href } });
      if (currentPath.startsWith(item.href.replace("#", ""))) {
        link.setAttribute("aria-current", "page");
      }
      nav.appendChild(link);
    });
};

const updateTheme = (state) => {
  document.documentElement.dataset.theme = state.ui.theme;
  document.documentElement.dataset.reducedMotion = state.ui.reducedMotion ? "true" : "false";
};

const renderRoleSwitcher = (state) => {
  roleSwitcher.innerHTML = "";
  state.users.forEach((user) => {
    const option = createEl("option", {
      text: `${user.name} (${user.role})`,
      attrs: { value: user.id },
    });
    if (user.id === state.session.currentUserId) option.selected = true;
    roleSwitcher.appendChild(option);
  });
};

roleSwitcher.addEventListener("change", (event) => {
  store.dispatch(setCurrentUser(event.target.value));
});

themeToggle.addEventListener("click", () => store.dispatch(toggleTheme()));

searchInput.addEventListener("input", (event) => {
  store.dispatch(setSearchQuery(event.target.value));
});

const pageMap = {
  dashboard: renderDashboard,
  classes: renderClasses,
  classDetail: renderClassDetail,
  groups: renderGroups,
  groupDetail: renderGroupDetail,
  chat: renderChat,
  materials: renderMaterials,
  materialDetail: renderMaterialDetail,
  assignments: renderAssignments,
  assignmentDetail: renderAssignmentDetail,
  notes: renderNotes,
  admin: renderAdmin,
  settings: renderSettings,
};

let currentRoute = { path: "/dashboard", page: "dashboard", params: {} };

const render = (route) => {
  currentRoute = route;
  const state = store.getState();
  const user = selectCurrentUser(state);
  renderNav(state, route.path);
  updateTheme(state);
  renderRoleSwitcher(state);
  searchInput.value = state.ui.searchQuery;

  clearEl(main);
  const loading = createEl("div", { className: "card", text: "Ładowanie..." });
  main.appendChild(loading);
  setTimeout(() => {
    clearEl(main);
    const pageRenderer = pageMap[route.page] || renderDashboard;
    if (route.page === "admin" && user.role !== "admin") {
      main.appendChild(createEl("p", { text: "Brak dostępu." }));
      return;
    }
    const content = pageRenderer(state, user, route.params, store);
    main.appendChild(content);
    main.focus();
  }, 150);
};

createRouter(render);
store.subscribe(() => render(currentRoute));
renderRoleSwitcher(store.getState());
updateTheme(store.getState());
