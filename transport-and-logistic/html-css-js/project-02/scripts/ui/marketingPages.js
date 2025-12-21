function setMarketingTheme() {
  const { preferences } = FleetStore.state;
  const theme = preferences.theme || "light";
  document.documentElement.setAttribute("data-theme", theme);
}

function setPageMeta(title, description) {
  document.title = `${title} | FleetOps`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute("content", description);
}

function initMarketingShell() {
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

  const openNav = () => {
    if (!navToggle || !navDrawer) return;
    document.documentElement.classList.add("is-nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navOpen = true;
    window.requestAnimationFrame(() => {
      const firstItem = navDrawer.querySelector("a, button");
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
    }
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

  document.querySelectorAll(".accordion").forEach((el) => Accordion.init(el));
}

function renderMarketingShell({ title, description, eyebrow, lead, body }) {
  const app = document.getElementById("app");
  if (!app) return;

  setMarketingTheme();
  setPageMeta(title, description);

  app.innerHTML = `
    <div class="landing marketing">
      <header class="container navbar" role="banner">
        <div class="logo flex" aria-label="FleetOps">
          <img src="assets/icons/logo-02.svg" alt="FleetOps logo" width="52" height="52" />
          <span>FleetOps</span>
        </div>
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
                <button class="button ghost" id="themeToggleLanding" type="button" aria-label="Toggle theme">
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
          <a href="#/privacy">Privacy</a>
          <a href="#/terms">Terms</a>
          <a href="#/cookies">Cookies</a>
        </div>
      </footer>
    </div>
  `;

  initMarketingShell();
}

function renderProductPage() {
  renderMarketingShell({
    title: "Produkt FleetOps",
    eyebrow: "Produkt",
    lead: "Jeden system do zarzadzania zleceniami, flota i kierowcami. Klarowny obraz operacji, mniej recznej pracy, szybsze decyzje.",
    description: "FleetOps to platforma do zarzadzania transportem: orders, fleet, drivers, raporty i SLA w jednym panelu.",
    body: `
      <section class="section-tight">
        <div class="marketing-hero">
          <div class="marketing-hero__content">
            <h2>Operacje w czasie rzeczywistym</h2>
            <p>Widoki Orders, Fleet i Drivers synchronizuja statusy, ETA i alerty. Zespol operacyjny ma jedno zrodlo prawdy.</p>
            <div class="hero-cta">
              <a class="button primary" href="#/login">Umow demo</a>
              <a class="button secondary" href="#/app">Zobacz dashboard</a>
            </div>
          </div>
          <div class="marketing-hero__panel">
            <p class="tag">Trust metrics</p>
            <div class="stat-grid">
              <div class="stat-card">
                <p class="muted small">Accuracy ETA</p>
                <h3>96.8%</h3>
              </div>
              <div class="stat-card">
                <p class="muted small">SLA uptime</p>
                <h3>99.6%</h3>
              </div>
              <div class="stat-card">
                <p class="muted small">Alert response</p>
                <h3>12 min</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Jak to dziala</p>
        <h2>Od danych do decyzji w 4 krokach</h2>
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
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
            <p>Live statusy, ETA i timeline serwisow w jednym widoku.</p>
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
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
          <div class="marketing-card">
            <h3>Orders</h3>
            <p>Statusy, priorytety, ETA, alerty opoznien i szybkie wyszukiwanie tras.</p>
          </div>
          <div class="marketing-card">
            <h3>Fleet</h3>
            <p>Przeglady, zdarzenia, koszty i harmonogramy serwisowe floty.</p>
          </div>
          <div class="marketing-card">
            <h3>Drivers</h3>
            <p>Widok dyspozycyjnosci, ostatnie kursy, telefon i przypisania.</p>
          </div>
          <div class="marketing-card">
            <h3>Reports</h3>
            <p>KPI, SLA, wydajnosc i zgodnosc z wymaganiami klienta.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">Integracje</p>
        <h2>Podlacz swoje systemy</h2>
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
          <div class="marketing-card">
            <h3>GPS i telematyka</h3>
            <p>Live pozycje, predkosci i przestoje w jednej osi czasu.</p>
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
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
          <div class="marketing-card">
            <h3>RBAC</h3>
            <p>Role: Dispatcher, Fleet Manager, Operations Lead, Viewer.</p>
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
}

function renderFeaturesPage() {
  renderMarketingShell({
    title: "Funkcje FleetOps",
    eyebrow: "Funkcje",
    lead: "Wszystko, czego potrzebuje zespol operacyjny: dispatch, monitoring, kierowcy, analityka i compliance.",
    description: "Lista funkcji FleetOps: dispatch, monitoring, drivers, analytics i compliance dla zespolow transportowych.",
    body: `
      <section class="section-tight">
        <div class="grid marketing-grid">
          <div class="feature-group">
            <h3>Dispatch</h3>
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
            <h3>Drivers</h3>
            <ul class="list-check">
              <li>Dyspozycyjnosc i ostatnie kursy</li>
              <li>Kontakt do kierowcy z panelu</li>
              <li>Wydajnosc kierowcow i rotacja</li>
              <li>Notatki i zgodnosc z instrukcjami</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Analytics</h3>
            <ul class="list-check">
              <li>Raporty KPI i SLA</li>
              <li>Eksport CSV do klienta</li>
              <li>Wydajnosc floty i wykorzystanie pojazdow</li>
              <li>Trendy opoznien i kosztow</li>
            </ul>
          </div>
          <div class="feature-group">
            <h3>Compliance</h3>
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
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
          <div class="marketing-card">
            <h3>SME logistics</h3>
            <p>Kompletny panel do operacji bez kosztownych wdrozen enterprise.</p>
          </div>
          <div class="marketing-card">
            <h3>Operatorzy logistyczni</h3>
            <p>Wiele flot, wielu kierowcow, jeden standard SLA i raportowania.</p>
          </div>
          <div class="marketing-card">
            <h3>E-commerce i retail</h3>
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
    description: "Cennik FleetOps: Start, Growth i Enterprise z porownaniem funkcji.",
    body: `
      <section class="section-tight">
        <div class="pricing">
          <div class="price-card">
            <div class="badge">Start</div>
            <div class="price">199 PLN</div>
            <p class="muted small">miesiecznie, do 15 pojazdow</p>
            <ul class="list-check">
              <li>Orders + Fleet</li>
              <li>Podstawowe alerty</li>
              <li>Raporty CSV</li>
            </ul>
            <a class="button secondary" href="#/login">Zacznij za darmo</a>
          </div>
          <div class="price-card featured">
            <div class="badge">Growth</div>
            <div class="price">499 PLN</div>
            <p class="muted small">miesiecznie, do 60 pojazdow</p>
            <ul class="list-check">
              <li>Pelny monitoring ETA</li>
              <li>SLA alerts + raporty</li>
              <li>Drivers + Roles</li>
            </ul>
            <a class="button primary" href="#/contact">Umow demo</a>
          </div>
          <div class="price-card">
            <div class="badge">Enterprise</div>
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
        <div class="table-responsive" style="margin-top: var(--space-3);">
          <table class="table">
            <thead>
              <tr>
                <th>Funkcja</th>
                <th>Start</th>
                <th>Growth</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Orders + Fleet</td><td>Tak</td><td>Tak</td><td>Tak</td></tr>
              <tr><td>Monitoring ETA</td><td>Podstawowy</td><td>Zaawansowany</td><td>Zaawansowany</td></tr>
              <tr><td>Drivers + dyspozycyjnosc</td><td>Nie</td><td>Tak</td><td>Tak</td></tr>
              <tr><td>Raporty SLA</td><td>Podstawowe</td><td>Rozszerzone</td><td>Custom</td></tr>
              <tr><td>Integracje ERP / TMS</td><td>Nie</td><td>Opcja</td><td>Tak</td></tr>
              <tr><td>SLA + wsparcie</td><td>Email</td><td>Business</td><td>Dedicated</td></tr>
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
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
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
        <div class="grid marketing-grid" style="margin-top: var(--space-3);">
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
                <span class="label">Email sluzbowy</span>
                <input class="input" name="email" type="email" required placeholder="you@company.com" />
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
            <p class="muted">FleetOps Operations</p>
            <div class="grid" style="gap: 10px; margin-top: var(--space-2);">
              <div>
                <p class="muted small">Email</p>
                <p>hello@fleetops.app</p>
              </div>
              <div>
                <p class="muted small">Telefon</p>
                <p>+48 600 200 100</p>
              </div>
              <div>
                <p class="muted small">Godziny</p>
                <p>Mon-Fri, 9:00-17:00 CET</p>
              </div>
            </div>
            <div class="card-soft" style="margin-top: var(--space-3);">
              <p class="muted small">SLA, integracje i onboarding omawiamy w 30-min call.</p>
              <a class="button secondary" href="#/pricing" style="margin-top: var(--space-2);">Zobacz cennik</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <p class="tag">FAQ</p>
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

window.renderProductPage = renderProductPage;
window.renderFeaturesPage = renderFeaturesPage;
window.renderPricingPage = renderPricingPage;
window.renderAboutPage = renderAboutPage;
window.renderContactPage = renderContactPage;
