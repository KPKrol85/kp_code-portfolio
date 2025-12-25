function bindLogoScroll(kind, getContainer) {
  const links = document.querySelectorAll(`[data-scroll-top="${kind}"]`);
  if (!links.length) return () => {};

  const cleanups = [];

  links.forEach((link) => {
    const handleClick = (event) => {
      const targetHash = kind === "app" ? "#/app" : "#/";
      const currentHash = window.location.hash || "#/";
      if (currentHash === targetHash) {
        event.preventDefault();
      }

      window.setTimeout(() => {
        const container = getContainer ? getContainer() : null;
        if (container && typeof container.scrollTo === "function") {
          container.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }, 0);
    };
    link.addEventListener("click", handleClick);
    cleanups.push(() => link.removeEventListener("click", handleClick));
  });

  return () => cleanups.forEach((fn) => fn());
}

function renderAppShell(viewTitle, contentNode) {
  const app = document.getElementById("app");
  const { auth, preferences } = FleetStore.state;

  const theme = preferences.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);

  const initials = auth.user ? format.avatarInitials(auth.user.name || auth.user.email) : "FO";

  const shell = dom.h("div", "app-shell");

  const appTopbar = dom.h("div", "app-topbar");
  appTopbar.innerHTML = `
    <a class="app-topbar__brand logo flex" href="#/app" aria-label="FleetOps - Panel" data-scroll-top="app" style="--app-logo-size: 26px;">
      <img class="logo__icon logo__icon--light" src="assets/icons/logo-black.svg" alt="FleetOps logo" style="width: var(--app-logo-size); height: var(--app-logo-size);" />
      <img class="logo__icon logo__icon--dark" src="assets/icons/logo-white.svg" alt="" aria-hidden="true" style="width: var(--app-logo-size); height: var(--app-logo-size);" />
      <span>FleetOps</span>
    </a>
    <div class="app-topbar__actions">
      <button class="button ghost" id="themeToggleMobile" type="button" aria-label="Przełącz motyw">
        <svg class="theme-toggle__icon theme-toggle__icon--light" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>
        <svg class="theme-toggle__icon theme-toggle__icon--dark" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 12.5A7.5 7.5 0 1 1 11.5 4a6 6 0 0 0 8.5 8.5Z" fill="currentColor"></path>
        </svg>
      </button>
      <button class="button ghost" id="drawerToggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="appDrawer">
        <img class="drawer-toggle__icon drawer-toggle__icon--light" src="assets/icons/hamburger-light.svg" alt="Menu" width="22" height="22" />
        <img class="drawer-toggle__icon drawer-toggle__icon--dark" src="assets/icons/hamburger-dark.svg" alt="Menu" width="22" height="22" />
      </button>
    </div>
  `;
  shell.appendChild(appTopbar);

  const drawerBackdrop = dom.h("div", "drawer-backdrop");
  drawerBackdrop.setAttribute("aria-hidden", "true");
  shell.appendChild(drawerBackdrop);

  const sidebar = dom.h("aside", "sidebar drawer");
  sidebar.setAttribute("id", "appDrawer");
  sidebar.setAttribute("aria-hidden", "true");
  sidebar.innerHTML = `
    <a class="logo flex" href="#/app" aria-label="FleetOps - Panel" data-scroll-top="app" style="--app-logo-size: 30px;">
      <img class="logo__icon logo__icon--light" src="assets/icons/logo-black.svg" alt="FleetOps logo" style="width: var(--app-logo-size); height: var(--app-logo-size);" />
      <img class="logo__icon logo__icon--dark" src="assets/icons/logo-white.svg" alt="" aria-hidden="true" style="width: var(--app-logo-size); height: var(--app-logo-size);" />
      <span>FleetOps</span>
    </a>
    <nav aria-label="Aplikacja">
      <a href="#/app" data-route="/app">Przegląd</a>
      <a href="#/app/orders" data-route="/app/orders">Zlecenia</a>
      <a href="#/app/fleet" data-route="/app/fleet">Flota</a>
      <a href="#/app/drivers" data-route="/app/drivers">Kierowcy</a>
      <a href="#/app/reports" data-route="/app/reports">Raporty</a>
      <a href="#/app/settings" data-route="/app/settings">Ustawienia</a>
    </nav>
    <div class="muted small">Użytkownik: ${auth.user ? auth.user.email : "użytkownik demo"}</div>
  `;
  shell.appendChild(sidebar);

  const main = dom.h("div", "app-main");
  const topbar = dom.h("div", "topbar");
  topbar.innerHTML = `
    <div class="topbar-left">
      <h2>${viewTitle}</h2>
      <div class="search"><input aria-label="Szukaj" type="search" placeholder="Szukaj..." /></div>
    </div>
    <div class="topbar-actions">
      <button class="button ghost" id="themeToggle" type="button" aria-label="Przełącz motyw">
        <svg class="theme-toggle__icon theme-toggle__icon--light" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>
        <svg class="theme-toggle__icon theme-toggle__icon--dark" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 12.5A7.5 7.5 0 1 1 11.5 4a6 6 0 0 0 8.5 8.5Z" fill="currentColor"></path>
        </svg>
      </button>
      <button class="button ghost" aria-label="Powiadomienia" type="button">Powiadomienia</button>
      <div class="dropdown">
        <button class="button ghost avatar" id="userMenuBtn" type="button">${initials}</button>
        <div class="dropdown-menu" id="userMenu" role="menu">
          <div class="dropdown-item muted">${auth.user ? auth.user.name : "Użytkownik demo"}</div>
          <div class="dropdown-item"><a href="#/about">O projekcie</a></div>
          <div class="dropdown-item"><a href="#/privacy">Polityka prywatności</a></div>
          <button class="dropdown-item" id="logoutBtn" type="button">Wyloguj się</button>
        </div>
      </div>
    </div>
  `;

  // === Theme toggle (app) ===
  const themeBtn = topbar.querySelector("#themeToggle");
  const themeBtnMobile = appTopbar.querySelector("#themeToggleMobile");

  const syncThemeUI = () => {
    const current = FleetStore.state.preferences.theme || "light";
    document.documentElement.setAttribute("data-theme", current);
  };

  syncThemeUI();

  themeBtn.addEventListener("click", () => {
    FleetStore.toggleTheme();
    syncThemeUI();
  });

  if (themeBtnMobile) {
    themeBtnMobile.addEventListener("click", () => {
      FleetStore.toggleTheme();
      syncThemeUI();
    });
  }

  // === Dropdown / logout ===
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

  const logoCleanup = bindLogoScroll("app", () => shell.querySelector(".app-main"));
  CleanupRegistry.add(logoCleanup);

  // === highlight active nav (class + aria-current) ===
  const currentPath = window.location.hash.replace("#", "") || "/app";
  const links = sidebar.querySelectorAll("nav a[data-route]");

  links.forEach((a) => {
    const isActive = a.dataset.route === currentPath;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  // === Drawer / mobile nav ===
  const drawerToggle = appTopbar.querySelector("#drawerToggle");
  const firstLink = sidebar.querySelector("nav a");
  let isDrawerOpen = false;

  const syncDrawerUI = () => {
    sidebar.setAttribute("aria-hidden", String(!isDrawerOpen));
    drawerBackdrop.classList.toggle("is-visible", isDrawerOpen);
    sidebar.classList.toggle("is-open", isDrawerOpen);
    drawerToggle.setAttribute("aria-expanded", String(isDrawerOpen));
    document.body.classList.toggle("drawer-open", isDrawerOpen);
    if (isDrawerOpen && firstLink) {
      firstLink.focus();
    }
  };


  const closeDrawer = () => {
    isDrawerOpen = false;
    syncDrawerUI();
  };

  drawerToggle.addEventListener("click", () => {
    isDrawerOpen = !isDrawerOpen;
    syncDrawerUI();
  });

  drawerBackdrop.addEventListener("click", closeDrawer);

  sidebar.querySelectorAll("nav a[data-route]").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  const handleKeydown = (event) => {
    if (event.key === "Escape" && isDrawerOpen) {
      closeDrawer();
    }
  };
  document.addEventListener("keydown", handleKeydown);

  CleanupRegistry.add(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
}

window.renderAppShell = renderAppShell;
