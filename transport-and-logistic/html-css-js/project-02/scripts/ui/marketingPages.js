function setMarketingTheme() {
  const { preferences } = FleetStore.state;
  const theme = preferences.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

function setPageMeta(title, description) {
  const normalizedTitle = title.includes("|") ? title : `${title} | FleetOps`;
  document.title = normalizedTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute("content", description);
}

function initMarketingShell() {
  const logoCleanup = FleetUI.bindLogoScroll("home");
  CleanupRegistry.add(logoCleanup);

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
    return Array.from(navDrawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
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

  initResourcesMenu();

  const handleKeydown = (event) => {
    if (event.key === "Escape" && navOpen) {
      closeNav();
      return;
    }
    trapDrawerFocus(event);
  };
  document.addEventListener("keydown", handleKeydown);

  const navbar = document.querySelector(".landing .navbar");
  if (navbar) {
    let lastY = 0;
    let ticking = false;
    const addAt = 18;
    const removeAt = 6;
    const scrollOptions = { passive: true };

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

    window.addEventListener("scroll", onScroll, scrollOptions);
    onScroll();

    CleanupRegistry.add(() => {
      window.removeEventListener("scroll", onScroll, scrollOptions);
    });
  }

  document.querySelectorAll(".accordion").forEach((el) => Accordion.init(el));

  CleanupRegistry.add(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
}

function initResourcesMenu() {
  const toggle = document.getElementById("resourcesToggle");
  const menu = document.getElementById("resourcesMenu");
  if (!toggle || !menu) return;

  let isOpen = false;

  const closeMenu = (returnFocus = false) => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    if (isOpen) {
      closeMenu(true);
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu(true));
  });

  const handleDocClick = (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu(true);
    }
  };
  document.addEventListener("click", handleDocClick);

  const handleDocKeydown = (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu(true);
    }
  };
  document.addEventListener("keydown", handleDocKeydown);

  CleanupRegistry.add(() => {
    document.removeEventListener("click", handleDocClick);
    document.removeEventListener("keydown", handleDocKeydown);
  });
}

