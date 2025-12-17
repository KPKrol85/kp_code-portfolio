function renderInfoPage({ title, body }) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="landing">
      <header class="container navbar">
        <div class="logo flex" aria-label="FleetOps">
          <img src="assets/icons/logo.svg" alt="FleetOps" width="24" height="24" />
          <span>FleetOps</span>
        </div>
        <a class="button ghost" href="#/login">Log in</a>
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
}

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <main class="container section" id="main-content">
      <div class="hero-card" style="max-width: 520px; margin: 40px auto;">
        <div class="flex-between" style="margin-bottom: 12px;">
          <div class="logo flex"><img src="assets/icons/logo.svg" alt="FleetOps" width="22" height="22" /><strong>FleetOps</strong></div>
          <a class="button ghost" href="#/">Back</a>
        </div>
        <h2>Zaloguj się</h2>
        <p class="muted">Mock auth — dane zapisane w przeglądarce.</p>
        <form id="loginForm" style="display:grid; gap:12px; margin-top: 16px;">
          <label class="form-control">
            <span class="label">Email</span>
            <input required type="email" name="email" class="input" placeholder="you@fleetops.app" />
          </label>
          <label class="form-control">
            <span class="label">Password</span>
            <input required minlength="4" type="password" name="password" class="input" placeholder="••••••" />
          </label>
          <button class="button primary" type="submit">Sign in</button>
          <button class="button secondary" type="button" id="demoLogin">Continue as demo</button>
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

function routeTo(hash) {
  const path = hash.replace("#", "") || "/";
  const requiresAuth = path.startsWith("/app");
  if (requiresAuth && !FleetStore.state.auth.isAuthenticated) {
    FleetStorage.set("fleet-intended-route", path); // zapamiętaj cel wejścia
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
      renderInfoPage({ title: "About FleetOps", body: "<p>FleetOps to koncepcja centrum operacji transportu. Ten projekt to front-end demo inspirowane Linear.</p>" });
      break;
    case "/contact":
      renderInfoPage({ title: "Contact", body: "<p>Email: contact@fleetops.app<br/>Telefon: +48 600 200 100</p>" });
      break;
    case "/privacy":
      renderInfoPage({ title: "Privacy Policy", body: "<p>Szanujemy prywatność. Dane demo trzymane są lokalnie (localStorage). Brak backendu.</p>" });
      break;
    case "/terms":
      renderInfoPage({ title: "Terms of Service", body: "<p>FleetOps demo dostarczone “as-is” wyłącznie do celów portfolio.</p>" });
      break;
    case "/cookies":
      renderInfoPage({ title: "Cookies", body: "<p>Używamy jedynie localStorage na potrzeby preferencji i mock danych.</p>" });
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
}

window.FleetRouter = { routeTo };
