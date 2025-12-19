function renderAppShell(viewTitle, contentNode) {
  const app = document.getElementById("app");
  const { auth, preferences } = FleetStore.state;
  const theme = preferences.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);
  const initials = auth.user ? format.avatarInitials(auth.user.name || auth.user.email) : "FO";

  const shell = dom.h("div", "app-shell");

  const sidebar = dom.h("aside", "sidebar");
  sidebar.innerHTML = `
    <div class="logo" aria-label="FleetOps">
      <img src="assets/icons/logo.svg" alt="FleetOps logo" width="24" height="24" />
      <span>FleetOps</span>
    </div>
    <nav aria-label="Aplikacja">
      <a href="#/app" data-route="/app">Overview</a>
      <a href="#/app/orders" data-route="/app/orders">Orders</a>
      <a href="#/app/fleet" data-route="/app/fleet">Fleet</a>
      <a href="#/app/drivers" data-route="/app/drivers">Drivers</a>
      <a href="#/app/reports" data-route="/app/reports">Reports</a>
      <a href="#/app/settings" data-route="/app/settings">Settings</a>
    </nav>
    <div class="muted small">Status: ${auth.user ? auth.user.email : "demo user"}</div>
  `;

  shell.appendChild(sidebar);

  const main = dom.h("div", "app-main");
  const topbar = dom.h("div", "topbar");
  topbar.innerHTML = `
    <div class="topbar-left">
      <h2>${viewTitle}</h2>
      <div class="search"><input aria-label="Search" type="search" placeholder="Search..." /></div>
    </div>
    <div class="topbar-actions">
      <button class="button ghost" id="themeToggle">${theme === "light" ? "☾" : "☼"}</button>
      <button class="button ghost" aria-label="Notifications">🔔</button>
      <div class="dropdown">
        <button class="button ghost avatar" id="userMenuBtn">${initials}</button>
        <div class="dropdown-menu" id="userMenu" role="menu">
          <div class="dropdown-item muted">${auth.user ? auth.user.name : "Demo user"}</div>
          <div class="dropdown-item"><a href="#/about">About</a></div>
          <div class="dropdown-item"><a href="#/privacy">Privacy</a></div>
          <button class="dropdown-item" id="logoutBtn" type="button">Logout</button>
        </div>
      </div>
    </div>
  `;

  topbar.querySelector("#themeToggle").addEventListener("click", () => FleetStore.toggleTheme());
  topbar.querySelector("#userMenuBtn").addEventListener("click", (e) => {
    const menu = topbar.querySelector("#userMenu");
    Dropdown.toggle(e.currentTarget, menu);
  });
  topbar.querySelector("#logoutBtn").addEventListener("click", () => {
    FleetStore.logout();
    Toast.show("Wylogowano", "success");
    window.location.hash = "#/login";
  });

  main.appendChild(topbar);
  const contentWrap = dom.h("div", "app-content");
  contentWrap.appendChild(contentNode);
  main.appendChild(contentWrap);
  shell.appendChild(main);

  dom.mount(app, shell);

  // highlight active nav
  // highlight active nav (class + aria-current)
  const currentPath = window.location.hash.replace("#", "") || "/app";
  const links = sidebar.querySelectorAll("nav a[data-route]");

  links.forEach((a) => {
    const isActive = a.dataset.route === currentPath;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

window.renderAppShell = renderAppShell;