function renderMarketingShell({ title, description, eyebrow, lead, body }) {
  const app = document.getElementById("app");
  if (!app) return;

  setMarketingTheme();
  const theme = FleetStore.state.preferences.theme || "light";
  const themeAsset = (light, dark) => (theme === "dark" ? dark : light);
  setPageMeta(title, description);

  app.innerHTML = `
    <div class="landing marketing">
      <header class="container navbar" role="banner">
        <a class="logo flex" href="#/" aria-label="FleetOps — Strona główna" data-scroll-top="home">

          <img class="logo__icon" src="${themeAsset("assets/icons/logo-black.svg", "assets/icons/logo-white.svg")}" data-theme-src-light="assets/icons/logo-black.svg" data-theme-src-dark="assets/icons/logo-white.svg" alt="FleetOps logo" width="52" height="52" />

          <span>FleetOps</span>
        </a>
        <nav class="nav" aria-label="Nawigacja glowna">
          <button class="button ghost nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Przelacz nawigacje">
            <img class="nav-toggle__icon" src="${themeAsset("assets/icons/hamburger-light.svg", "assets/icons/hamburger-dark.svg")}" data-theme-src-light="assets/icons/hamburger-light.svg" data-theme-src-dark="assets/icons/hamburger-dark.svg" alt="" aria-hidden="true" />
          </button>
          <div class="nav-backdrop" data-nav-close></div>
          <div class="nav-drawer" id="mobileNav" role="dialog" aria-modal="true" aria-label="Nawigacja mobilna">
            <ul class="nav-links">
              <li><a href="#/product">Produkt</a></li>
              <li><a href="#/features">Funkcje</a></li>
              <li><a href="#/pricing">Cennik</a></li>
              <li><a href="#/about">O nas</a></li>
              <li><a href="#/contact">Kontakt</a></li>
              <li class="dropdown">
                <button class="nav-link" id="resourcesToggle" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="resourcesMenu">
                  Zasoby
                </button>
                <div class="dropdown-menu" id="resourcesMenu" role="menu" aria-label="Zasoby">
                  <a class="dropdown-item" href="#/privacy">Polityka prywatnosci</a>
                  <a class="dropdown-item" href="#/terms">Regulamin</a>
                  <a class="dropdown-item" href="#/cookies">Polityka cookies</a>
                </div>
              </li>
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

      <main class="container section" id="main-content">
        <div class="page-hero">
          <div>
            <p class="tag">${eyebrow}</p>
            <h1>${title}</h1>
            <p>${lead}</p>
          </div>
        </div>
        ${body}
      </main>

      <footer class="footer" aria-label="FleetOps footer">
        <div class="container footer__inner">
          <div class="footer__grid">
            <div class="footer__brand">
              <a class="footer__logo" href="#/" aria-label="FleetOps home" data-scroll-top="home">
                <img class="logo__icon" src="${themeAsset("assets/icons/logo-black.svg", "assets/icons/logo-white.svg")}" data-theme-src-light="assets/icons/logo-black.svg" data-theme-src-dark="assets/icons/logo-white.svg" alt="FleetOps logo" width="52" height="52" />
              </a>
              <p class="footer__desc">Zarządzaj flotą, dyspozytornią i SLA w jednym, spokojnym środowisku pracy dla zespołów operacyjnych.</p>
              <span class="footer__eyebrow">Stworzone dla zespołów operacyjnych</span>
            </div>

            <div class="footer__col">
              <h3 class="footer__title">Produkt</h3>
              <ul class="footer__list">
                <li><a href="#/app">Panel</a></li>
                <li><a href="#/app/fleet">Flota</a></li>
                <li><a href="#/app/orders">Dyspozytornia</a></li>
                <li><a href="#/app/reports">Analityka</a></li>
                <li><a href="#/app/settings">Ustawienia</a></li>
              </ul>
            </div>

            <div class="footer__col">
              <h3 class="footer__title">Firma</h3>
              <ul class="footer__list">
                <li><a href="#/about">O nas</a></li>
                <li><a href="#/pricing">Cennik</a></li>
                <li><a href="#/security">Bezpieczeństwo</a></li>
                <li><a href="#/contact">Kontakt</a></li>
                <li><a href="#/careers">Kariera</a></li>
              </ul>
            </div>

            <div class="footer__col">
              <h3 class="footer__title">Informacje prawne</h3>
              <ul class="footer__list">
                <li><a href="#/terms">Regulamin</a></li>
                <li><a href="#/privacy">Polityka prywatności</a></li>
                <li><a href="#/cookies">Polityka cookies</a></li>
              </ul>
            </div>

            <div class="footer__col footer__contact">
              <h3 class="footer__title">Kontakt</h3>

               <address class="footer__contact">
                  <ul class="footer__list footer__contact-list">
                    <li>
                      <span class="footer__contact-text">
                      ul. Marynarki Wojennej 12<br>
                       33-100 Tarnów, Polska
                      </span>
                    </li>
                    <li>
                      <a href="tel:+48533537091" aria-label="Zadzwoń">
                      +48 533 537 091
                      </a>
                    </li>
                    <li>
                      <a href="mailto:kontakt@kp-code.pl" aria-label="Napisz emaila">
                      kontakt@kp-code.pl
                      </a>
                    </li>
                  </ul>
              </address>


              <h4 class="footer__title">Social Media</h4>

              <div class="footer__social" aria-label="FleetOps social links">
                <a class="footer__social-link" href="https://www.linkedin.com" aria-label="Profil FleetOps na LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M6 9H3v12h3V9Zm-1.5-6a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 4.5 3ZM21 14.5c0-3.1-1.65-5.1-4.6-5.1-1.4 0-2.4.77-2.8 1.5V9H10v12h3v-6.2c0-1.65.6-2.8 2.1-2.8 1.15 0 1.8.77 1.8 2.8V21h3v-6.5Z" fill="currentColor"></path>
                  </svg>
                </a>
                <a class="footer__social-link" href="https://github.com" aria-label="Profil FleetOps na GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.5v-1.75c-2.78.6-3.36-1.18-3.36-1.18-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.08 1.56 1.06 1.56 1.06.9 1.56 2.36 1.1 2.94.84.1-.67.35-1.1.64-1.36-2.22-.25-4.56-1.12-4.56-4.98 0-1.1.4-2 .98-2.72-.1-.25-.42-1.28.1-2.66 0 0 .8-.26 2.62 1a9.1 9.1 0 0 1 4.78 0c1.82-1.26 2.62-1 2.62-1 .52 1.38.2 2.4.1 2.66.62.72 1 1.62 1 2.72 0 3.88-2.34 4.72-4.58 4.98.36.32.68.94.68 1.9v2.82c0 .28.18.6.7.5A10 10 0 0 0 12 2Z" fill="currentColor"></path>
                  </svg>
                </a>
                <a class="footer__social-link" href="https://x.com" aria-label="Profil FleetOps na X">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M18.3 3H21l-6.6 7.5L22 21h-6.9l-4.5-5.9L4.8 21H2.1l7.1-8.2L2 3h7l4.1 5.4L18.3 3Zm-1.2 16h1.7L8.8 5H7.1l10 14Z" fill="currentColor"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="footer__bottom">
            <span>© 2025 kp_code_ — Wszelkie prawa zastrzeżone</span>
          </div>
        </div>
      </footer>
    </div>
  `;

  initMarketingShell();
}

