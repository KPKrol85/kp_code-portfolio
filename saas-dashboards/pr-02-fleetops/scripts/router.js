function renderInfoPage({ title, body }) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="landing">
      <header class="container navbar">
        <a class="logo flex" href="#/" aria-label="FleetOps — Strona główna" data-scroll-top="home">
          <img src="assets/logos/logo-black.svg" alt="FleetOps logo" width="24" height="24" />
          <span>FleetOps</span>
        </a>
        <a class="button ghost" href="#/login">Zaloguj się</a>
      </header>
      <main class="container section" id="main-content">
        <div class="hero-card">
          <p class="tag">Informacja</p>
          <h1>${title}</h1>
          <div class="grid" style="gap:12px; margin-top: var(--space-3);">${body}</div>
        </div>
      </main>
    </div>
  `;

  const cleanup = FleetUI.bindLogoScroll("home");
  CleanupRegistry.add(cleanup);
}

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <main class="container section" id="main-content">
      <div class="hero-card" style="max-width: 520px; margin: 40px auto;">
        <div class="flex-between" style="margin-bottom: 12px;">
          <div class="logo flex" style="--login-logo-size: 32px;">
            <img class="logo__icon" src="${FleetStore.state.preferences.theme === "dark" ? "assets/logos/logo-white.svg" : "assets/logos/logo-black.svg"}" data-theme-src-light="assets/logos/logo-black.svg" data-theme-src-dark="assets/logos/logo-white.svg" alt="FleetOps logo" style="width: var(--login-logo-size); height: var(--login-logo-size);" />
            <strong>FleetOps</strong>
          </div>
          <a class="button ghost" href="#/">Wróć</a>
        </div>
        <h1>Zaloguj się</h1>
        <p class="muted">Uwierzytelnianie demo - dane zapisane w przeglądarce.</p>
        <form id="loginForm" style="display:grid; gap:12px; margin-top: 16px;">
          <label class="form-control">
            <span class="label">E-mail</span>
            <input required type="email" name="email" class="input" placeholder="you@fleetops.app" />
          </label>
          <label class="form-control">
            <span class="label">Hasło</span>
            <input required minlength="4" type="password" name="password" class="input" placeholder="••••••" />
          </label>
          <button class="button primary" type="submit">Zaloguj się</button>
          <button class="button secondary" type="button" id="demoLogin">Kontynuuj jako demo</button>
        </form>
      </div>
    </main>
  `;

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    if (!email || password.length < 4) {
      Toast.show("Podaj email i hasło (min 4 znaki)", "warning", { assertive: true });
      return;
    }
    const name = email.split("@")[0];
    FleetStore.login({ email, name });
    Toast.show("Zalogowano", "success");
    const returnTo = sessionStorage.getItem("auth:returnTo");
    if (returnTo) sessionStorage.removeItem("auth:returnTo");
    window.location.hash = returnTo || "#/app";
  });

  document.getElementById("demoLogin").addEventListener("click", () => {
    FleetStore.login({ email: "demo@fleetops.app", name: "Demo User" });
    const returnTo = sessionStorage.getItem("auth:returnTo");
    if (returnTo) sessionStorage.removeItem("auth:returnTo");
    window.location.hash = returnTo || "#/app";
  });
}

