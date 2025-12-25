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

function initResourcesMenu() {
  const toggle = document.getElementById("resourcesToggle");
  const menu = document.getElementById("resourcesMenu");
  if (!toggle || !menu) return;

  let isOpen = false;

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
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
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const handleDocClick = (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  };

  const handleDocKeydown = (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
      toggle.focus();
    }
  };

  document.addEventListener("click", handleDocClick);

  document.addEventListener("keydown", handleDocKeydown);

  CleanupRegistry.add(() => {
    document.removeEventListener("click", handleDocClick);
    document.removeEventListener("keydown", handleDocKeydown);
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

          <img class="logo__icon logo__icon--light" src="assets/icons/logo-black.svg" alt="FleetOps logo" width="52" height="52" />
          <img class="logo__icon logo__icon--dark"  src="assets/icons/logo-white.svg" alt="" aria-hidden="true" width="52" height="52" />

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
            <div class="hero-image">
              <picture class="img-swap img-swap--dark">
                <source srcset="assets/images/hero/hero-dark.avif" type="image/avif">
                <source srcset="assets/images/hero/hero-dark.webp" type="image/webp">
                <img
                  src="assets/images/hero/hero-dark.jpg"
                  alt="FleetOps Dark Panel"
                  loading="eager"
                  fetchpriority="high"
                  width="1200"
                  height="750"
                  decoding="async">
              </picture>
              <picture class="img-swap img-swap--light">
                <source srcset="assets/images/hero/hero-light.avif" type="image/avif">
                <source srcset="assets/images/hero/hero-light.webp" type="image/webp">
                <img
                  src="assets/images/hero/hero-light.jpg"
                  alt="FleetOps Light Panel"
                  loading="eager"
                  fetchpriority="high"
                  width="1200"
                  height="750"
                  decoding="async">
              </picture>
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
              <div class="price">199 PLN</div>
              <p>miesiecznie, do 15 pojazdow</p>
              <a class="button secondary" href="#/login">Zacznij za darmo</a>
            </div>
            <div class="price-card">
              <div class="badge">Rozwoj</div>
              <div class="price">499 PLN</div>
              <p>miesiecznie, do 60 pojazdow</p>
              <a class="button secondary" href="#/contact">Umow demo</a>
            </div>
            <div class="price-card">
              <div class="badge">Korporacyjny</div>
              <p>Indywidualnie</p>
              <p>dla flot 60+ pojazdow</p>
              <a class="button secondary" href="#/contact">Porozmawiajmy</a>
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
              <p>"Profesjonalne rozwiązania, i jedno zrodlo prawdy. Dziekujemy, zespół pokochał."</p>
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

      <footer class="footer" aria-label="FleetOps footer">
        <div class="container footer__inner">
          <div class="footer__grid">
            <div class="footer__brand">
              <a class="footer__logo" href="#/" aria-label="FleetOps home" data-scroll-top="home">
                <img class="logo__icon logo__icon--light" src="assets/icons/logo-black.svg" alt="FleetOps logo" width="52" height="52" />
                <img class="logo__icon logo__icon--dark"  src="assets/icons/logo-white.svg" alt="" aria-hidden="true" width="52" height="52" />
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

  CleanupRegistry.add(() => {
    document.removeEventListener("keydown", handleKeydown);
  });

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

  const faq = document.getElementById("faq");
  if (faq) Accordion.init(faq);

  const logoCleanup = bindLogoScroll("home");
  CleanupRegistry.add(logoCleanup);
}

window.renderLanding = renderLanding;