function renderProductPage() {
  const theme = FleetStore.state.preferences.theme || "light";
  const themeAsset = (light, dark) => (theme === "dark" ? dark : light);

  renderMarketingShell({
    title: "Produkt FleetOps",
    eyebrow: "Produkt",
    lead: "Jeden system do zarzadzania zleceniami, flota i kierowcami. Klarowny obraz operacji, mniej recznej pracy, szybsze decyzje.",
    description: "FleetOps to platforma do zarzadzania transportem: zlecenia, flota, kierowcy, raporty i SLA w jednym panelu.",
    body: `
      <section class="section-tight">
        <div class="marketing-hero">
          <div class="marketing-hero__content">
            <h2>Operacje w czasie rzeczywistym</h2>
            <p>Widoki Zlecen, Floty i Kierowcow synchronizuja statusy, ETA i alerty. Zespol operacyjny ma jedno zrodlo prawdy.</p>
            <div class="hero-cta">
              <a class="button primary" href="#/login">Umow demo</a>
              <a class="button secondary" href="#/app">Zobacz panel</a>
            </div>
          </div>
          <div class="marketing-hero__panel">
            <p class="tag">Wskazniki zaufania</p>
            <div class="stat-grid">
              <div class="stat-card">
                <p class="muted small">Dokladnosc ETA</p>
                <h3>96.8%</h3>
              </div>
              <div class="stat-card">
                <p class="muted small">Dostepnosc SLA</p>
                <h3>99.6%</h3>
              </div>
              <div class="stat-card">
                <p class="muted small">Reakcja na alert</p>
                <h3>12 min</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Jak to dziala</p>
        <h2>Od danych do decyzji w 4 krokach</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>1. Zasil dane</h3>
            <p>Import zlecen, pojazdow i kierowcow lub start na danych demo.</p>
          </div>
          <div class="marketing-card">
            <h3>2. Ustaw SLA</h3>
            <p>Definiuj priorytety, progi opoznien i alerty operacyjne.</p>
          </div>
          <div class="marketing-card">
            <h3>3. Monitoruj</h3>
            <p>Statusy na zywo, ETA i os czasu serwisow w jednym widoku.</p>
          </div>
          <div class="marketing-card">
            <h3>4. Ulepszaj</h3>
            <p>Raporty KPI i eksporty pomagaja zamykac petle operacyjna.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Moduly</p>
        <h2>Najwazniejsze obszary pod kontrola</h2>
        <div class="grid marketing-grid"">
          <div class="marketing-card">
            <h3>Zlecenia</h3>
            <p>Statusy, priorytety, ETA, alerty opoznien i szybkie wyszukiwanie tras.</p>
          </div>
          <div class="marketing-card">
            <h3>Flota</h3>
            <p>Przeglady, zdarzenia, koszty i harmonogramy serwisowe floty.</p>
          </div>
          <div class="marketing-card">
            <h3>Kierowcy</h3>
            <p>Widok dyspozycyjnosci, ostatnie kursy, telefon i przypisania.</p>
          </div>
          <div class="marketing-card">
            <h3>Raporty</h3>
            <p>KPI, SLA, wydajnosc i zgodnosc z wymaganiami klienta.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Integracje</p>
        <h2>Podlacz swoje systemy</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>GPS i telematyka</h3>
            <p>Pozycje na zywo, predkosci i przestoje w jednej osi czasu.</p>
          </div>
          <div class="marketing-card">
            <h3>ERP / TMS</h3>
            <p>Zlecenia i kontrakty trafiaja automatycznie do operacji.</p>
          </div>
          <div class="marketing-card">
            <h3>WMS / e-commerce</h3>
            <p>Statusy dostaw i ETA wracaja do klienta koncowego.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Bezpieczenstwo</p>
        <h2>Role, uprawnienia i audyt</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>RBAC</h3>
            <p>Role: Dyspozytor, Menedzer floty, Lider operacji, Podglad.</p>
          </div>
          <div class="marketing-card">
            <h3>Audyt zmian</h3>
            <p>Historia statusow, notatki i eksport logow do compliance.</p>
          </div>
          <div class="marketing-card">
            <h3>Kontrola dostepu</h3>
            <p>Uprawnienia per modul i widok, idealne dla podwykonawcow.</p>
          </div>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Gotowy na spokojniesza operacje?</h2>
          <p>Umow demo lub uruchom wersje demonstracyjna w przegladarce.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/login">Umow demo</a>
          <a class="button secondary" href="#/app">Wejdz do aplikacji</a>
        </div>
      </section>
    `,
  });

  const hero = document.querySelector(".landing .page-hero");
  if (hero && !hero.querySelector(".page-hero__mark")) {
    const mark = document.createElement("div");
    mark.className = "page-hero__mark";
    mark.setAttribute("aria-hidden", "true");
    mark.setAttribute("role", "presentation");
    mark.innerHTML = `
      <img class="logo__icon" src="${themeAsset("assets/icons/logo-black.svg", "assets/icons/logo-white.svg")}" data-theme-src-light="assets/icons/logo-black.svg" data-theme-src-dark="assets/icons/logo-white.svg" alt="" aria-hidden="true" />
    `;
    hero.appendChild(mark);
  }
}

function renderFeaturesPage() {
  renderMarketingShell({
    title: "Funkcje FleetOps",
    eyebrow: "Funkcje",
    lead: "Wszystko, czego potrzebuje zespol operacyjny: dispatch, monitoring, kierowcy, analityka i compliance.",
    description: "Lista funkcji FleetOps: dyspozycja, monitoring, kierowcy, analityka i zgodnosc dla zespolow transportowych.",
    body: `
      <section class="section-tight">
        <div class="grid marketing-grid">
          <div class="feature-group">
            <h3>Dyspozycja</h3>
            <ul class="list-check">
              <li>Przypisania kursow i priorytetow</li>
              <li>Widok statusow i szybkie filtry</li>
              <li>Alerty opoznien i SLA</li>
              <li>Historia zmian i notatki operacyjne</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Monitoring</h3>
            <ul class="list-check">
              <li>ETA w czasie rzeczywistym</li>
              <li>Podglad trasy i punktow kontrolnych</li>
              <li>Wczesne ostrzezenia o ryzyku opoznienia</li>
              <li>Lista incydentow i eskalacji</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Kierowcy</h3>
            <ul class="list-check">
              <li>Dyspozycyjnosc i ostatnie kursy</li>
              <li>Kontakt do kierowcy z panelu</li>
              <li>Wydajnosc kierowcow i rotacja</li>
              <li>Notatki i zgodnosc z instrukcjami</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Analityka</h3>
            <ul class="list-check">
              <li>Raporty KPI i SLA</li>
              <li>Eksport CSV do klienta</li>
              <li>Wydajnosc floty i wykorzystanie pojazdow</li>
              <li>Trendy opoznien i kosztow</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Zgodnosc</h3>
            <ul class="list-check">
              <li>Audit log zmian statusow</li>
              <li>Role i uprawnienia RBAC</li>
              <li>Polityki SLA i potwierdzenia</li>
              <li>Historia serwisow i przegladow</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Dla kogo</p>
        <h2>Branze, ktore wspiera FleetOps</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Logistyka MSP</h3>
            <p>Kompletny panel do operacji bez kosztownych wdrozen enterprise.</p>
          </div>
          <div class="marketing-card">
            <h3>Operatorzy logistyczni</h3>
            <p>Wiele flot, wielu kierowcow, jeden standard SLA i raportowania.</p>
          </div>
          <div class="marketing-card">
            <h3>Handel internetowy i detaliczny</h3>
            <p>Widocznosc dostaw last mile i SLA dla kluczowych klientow.</p>
          </div>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Chcesz zobaczyc funkcje na zywo?</h2>
          <p>Wersja demo jest dostepna od razu, bez instalacji.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/app">Otworz demo</a>
          <a class="button secondary" href="#/contact">Porozmawiaj z nami</a>
        </div>
      </section>
    `,
  });
}