// === Dynamic aria-current (global) ===
function applyAriaCurrent() {
  const currentHash = window.location.hash || "#/";
  const normalizedHash = currentHash === "#" ? "#/" : currentHash;

  const updateGroup = (groupLinks) => {
    let matched = false;
    groupLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isMatch = href === normalizedHash;
      if (isMatch) {
        link.setAttribute("aria-current", "page");
        matched = true;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    return matched;
  };

  const navLinks = document.querySelectorAll(".nav-links a");
  const hasNavMatch = updateGroup(navLinks);

  const homeLogo = document.querySelector('.navbar .logo[data-scroll-top="home"]');
  if (homeLogo) {
    if (!hasNavMatch && normalizedHash === "#/") {
      homeLogo.setAttribute("aria-current", "page");
    } else {
      homeLogo.removeAttribute("aria-current");
    }
  }

  updateGroup(document.querySelectorAll(".sidebar nav a"));
  updateGroup(document.querySelectorAll(".footer-links a"));
}

const routeLabels = {
  "/": "Strona główna",
  "/login": "Logowanie",
  "/about": "O nas",
  "/contact": "Kontakt",
  "/product": "Produkt FleetOps",
  "/features": "Funkcje FleetOps",
  "/pricing": "Cennik FleetOps",
  "/security": "Bezpieczeństwo",
  "/careers": "Kariera",
  "/privacy": "Polityka prywatności",
  "/terms": "Regulamin",
  "/cookies": "Polityka cookies",
  "/app": "Przegląd",
  "/app/orders": "Zlecenia",
  "/app/fleet": "Flota",
  "/app/drivers": "Kierowcy",
  "/app/reports": "Raporty",
  "/app/settings": "Ustawienia",
};

let lastAnnouncedPath = "";
let routeAnnounceTimer = null;

function announceRouteChange(path, label) {
  if (!label || path === lastAnnouncedPath) return;

  const region = document.getElementById("fleetops-route-status");
  if (!region) return;

  lastAnnouncedPath = path;
  if (routeAnnounceTimer) window.clearTimeout(routeAnnounceTimer);
  region.textContent = "";
  routeAnnounceTimer = window.setTimeout(() => {
    region.textContent = `Widok: ${label}`;
  }, 0);
}

function routeTo(hash) {
  const returnToKey = "auth:returnTo";
  const path = hash.replace("#", "") || "/";
  const requiresAuth = path.startsWith("/app");
  let renderedPath = path;
  let renderedLabel = routeLabels[path];

  if (window.CleanupRegistry) CleanupRegistry.runAll();

  if (requiresAuth && !FleetStore.state.auth.isAuthenticated) {
    const targetHash = hash || window.location.hash || "#/app";
    try {
      sessionStorage.setItem(returnToKey, targetHash);
    } catch (e) {
      console.warn("ReturnTo storage error", e);
    }
    window.location.hash = "#/login";
    return;
  }

  if (path.startsWith("/app")) {
    FleetStorage.set("fleet-last-route", path);
  }

  switch (path) {
    case "/":
      renderLanding();
      break;
    case "/login":
      renderLogin();
      break;
    case "/about":
      renderAboutPage();
      break;
    case "/contact":
      renderContactPage();
      break;
    case "/product":
      renderProductPage();
      break;
    case "/features":
      renderFeaturesPage();
      break;
    case "/pricing":
      renderPricingPage();
      break;
    case "/security":
      renderSecurityPage();
      break;
    case "/careers":
      renderCareersPage();
      break;
    case "/privacy":
      renderPrivacyPage();
      break;
    case "/terms":
      renderTermsPage();
      break;
    case "/cookies":
      renderCookiesPage();
      break;
    case "/app":
      renderAppShell("Przegląd", dashboardView());
      break;
    case "/app/orders":
      renderAppShell("Zlecenia", ordersView());
      break;
    case "/app/fleet":
      renderAppShell("Flota", fleetView());
      break;
    case "/app/drivers":
      renderAppShell("Kierowcy", driversView());
      break;
    case "/app/reports":
      renderAppShell("Raporty", reportsView());
      break;
    case "/app/settings":
      renderAppShell("Ustawienia", settingsView());
      break;
    default:
      if (path.startsWith("/app")) {
        renderedLabel = "Nie znaleziono";
        renderAppShell("Nie znaleziono", notFoundView());
      } else {
        window.location.hash = "#/";
        renderedPath = "/";
        renderedLabel = routeLabels["/"];
        renderLanding();
      }
  }

  // <<< TO JEST JEDYNE MIEJSCE, GDZIE USTAWIAMY aria-current >>>
  applyAriaCurrent();
  announceRouteChange(renderedPath, renderedLabel);
}

window.FleetRouter = { routeTo };
