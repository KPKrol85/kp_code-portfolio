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

function renderLanding() {
  const app = document.getElementById("app");
  if (!app) return;

  const { preferences } = FleetStore.state;
  const theme = preferences.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);

  app.innerHTML = `
    <div class="landing">
      <header class="container navbar" role="banner">
        <a class="logo flex" href="#/" aria-label="FleetOps — Strona główna" data-scroll-top="home">
          <img src="assets/icons/logo-02.svg" alt="FleetOps logo" width="52" height="52" />
          <span>FleetOps</span>
        </a>
        <nav class="nav" aria-label="Nawigacja glowna">
          <button class="button ghost nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Przelacz nawigacje">
            <img class="nav-toggle__icon nav-toggle__icon--light" src="assets/icons/hamburger-light.svg" alt="" aria-hidden="true" />
            <img class="nav-toggle__icon nav-toggle__icon--dark" src="assets/icons/hamburger-dark.svg" alt="" aria-hidden="true" />
          </button>
          <div class="nav-backdrop" data-nav-close></div>
          <div class="nav-drawer" id="mobileNav" role="dialog" aria-modal="true" aria-label="Nawigacja mobilna">
            <ul class="nav-links">
              <li><a href="#/product">Produkt</a></li>
              <li><a href="#/features">Funkcje</a></li>
              <li><a href="#/pricing">Cennik</a></li>
              <li><a href="#/about">O nas</a></li>
              <li><a href="#/contact">Kontakt</a></li>
              <li><a class="button ghost" href="#/login">Zaloguj sie</a></li>
              <li>
                <button class="button ghost" id="themeToggleLanding" type="button" aria-label="Przelacz motyw">
                  <svg class="theme-toggle__icon theme-toggle__icon--light" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                  </svg>
                  <svg class="theme-toggle__icon theme-toggle__icon--dark" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M20 12.5A7.5 7.5 0 1 1 11.5 4a6 6 0 0 0 8.5 8.5Z" fill="currentColor"></path>
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section class="container section hero">
          <div>
            <div class="tag">Centrum operacji floty i transportu</div>
            <h1>FleetOps — zarządzanie transportem bez tarcia.</h1>
            <p>Monitoruj zlecenia, pojazdy i kierowców w jednym widoku. Alerty SLA, realtime ETA i szybkie decyzje wspierane przez przejrzysty interfejs.</p>
            <div class="hero-cta">
              <a class="button primary" href="#/login">Zacznij</a>
              <a class="button secondary" href="#/app">Zobacz demo</a>
              <span class="muted small">Bez instalacji. Dane demo.</span>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-preview" role="img" aria-label="FleetOps — Strona główna">
              <div class="hero-preview__topbar">
                <div class="hero-preview__brand">
                  <span class="hero-preview__dot"></span>
                  Panel FleetOps
                </div>
                <div class="hero-preview__actions">
                  <span class="hero-preview__pill">Operacje na zywo</span>
                  <span class="hero-preview__avatar">KP</span>
                </div>
              </div>
              <div class="hero-preview__body">
                <aside class="hero-preview__sidebar" aria-hidden="true">
                  <span class="hero-preview__nav is-active">Przeglad</span>
                  <span class="hero-preview__nav">Zlecenia</span>
                  <span class="hero-preview__nav">Flota</span>
                  <span class="hero-preview__nav">Kierowcy</span>
                  <span class="hero-preview__nav">Raporty</span>
                </aside>
                <div class="hero-preview__main">
                  <div class="hero-preview__kpis">
                    <div class="hero-preview__card">
                      <p class="muted small">Terminowosc</p>
                      <h4>99.2%</h4>
                      <span class="hero-preview__trend up">+1.2%</span>
                    </div>
                    <div class="hero-preview__card">
                      <p class="muted small">Aktywne trasy</p>
                      <h4>124</h4>
                      <span class="hero-preview__trend">Stabilnie</span>
                    </div>
                    <div class="hero-preview__card">
                      <p class="muted small">Alerty</p>
                      <h4>3</h4>
                      <span class="hero-preview__trend warn">2 SLA</span>
                    </div>
                  </div>
                  <div class="hero-preview__chart">
                    <div class="hero-preview__chart-head">
                      <div>
                        <p class="muted small">Przepustowosc tygodniowa</p>
                        <h4>3.2k dostaw</h4>
                      </div>
                      <span class="hero-preview__chip">Ostatnie 7d</span>
                    </div>
                    <div class="hero-preview__chart-body">
                      <div class="hero-preview__chart-line"></div>
                      <div class="hero-preview__chart-bars"></div>
                    </div>
                  </div>
                  <div class="hero-preview__list">
                    <div class="hero-preview__row">
                      <span>HUB-12 / ETA 14:20</span>
                      <span class="hero-preview__status ok">Na czas</span>
                    </div>
                    <div class="hero-preview__row">
                      <span>KRK-06 / ETA 15:05</span>
                      <span class="hero-preview__status warn">Ryzyko opoznienia</span>
                    </div>
                    <div class="hero-preview__row">
                      <span>WAW-03 / ETA 16:10</span>
                      <span class="hero-preview__status ok">Na czas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="container section">
          <div class="flex-between" style="margin-bottom: var(--space-3);">
            <div>
              <p class="tag">Funkcje</p>
              <h2>Usprawnij dyspozycje, kondycje floty i SLA.</h2>
              <p>Pracuj szybciej dzięki jasnym statusom, filtrom i alertom prosto z panelu.</p>
            </div>
            <a class="button ghost" href="#/login">Otworz panel</a>
          </div>
          <div class="grid feature-grid">
            <div class="feature-card">
              <h3>Rozwojces dyspozycji</h3>
              <p>Przydzielaj kursy, śledź postęp i reaguj na zakłócenia z jednego widoku.</p>
            </div>
            <div class="feature-card">
              <h3>Flota health</h3>
              <p>Przeglądy, serwisy i awarie pod kontrolą dzięki checklistom i timeline.</p>
            </div>
            <div class="feature-card">
              <h3>Alerty SLA</h3>
              <p>Alerty o opóźnieniach i KPI, zanim klient to zauważy.</p>
            </div>
            <div class="feature-card">
              <h3>Raporty</h3>
              <p>Wydajność, wykorzystanie floty i emisje w lekkich raportach eksportowalnych.</p>
            </div>
          </div>
        </section>

        <section class="container section">
          <p class="tag">Jak to dziala</p>
          <h2>3 kroki do kontroli nad transportem</h2>
          <div class="grid how-grid" style="margin-top: var(--space-3);">
            <div class="step">
              <h3>1. Podłącz dane</h3>
              <p>Dodaj zlecenia i flote lub skorzystaj z danych demo.</p>
            </div>
            <div class="step">
              <h3>2. Ustaw reguły</h3>
              <p>Zdefiniuj SLA, alerty i filtry priorytetów.</p>
            </div>
            <div class="step">
              <h3>3. Operuj</h3>
              <p>Monitoruj, reaguj, eksportuj raporty. Wszystko w jednym panelu.</p>
            </div>
          </div>
        </section>

        <section class="container section">
          <p class="tag">Cennik</p>
          <h2>Lekki cennik na start</h2>
          <div class="pricing" style="margin-top: var(--space-3);">
            <div class="price-card">
              <div class="badge">Start</div>
              <div class="price">$39</div>
              <p>10 pojazdów, podstawowe alerty, export CSV.</p>
              <a class="button secondary" href="#/login">Zacznij za darmo</a>
            </div>
            <div class="price-card">
              <div class="badge">Rozwoj</div>
              <div class="price">$79</div>
              <p>50 pojazdów, Alerty SLA, raporty tygodniowe.</p>
              <a class="button primary" href="#/contact">Popros o demo</a>
            </div>
            <div class="price-card">
              <div class="badge">Korporacyjny</div>
              <p>Indywidualnie</p>
              <p>Integracje, SSO, dedykowane wsparcie.</p>
              <a class="button ghost" href="#/contact">Porozmawiaj z nami</a>
            </div>
          </div>
        </section>

        <section class="container section">
          <p class="tag">Opinie</p>
          <h2>Operatorzy o FleetOps</h2>
          <div class="testimonials" style="margin-top: var(--space-3);">
            <div class="testimonial">
              <p>"Planowanie tras skróciło się o 40%. Alerty SLA są bardzo klarowne."</p>
              <p class="muted small">COO, CargoNord</p>
            </div>
            <div class="testimonial">
              <p>"Kierowcy wiedzą, co robić. Wsparcie klienta widzi statusy na zywo."</p>
              <p class="muted small">Lider operacji, FreshLine</p>
            </div>
            <div class="testimonial">
              <p>"UI jak Linear, ale dla transportu. Zespół pokochał."</p>
              <p class="muted small">Flota Manager, AeroParts</p>
            </div>
          </div>
        </section>

        <section class="container section faq">
          <p class="tag">Pytania</p>
          <h2>Najczęstsze pytania</h2>
          <div class="accordion" id="faq">
            <div class="accordion-item">
              <button class="accordion-header">Czy mogę używać trybu dark?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>Tak, FleetOps ma wbudowany przelacznik, który zapamiętuje wybór.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">Czy dane to produkcja?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>To mocki bez backendu. Idealne do demo i portfolio.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">Jak zacząć?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>Wejdź na "Zacznij" lub "Zobacz demo" i odkryj panel.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer class="container footer">
        <div class="logo flex">
          <img src="assets/icons/logo-02.svg" alt="FleetOps" width="22" height="22" />
          <span>FleetOps</span>
        </div>
        <div class="footer-links">
          <a href="#/product">Produkt</a>
          <a href="#/features">Funkcje</a>
          <a href="#/pricing">Cennik</a>
          <a href="#/about">O nas</a>
          <a href="#/contact">Kontakt</a>
          <a href="#/privacy">Polityka prywatnosci</a>
          <a href="#/terms">Regulamin</a>
          <a href="#/cookies">Polityka cookies</a>
        </div>
      </footer>
    </div>
  `;

  const tBtn = document.getElementById("themeToggleLanding");
  if (tBtn) {
    tBtn.addEventListener("click", () => {
      FleetStore.toggleTheme();
      const next = FleetStore.state.preferences.theme || "light";
      document.documentElement.setAttribute("data-theme", next);
    });
  }

  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("mobileNav");
  const navBackdrop = document.querySelector(".nav-backdrop");
  let navOpen = false;

  const getDrawerFocusables = () => {
    if (!navDrawer) return [];
    return Array.from(
      navDrawer.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  const trapDrawerFocus = (event) => {
    if (!navOpen || event.key !== "Tab") return;
    const focusables = getDrawerFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !navDrawer.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openNav = () => {
    if (!navToggle || !navDrawer) return;
    document.documentElement.classList.add("is-nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navOpen = true;
    window.requestAnimationFrame(() => {
      const focusables = getDrawerFocusables();
      const firstItem = focusables[0];
      if (firstItem) firstItem.focus();
    });
  };

  const closeNav = () => {
    if (!navToggle) return;
    document.documentElement.classList.remove("is-nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navOpen = false;
    navToggle.focus();
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (navOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", () => {
      if (navOpen) closeNav();
    });
  }

  if (navDrawer) {
    navDrawer.addEventListener("click", (event) => {
      if (event.target && event.target.closest("a")) {
        closeNav();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navOpen) {
      closeNav();
      return;
    }
    trapDrawerFocus(event);
  });

  const navbar = document.querySelector(".landing .navbar");
  if (navbar) {
    let lastY = 0;
    let ticking = false;
    const addAt = 18;
    const removeAt = 6;

    const onScroll = () => {
      lastY = window.scrollY || 0;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (lastY > addAt) {
          navbar.classList.add("is-scrolled");
        } else if (lastY < removeAt) {
          navbar.classList.remove("is-scrolled");
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const faq = document.getElementById("faq");
  if (faq) Accordion.init(faq);

  bindLogoScroll("home");
}

window.renderLanding = renderLanding;