function renderPricingPage() {
  renderMarketingShell({
    title: "Cennik FleetOps",
    eyebrow: "Cennik",
    lead: "Proste plany dla zespolow operacyjnych. Bez ukrytych oplat, z jasnym SLA i wsparciem.",
    description: "Cennik FleetOps: Start, Rozwoj i Korporacyjny z porownaniem funkcji.",
    body: `
      <section class="section-tight">
        <div class="pricing">
          <div class="price-card">
            <div class="badge">Start</div>
            <div class="price">199 PLN</div>
            <p class="muted small">miesiecznie, do 15 pojazdow</p>
            <ul class="list-check">
              <li>Zlecenia + Flota</li>
              <li>Podstawowe alerty</li>
              <li>Raporty CSV</li>
            </ul>
            <a class="button secondary" href="#/login">Zacznij za darmo</a>
          </div>
          <div class="price-card featured">
            <div class="badge">Rozwoj</div>
            <div class="price">499 PLN</div>
            <p class="muted small">miesiecznie, do 60 pojazdow</p>
            <ul class="list-check">
              <li>Pelny monitoring ETA</li>
              <li>SLA alerts + raporty</li>
              <li>Kierowcy + Role</li>
            </ul>
            <a class="button primary" href="#/contact">Umow demo</a>
          </div>
          <div class="price-card">
            <div class="badge">Korporacyjny</div>
            <div class="price">Indywidualnie</div>
            <p class="muted small">dla flot 60+ pojazdow</p>
            <ul class="list-check">
              <li>Integracje ERP / TMS</li>
              <li>SLA 99.9% + SSO</li>
              <li>Dedykowane wsparcie</li>
            </ul>
            <a class="button ghost" href="#/contact">Porozmawiajmy</a>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Porownanie</p>
        <h2>Funkcje w planach</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Funkcja</th>
                <th>Start</th>
                <th>Rozwoj</th>
                <th>Korporacyjny</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Zlecenia + Flota</td><td>Tak</td><td>Tak</td><td>Tak</td></tr>
              <tr><td>Monitoring ETA</td><td>Podstawowy</td><td>Zaawansowany</td><td>Zaawansowany</td></tr>
              <tr><td>Kierowcy + dyspozycyjnosc</td><td>Nie</td><td>Tak</td><td>Tak</td></tr>
              <tr><td>Raporty SLA</td><td>Podstawowe</td><td>Rozszerzone</td><td>Indywidualnie</td></tr>
              <tr><td>Integracje ERP / TMS</td><td>Nie</td><td>Opcja</td><td>Tak</td></tr>
              <tr><td>SLA + wsparcie</td><td>E-mail</td><td>Biznes</td><td>Dedykowane</td></tr>
            </tbody>
          </table>
        </div>
        <p class="muted small" style="margin-top: var(--space-2);">Faktura VAT, SLA i wsparcie w cenie. Ceny netto.</p>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Potrzebujesz wyceny dla swojej floty?</h2>
          <p>Skontaktuj sie, przygotujemy oferte dopasowana do skali operacji.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/contact">Skontaktuj sie</a>
          <a class="button secondary" href="#/login">Testuj demo</a>
        </div>
      </section>
    `,
  });
}

