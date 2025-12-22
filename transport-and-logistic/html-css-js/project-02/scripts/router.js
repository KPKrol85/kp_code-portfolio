function bindLogoScroll(kind, getContainer) {
  const links = document.querySelectorAll(`[data-scroll-top="${kind}"]`);
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
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
    });
  });
}

function renderInfoPage({ title, body }) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="landing">
      <header class="container navbar">
        <a class="logo flex" href="#/" aria-label="FleetOps — Strona główna" data-scroll-top="home">
          <img src="assets/icons/logo-02.svg" alt="FleetOps logo" width="24" height="24" />
          <span>FleetOps</span>
        </a>
        <a class="button ghost" href="#/login">Zaloguj sie</a>
      </header>
      <main class="container section" id="main-content">
        <div class="hero-card">
          <p class="tag">Info</p>
          <h1>${title}</h1>
          <div class="grid" style="gap:12px; margin-top: var(--space-3);">${body}</div>
        </div>
      </main>
    </div>
  `;

  bindLogoScroll("home");
}

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <main class="container section" id="main-content">
      <div class="hero-card" style="max-width: 520px; margin: 40px auto;">
        <div class="flex-between" style="margin-bottom: 12px;">
          <div class="logo flex"><img src="assets/icons/logo-02.svg" alt="FleetOps" width="22" height="22" /><strong>FleetOps</strong></div>
          <a class="button ghost" href="#/">Wroc</a>
        </div>
        <h1>Zaloguj się</h1>
        <p class="muted">Uwierzytelnianie demo - dane zapisane w przegladarce.</p>
        <form id="loginForm" style="display:grid; gap:12px; margin-top: 16px;">
          <label class="form-control">
            <span class="label">E-mail</span>
            <input required type="email" name="email" class="input" placeholder="you@fleetops.app" />
          </label>
          <label class="form-control">
            <span class="label">Haslo</span>
            <input required minlength="4" type="password" name="password" class="input" placeholder="••••••" />
          </label>
          <button class="button primary" type="submit">Zaloguj sie</button>
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
      Toast.show("Podaj email i hasło (min 4 znaki)");
      return;
    }
    const name = email.split("@")[0];
    FleetStore.login({ email, name });
    Toast.show("Zalogowano", "success");
    const intended = FleetStorage.get("fleet-intended-route", "/app");
    FleetStorage.remove("fleet-intended-route");
    window.location.hash = `#${intended}`;
  });

  document.getElementById("demoLogin").addEventListener("click", () => {
    FleetStore.login({ email: "demo@fleetops.app", name: "Demo User" });
    const intended = FleetStorage.get("fleet-intended-route", "/app");
    FleetStorage.remove("fleet-intended-route");
    window.location.hash = `#${intended}`;
  });
}

// === Dynamic aria-current (global) ===
function applyAriaCurrent() {
  const currentHash = window.location.hash || "#/";
  const links = document.querySelectorAll(".nav-links a, .sidebar nav a, .footer-links a");

  let matched = false;

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!matched && href === currentHash) {
      link.setAttribute("aria-current", "page");
      matched = true;
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function routeTo(hash) {
  const path = hash.replace("#", "") || "/";
  const requiresAuth = path.startsWith("/app");

  if (requiresAuth && !FleetStore.state.auth.isAuthenticated) {
    FleetStorage.set("fleet-intended-route", path);
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
      renderAppShell("Overview", dashboardView());
      break;
    case "/app/orders":
      renderAppShell("Orders", ordersView());
      break;
    case "/app/fleet":
      renderAppShell("Fleet", fleetView());
      break;
    case "/app/drivers":
      renderAppShell("Drivers", driversView());
      break;
    case "/app/reports":
      renderAppShell("Reports", reportsView());
      break;
    case "/app/settings":
      renderAppShell("Settings", settingsView());
      break;
    default:
      window.location.hash = "#/";
      renderLanding();
  }

  // <<< TO JEST JEDYNE MIEJSCE, GDZIE USTAWIAMY aria-current >>>
  applyAriaCurrent();
}

window.FleetRouter = { routeTo };