function renderSecurityPage() {
  renderMarketingShell({
    title: "Bezpieczenstwo",
    eyebrow: "Bezpieczenstwo",
    lead: "Informacje o standardach bezpieczenstwa FleetOps udostepnimy wkrotce.",
    description: "Bezpieczenstwo FleetOps - strona w przygotowaniu.",
    body: `
      <section class="section-tight">
        <div class="marketing-card">
          <p class="tag">Coming soon</p>
          <h2>Bezpieczenstwo w przygotowaniu</h2>
          <p>Ta podstrona jest w trakcie przygotowan. Udostepnimy szczegoly o praktykach i certyfikacjach bezpieczenstwa.</p>
          <p class="muted small">Under construction - wroc wkrotce.</p>
          <div class="hero-cta" style="margin-top: var(--space-2);">
            <a class="button primary" href="#/contact">Skontaktuj sie</a>
            <a class="button secondary" href="#/app">Zobacz demo</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderCareersPage() {
  renderMarketingShell({
    title: "Kariera",
    eyebrow: "Kariera",
    lead: "Otwarte role i informacje o zespolach FleetOps pojawia sie wkrotce.",
    description: "Kariera w FleetOps - strona w przygotowaniu.",
    body: `
      <section class="section-tight">
        <div class="marketing-card">
          <p class="tag">Coming soon</p>
          <h2>Kariera w przygotowaniu</h2>
          <p>Budujemy sekcje z ofertami pracy i opisem zespolu. Jesli chcesz porozmawiac wczesniej, odezwij sie.</p>
          <p class="muted small">Under construction - sprawdz ponownie niebawem.</p>
          <div class="hero-cta" style="margin-top: var(--space-2);">
            <a class="button primary" href="#/contact">Skontaktuj sie</a>
            <a class="button secondary" href="#/app">Zobacz demo</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderAboutPage() {
  renderMarketingShell({
    title: "O nas",
    eyebrow: "O FleetOps",
    lead: "Budujemy produkt dla zespolow, ktore musza dowozic na czas. Transparentnosc, szybkosc reakcji i spokoj operacji.",
    description: "Poznaj zespol FleetOps i nasza misje budowania operacyjnej przejrzystosci w transporcie.",
    body: `
      <section class="section-tight">
        <div class="marketing-hero">
          <div class="marketing-hero__content">
            <h2>Nasza misja</h2>
            <p>Uproscic zarzadzanie transportem tak, by zespoly operacyjne mogly skupic sie na decyzjach, a nie na szukaniu danych.</p>
            <ul class="list-check">
              <li>Jedno zrodlo prawdy dla statusow</li>
              <li>Operacje oparte o SLA i fakty</li>
              <li>Przejrzysta wspolpraca z klientami</li>
            </ul>
          </div>
          <div class="marketing-hero__panel">
            <p class="tag">Historia</p>
            <p class="muted">FleetOps powstal z potrzeb operatorow logistycznych, ktorzy chcieli jednego, uporzadkowanego panelu do pracy dziennej.</p>
            <p class="muted">Laczymy produktowe podejscie z praktyka branzy transportowej.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Dlaczego FleetOps</p>
        <h2>Operacje bez chaosu</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Transparentnosc</h3>
            <p>Jasne statusy, ETA i alerty dla calego zespolu.</p>
          </div>
          <div class="marketing-card">
            <h3>Szybkie decyzje</h3>
            <p>Fakty zamiast telefonow i arkuszy, bez opoznien w reakcjach.</p>
          </div>
          <div class="marketing-card">
            <h3>Skalowalnosc</h3>
            <p>Ten sam proces dla 10 i 500 pojazdow.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Podejscie</p>
        <h2>Praca w iteracjach</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Diagnoza</h3>
            <p>Mapujemy procesy dispatch i SLA, by dobrze ustawic priorytety.</p>
          </div>
          <div class="marketing-card">
            <h3>Wdrozenie</h3>
            <p>Konfigurujemy role, alerty i raporty zgodnie z operacjami.</p>
          </div>
          <div class="marketing-card">
            <h3>Ulepszanie</h3>
            <p>Regularnie pracujemy nad KPI, trendami i automatyzacjami.</p>
          </div>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Chcesz poznac nasz zespol?</h2>
          <p>Porozmawiajmy o twojej flocie i pokazmy, jak pracuje FleetOps.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/contact">Skontaktuj sie</a>
          <a class="button secondary" href="#/pricing">Zobacz cennik</a>
        </div>
      </section>
    `,
  });
}

function renderContactPage() {
  renderMarketingShell({
    title: "Kontakt",
    eyebrow: "Kontakt",
    lead: "Opowiedz nam o swojej flocie. Odpowiadamy szybko i konkretnie.",
    description: "Skontaktuj sie z zespolem FleetOps. Demo, integracje i pytania o cennik.",
    body: `
      <section class="section-tight">
        <div class="contact-grid">
          <div class="form-card">
            <h2>Formularz kontaktowy</h2>
            <p class="muted">Zostaw dane, a odezwiemy sie w ciagu 1 dnia roboczego.</p>
            <form id="contactForm" style="display:grid; gap: 12px; margin-top: var(--space-3);">
              <label class="form-control">
                <span class="label">Imie i nazwisko</span>
                <input class="input" name="name" type="text" required minlength="3" placeholder="Jan Kowalski" />
              </label>
              <label class="form-control">
                <span class="label">E-mail sluzbowy</span>
                <input class="input" name="email" type="email" required placeholder="twoja@firma.pl" />
              </label>
              <label class="form-control">
                <span class="label">Wielkosc floty</span>
                <select class="input" name="fleet" required>
                  <option value="">Wybierz</option>
                  <option value="1-15">1-15 pojazdow</option>
                  <option value="16-60">16-60 pojazdow</option>
                  <option value="60+">60+ pojazdow</option>
                </select>
              </label>
              <label class="form-control">
                <span class="label">Wiadomosc</span>
                <textarea class="input" name="message" rows="4" required minlength="10" placeholder="Opisz wyzwania operacyjne lub cele..."></textarea>
              </label>
              <label class="form-control">
                <span class="label">Zgoda</span>
                <span class="muted small">Wysylajac formularz zgadzasz sie na kontakt w sprawie FleetOps.</span>
              </label>
              <button class="button primary" type="submit">Wyslij zapytanie</button>
            </form>
          </div>
          <div class="marketing-card">
            <h2>Dane kontaktowe</h2>
            <p class="muted">Kontakt do twórcy projektu</p>

              <address class="contact-address">
                <div>
                  <p class="muted small">E-mail</p>
                  <p>
                    <a href="mailto:kontakt@kp-code.pl">kontakt@kp-code.pl</a>
                  </p>
                </div>
                <div>
                  <p class="muted small">Telefon</p>
                  <p>
                    <a href="tel:+48533537091">+48 533 537 091</a>
                  </p>
                </div>
                <div>
                  <p class="muted small">Adres</p>
                  <p>
                    Marynarki Wojennej 12/3<br />
                    33-100 Tarnów<br />
                    Polska
                  </p>
                </div>
              </address>

            <div class="card-soft">
              <p class="muted small">FleetOps to projekt demonstracyjny. Kontakt dotyczy twórcy projektu.</p>
              <p class="muted small">Projekt i interfejs: Kamil Krol (kp_code_).</p>
              <a class="button secondary" href="#/pricing" style="margin-top: var(--space-2);">Zobacz cennik</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Pytania</p>
        <h2>Najczestsze pytania</h2>
        <div class="accordion" id="faq" style="margin-top: var(--space-3);">
          <div class="accordion-item">
            <button class="accordion-header">Jak szybko odpowiadacie?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Najczesciej w ciagu 24h w dni robocze.</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">Czy jest demo?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Tak, wersja demo jest dostepna online bez instalacji.</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">Czy sa integracje?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Integrujemy sie z GPS, telematyka oraz ERP/TMS. Szczegoly uzgadniamy w czasie wdrozenia.</p></div>
          </div>
        </div>
      </section>
    `,
  });

  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      Toast.show("Uzupelnij wymagane pola.", "warning");
      return;
    }
    form.reset();
    Toast.show("Dziekujemy! Wkrotce sie odezwiemy.", "success");
  });
}

function renderPrivacyPage() {
  renderMarketingShell({
    title: "Polityka prywatnosci",
    eyebrow: "Polityka prywatnosci",
    lead: "Szanujemy prywatnosc uzytkownikow wersji demonstracyjnej FleetOps. Ponizej opisujemy zakres danych i sposob ich przetwarzania w modelu demo.",
    description: "Polityka prywatnosci FleetOps (wersja demo). Dane lokalne, brak backendu i jasne zasady przetwarzania informacji.",
    body: `
      <section class="section-tight">
        <p class="tag">Informacja o wersji demo</p>
        <h2>Serwis demonstracyjny bez backendu</h2>
        <div class="grid marketing-grid"">
          <div class="marketing-card">
            <h3>Brak kont produkcyjnych</h3>
            <p>FleetOps to projekt portfolio / demo. Nie tworzymy kont w chmurze ani nie udostepniamy panelu klientom komercyjnym.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane w przegladarce</h3>
            <p>Wszelkie dane sa zapisywane lokalnie w przegladarce uzytkownika (localStorage) i nie sa wysylane na serwer.</p>
          </div>
          <div class="marketing-card">
            <h3>Brak integracji z osobami trzecimi</h3>
            <p>Demo nie przekazuje danych do zewnetrznych systemow ani narzedzi analitycznych poza standardowymi funkcjami przegladarki.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Administrator</p>
          <h2>Kto jest administratorem danych</h2>
            <div class="card-soft">
              <p>
                Administratorem danych w ramach wersji demonstracyjnej FleetOps jest:
              </p>
            <div class="grid">
            <div>
              <strong>Imię i nazwisko:</strong> Kamil Król (KP_Code_)
            </div>
            <div>
              <strong>Adres:</strong>
                <a
                  href="https://www.google.com/maps?q=Marynarki+Wojennej+12/3,+33-100+Tarn%C3%B3w,+Polska"
                  target="_blank"
                  rel="noopener noreferrer">
                    Marynarki Wojennej 12/3, 33-100 Tarnów, Polska
                </a>
              </div>
                 <div>
              <strong>Telefon:</strong>
                <a href="tel:+48533537091">+48 533 537 091</a>
              </div>
            <div>
                  <strong>E-mail:</strong>
                  <a href="mailto:kontakt@kp-code.pl">kontakt@kp-code.pl</a>
                </div>
              </div>
              <p class="muted small">
                Dane kontaktowe dotyczą twórcy projektu demonstracyjnego FleetOps.
              </p>
            </div>
    </section>

      <section class="section-tight">
        <p class="tag">Zakres danych</p>
        <h2>Jakie dane moga wystapic w demo</h2>
        <div class="grid marketing-grid"">
          <div class="marketing-card">
            <h3>Formularz kontaktowy</h3>
            <ul class="list-check">
              <li>Imie i nazwisko</li>
              <li>E-mail sluzbowy</li>
              <li>Wiadomosc i wielkosc floty</li>
            </ul>
            <p class="muted small">Formularz dziala lokalnie i nie wysyla danych na serwer. Dane wpisane w formularzu pozostaja wyłącznie w przegladarce uzytkownika.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane demo w aplikacji</h3>
            <ul class="list-check">
              <li>Mockowe zlecenia, pojazdy i kierowcy</li>
              <li>Ustawienia SLA i statusy operacyjne</li>
              <li>Preferencje uzytkownika (np. motyw)</li>
            </ul>
          </div>
          <div class="marketing-card">
            <h3>LocalStorage</h3>
            <ul class="list-check">
              <li>Preferencje interfejsu</li>
              <li>Dane demo wygenerowane lokalnie</li>
              <li>Ostatnio otwarte widoki</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Cookies i technologie podobne</p>
        <h2>Pliki cookies oraz localStorage</h2>
        <div class="marketing-card">
          <p>W wersji demo nie korzystamy z cookies marketingowych ani narzedzi analitycznych. Serwis moze wykorzystywac localStorage w celu zapisania preferencji (np. motyw) oraz danych demo generowanych lokalnie w przegladarce.</p>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Prawa uzytkownika</p>
        <h2>Kontrola nad danymi w wersji demo</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Dostep i poprawa</h3>
            <p>Masz prawo uzyskac informacje o danych zapisanych lokalnie. W wersji demo wystarczy przejrzec dane w przegladarce.</p>
          </div>
          <div class="marketing-card">
            <h3>Usuniecie danych</h3>
            <p>Mozesz wyczyscic localStorage w ustawieniach przegladarki, aby usunac dane demo i preferencje.</p>
          </div>
          <div class="marketing-card">
            <h3>Kontakt z administratorem</h3>
            <p>Jesli potrzebujesz wsparcia, napisz na kontakt@kp-code.pl. Uwaga: wiadomosc wyslana e-mailem (mailto) trafia do administratora i jest przetwarzana w celu odpowiedzi na zapytanie.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Bezpieczenstwo</p>
        <h2>Jak dbamy o bezpieczenstwo</h2>
        <div class="marketing-card">
          <p>Wersja demo dziala wylacznie po stronie klienta. Nie przechowujemy danych na serwerze, nie profilujemy i nie sprzedajemy informacji. Stosujemy podstawowe praktyki bezpieczenstwa: aktualne zaleznosci, brak publicznego API / endpointow do przesylania danych oraz minimalny zakres danych.</p>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Masz pytania o prywatnosc?</h2>
          <p>Skontaktuj sie z nami, odpowiemy w sprawie wersji demo FleetOps.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/contact">Kontakt</a>
          <a class="button secondary" href="#/app">Przejdz do demo</a>
        </div>
      </section>
    `,
  });
}

function renderTermsPage() {
  renderMarketingShell({
    title: "Regulamin",
    eyebrow: "Regulamin",
    lead: "Regulamin okresla zasady korzystania z demonstracyjnej wersji FleetOps. To projekt demo bez backendu i bez gwarancji produkcyjnej.",
    description: "Regulamin korzystania z wersji demo FleetOps. Zasady uzytkowania, ograniczenia odpowiedzialnosci i prawa autorskie.",
    body: `
      <section class="section-tight">
        <p class="tag">Zakres</p>
        <h2>Charakter uslugi</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Projekt demonstracyjny</h3>
            <p>FleetOps jest projektem demonstracyjnym (demo). Aplikacja sluzy do prezentacji interfejsu i funkcji i nie stanowi komercyjnego produktu produkcyjnego.</p>
          </div>
          <div class="marketing-card">
            <h3>Brak gwarancji SLA</h3>
            <p>Nie gwarantujemy ciaglosci dzialania, dostepnosci, kompletnosci funkcji ani okreslonego poziomu wsparcia. Dostep do demo moze byc zmieniany lub wstrzymany.</p>
          </div>
          <div class="marketing-card">
            <h3>Tryb lokalny</h3>
            <p>Dane demo zapisywane sa lokalnie w przegladarce uzytkownika (np. localStorage), bez synchronizacji z serwerem.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Zasady korzystania</p>
        <h2>Co jest dozwolone</h2>
        <div class="marketing-card">
          <ul class="list-check">
            <li>Korzystanie z demo w celach edukacyjnych i prezentacyjnych.</li>
            <li>Przegladanie interfejsu, funkcji i przykladowych danych.</li>
            <li>Kontakt w celu omowienia wspolpracy lub wdrozenia.</li>
          </ul>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Naduzycia</p>
        <h2>Czego zabrania regulamin</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Proby lamania zabezpieczen</h3>
            <p>Zakazane sa proby obejscia zabezpieczen, ingerencja w dzialanie aplikacji, testy penetracyjne oraz dzialania zmierzajace do uzyskania nieuprawnionego dostepu.</p>
          </div>
          <div class="marketing-card">
            <h3>Automaty i spam</h3>
            <p>Zakazane jest generowanie sztucznego ruchu, wysylanie automatycznych zgloszen oraz naduzywanie formularzy kontaktowych.</p>
          </div>
          <div class="marketing-card">
            <h3>Uzycie komercyjne</h3>
            <p>Zakazane jest wykorzystywanie wersji demo jako gotowego systemu produkcyjnego, w tym do obslugi realnych procesow firmy lub danych osobowych.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Odpowiedzialnosc</p>
        <h2>Ograniczenie odpowiedzialnosci</h2>
        <div class="marketing-card">
          <p>Wersja demo jest udostepniana "tak jak jest" (as is). W najszerszym zakresie dopuszczalnym przez prawo wlasciciel projektu nie ponosi odpowiedzialnosci za szkody wynikajace z korzystania z demo, w tym za utrate danych lokalnych, przerwy w dostepie, bledy interfejsu lub decyzje podjete na podstawie prezentowanych informacji.</p>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Prawa autorskie</p>
        <h2>Wlasnosc intelektualna</h2>
        <div class="marketing-card">
          <p>Interfejs, tresci, layout, grafiki oraz kod zrodlowy FleetOps sa chronione prawem autorskim i naleza do wlasciciela projektu: Kamil Krol (KP_Code_). Zabronione jest kopiowanie, rozpowszechnianie lub udostepnianie bez uprzedniej pisemnej zgody.</p>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Kontakt</p>
        <h2>Dane właściciela</h2>

        <div class="card-soft">
          <address class="contact-address">
            <div><strong>Imię i nazwisko:</strong> Kamil Krol (KP_Code_)</div>

            <div>
              <strong>Adres:</strong>
                <a
                  href="https://www.google.com/maps?q=Marynarki+Wojennej+12/3+33-100+Tarnów"
                  target="_blank"
                  rel="noopener noreferrer">
                  Marynarki Wojennej 12/3, 33-100 Tarnów, Polska
                </a>
            </div>

            <div>
              <strong>Telefon:</strong>
              <a href="tel:+48533537091">+48 533 537 091</a>
            </div>

            <div>
              <strong>E-mail:</strong>
              <a href="mailto:kontakt@kp-code.pl">kontakt@kp-code.pl</a>
            </div>
          </address>

          <p class="muted small">
            Dane kontaktowe dotyczą twórcy projektu demonstracyjnego FleetOps.
          </p>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2>Chcesz poznac FleetOps blizej?</h2>
          <p>Przetestuj demo lub napisz do nas z pytaniami o wdrozenie.</p>
        </div>
        <div class="hero-cta">
          <a class="button primary" href="#/app">Otworz demo</a>
          <a class="button secondary" href="#/contact">Skontaktuj sie</a>
        </div>
      </section>
    `,
  });
}

function renderCookiesPage() {
  renderMarketingShell({
    title: "Polityka cookies",
    eyebrow: "Polityka cookies",
    lead: "Wersja demo FleetOps nie stosuje sledzacych plikow cookies. Wyjasniamy, jakie dane techniczne moga byc zapisane lokalnie.",
    description: "Polityka cookies FleetOps (wersja demo). Informacje o danych technicznych, localStorage i sposobach zarzadzania ustawieniami.",
    body: `
      <section class="section-tight">
        <p class="tag">Podstawy</p>
        <h2>Jakich mechanizmow uzywamy</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Brak tracking cookies</h3>
            <p>FleetOps nie wykorzystuje marketingowych ani analitycznych ciasteczek sledzacych.</p>
          </div>
          <div class="marketing-card">
            <h3>LocalStorage</h3>
            <p>Preferencje interfejsu i dane demo sa przechowywane lokalnie w przegladarce uzytkownika.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane techniczne przegladarki</h3>
            <p>Przegladarka moze zapisywac dane niezbedne do poprawnego dzialania strony (np. cache), zgodnie z jej wlasnymi zasadami.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Kategorie</p>
        <h2>Jakie dane techniczne moga wystapic</h2>
        <div class="marketing-card">
          <ul class="list-check">
            <li>Ustawienia motywu i preferencje interfejsu</li>
            <li>Historia ostatnich widokow w demo</li>
            <li>Mockowe dane operacyjne zapisane lokalnie</li>
          </ul>
          <p class="muted small">Wersja demo nie wykorzystuje zewnetrznych skryptow analitycznych ani reklamowych.</p>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Zarzadzanie</p>
        <h2>Jak kontrolowac dane w przegladarce</h2>
        <div class="grid marketing-grid">
          <div class="marketing-card">
            <h3>Ustawienia przegladarki</h3>
            <p>W ustawieniach przegladarki mozesz wyczyscic dane strony oraz ograniczyc zapisywanie danych lokalnych.</p>
          </div>
          <div class="marketing-card">
            <h3>Czyszczenie localStorage</h3>
            <p>Usuniecie danych lokalnych przywroci demo do stanu poczatkowego (np. motyw, ustawienia, dane demo).</p>
          </div>
          <div class="marketing-card">
            <h3>Brak narzedzi stron trzecich</h3>
            <p>Nie korzystamy z zewnetrznych narzedzi analitycznych ani reklamowych, ktore moglyby ustawic cookies sledzace.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Kontakt</p>
        <h2>Masz pytania o polityke cookies?</h2>
        <div class="card-soft">
          <address class="contact-address">
            <div>
              <strong>Imię i nazwisko:</strong> Kamil Król (KP_Code_)
            </div>
            <div>
              <strong>Adres:</strong>
              <a href="https://www.google.com/maps?q=Marynarki+Wojennej+12/3,+33-100+Tarn%C3%B3w,+Polska"
                target="_blank"
                rel="noopener noreferrer">
                Marynarki Wojennej 12/3, 33-100 Tarnów, Polska
              </a>
            </div>
            <div>
              <strong>Telefon:</strong>
              <a href="tel:+48533537091">+48 533 537 091</a>
            </div>
            <div>
              <strong>E-mail:</strong>
              <a href="mailto:kontakt@kp-code.pl">kontakt@kp-code.pl</a>
            </div>
          </address>
          <p class="muted small">
            Dane kontaktowe dotycza twórcy projektu demonstracyjnego FleetOps.
          </p>
        </div>
      </section>
    `,
  });
}

window.renderProductPage = renderProductPage;
window.renderFeaturesPage = renderFeaturesPage;
window.renderPricingPage = renderPricingPage;
window.renderSecurityPage = renderSecurityPage;
window.renderCareersPage = renderCareersPage;
window.renderAboutPage = renderAboutPage;
window.renderContactPage = renderContactPage;
window.renderPrivacyPage = renderPrivacyPage;
window.renderTermsPage = renderTermsPage;
window.renderCookiesPage = renderCookiesPage;
