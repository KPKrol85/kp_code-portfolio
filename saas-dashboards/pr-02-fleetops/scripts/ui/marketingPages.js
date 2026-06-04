function setPageMeta(title, description) {
  const normalizedTitle = title.includes("|") ? title : `${title} | FleetOps`;
  document.title = normalizedTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute("content", description);
}

function renderPageHeroMark(themeAsset) {
  return `
          <div class="page-hero__mark" aria-hidden="true" role="presentation">
            <img class="logo__icon" src="${themeAsset("assets/logos/logo-black.svg", "assets/logos/logo-white.svg")}" data-theme-src-light="assets/logos/logo-black.svg" data-theme-src-dark="assets/logos/logo-white.svg" alt="" aria-hidden="true" />
          </div>`;
}

function renderMarketingShell({ title, description, eyebrow, lead, body }) {
  const app = document.getElementById("app");
  if (!app) return;

  const theme = FleetUI.getLandingTheme();
  const themeAsset = FleetUI.getLandingThemeAsset(theme);
  setPageMeta(title, description);

  app.innerHTML = `
    <div class="landing marketing">
${FleetUI.renderLandingHeader(themeAsset)}

      <main class="container section" id="main-content">
        <div class="page-hero">
          <div class="page-hero__content">
            <p class="tag">${eyebrow}</p>
            <h1 class="page-hero__title">${title}</h1>
            <p class="page-hero__lead">${lead}</p>
          </div>
${renderPageHeroMark(themeAsset)}
        </div>
        ${body}
      </main>

${FleetUI.renderLandingFooter(themeAsset)}
    </div>
  `;

  FleetUI.initLandingShell();
}

function renderProductPage() {
  renderMarketingShell({
    title: "Produkt FleetOps",
    eyebrow: "Produkt",
    lead: "Jeden system do zarządzania zleceniami, flotą i kierowcami. Klarowny obraz operacji, mniej ręcznej pracy, szybsze decyzje.",
    description: "FleetOps to platforma do zarządzania transportem: zlecenia, flota, kierowcy, raporty i SLA w jednym panelu.",
    body: `
      <section class="section-tight">
        <div class="marketing-hero">
          <div class="marketing-hero__content">
            <h2 class="marketing-hero__title">Operacje w czasie rzeczywistym</h2>
            <p class="marketing-hero__text">Widoki zleceń, floty i kierowców synchronizują statusy, ETA i alerty. Zespół operacyjny ma jedno źródło prawdy.</p>
            <div class="marketing-hero__cta">
              <a class="button button--primary" href="#/login">Umów demo</a>
              <a class="button button--secondary" href="#/app">Zobacz panel</a>
            </div>
          </div>
          <div class="marketing-hero__panel">
            <p class="tag">Wskazniki zaufania</p>
            <dl class="marketing-hero__stats">
              <div class="marketing-hero__stat-card">
                <dt class="marketing-hero__stat-label">Dokładność ETA</dt>
                <dd class="marketing-hero__stat-value">96.8%</dd>
              </div>
              <div class="marketing-hero__stat-card">
                <dt class="marketing-hero__stat-label">Dostępność SLA</dt>
                <dd class="marketing-hero__stat-value">99.6%</dd>
              </div>
              <div class="marketing-hero__stat-card">
                <dt class="marketing-hero__stat-label">Reakcja na alert</dt>
                <dd class="marketing-hero__stat-value">12 min</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Jak to dziala</p>
          <h2 class="section-header__title">Od danych do decyzji w 4 krokach</h2>
          <p class="section-header__lead">
            FleetOps prowadzi zespół od uporządkowania danych po bieżącą kontrolę operacji, SLA i raportów w jednym widoku.
          </p>
        </div>
        <div class="grid">
          <div class="card card--step">
          <span class="card__step-number" aria-hidden="true">1</span>
            <h3 class="card__title">Zasil dane</h3>
            <p class="card__text">Import zleceń, pojazdów i kierowców lub start na danych demo.</p>
          </div>
          <div class="card card--step">
          <span class="card__step-number" aria-hidden="true">2</span>
            <h3 class="card__title">Ustaw SLA</h3>
            <p class="card__text">Definiuj priorytety, progi opóźnień i alerty operacyjne.</p>
          </div>
          <div class="card card--step">
          <span class="card__step-number" aria-hidden="true">3</span>
            <h3 class="card__title">Monitoruj</h3>
            <p class="card__text">Statusy na żywo, ETA i oś czasu serwisów w jednym widoku.</p>
          </div>
          <div class="card card--step">
          <span class="card__step-number" aria-hidden="true">4</span>
            <h3 class="card__title">Ulepszaj</h3>
            <p class="card__text">Raporty KPI i eksporty pomagaja zamykac petle operacyjna.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Moduły</p>
          <h2 class="section-header__title">Najważniejsze obszary pod kontrolą</h2>
          <p class="section-header__lead">
            FleetOps łączy kluczowe obszary pracy operacyjnej, żeby zespół widział zlecenia, flotę, kierowców i raporty bez przełączania się między narzędziami.
          </p>
        </div>
        <div class="grid">
          <div class="card marketing-card">
            <h3 class="card__title">Zlecenia</h3>
            <p class="card__text">Statusy, priorytety, ETA, alerty opóźnień i szybkie wyszukiwanie tras.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Flota</h3>
            <p class="card__text">Przeglądy, zdarzenia, koszty i harmonogramy serwisowe floty.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Kierowcy</h3>
            <p class="card__text">Widok dyspozycyjności, ostatnie kursy, telefon i przypisania.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Raporty</h3>
            <p class="card__text">KPI, SLA, wydajność i zgodność z wymaganiami klienta.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Integracje</p>
          <h2 class="section-header__title">Podłącz swoje systemy</h2>
          <p class="section-header__lead">
            FleetOps może zbierać dane z systemów używanych w operacjach transportowych, żeby statusy, trasy i raporty trafiały do jednego panelu.
          </p>
        </div>
        <div class="grid">
          <div class="card marketing-card">
            <h3 class="card__title">GPS i telematyka</h3>
            <p class="card__text">Pozycje pojazdów, prędkości, postoje i zdarzenia drogowe w jednej osi czasu.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">ERP / TMS</h3>
            <p class="card__text">Zlecenia, kontrakty i dane operacyjne trafiają do panelu bez ręcznego przepisywania.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">WMS / e-commerce</h3>
            <p class="card__text">Statusy dostaw, ETA i informacje o realizacji wracają do klienta końcowego.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Bezpieczeństwo</p>
          <h2 class="section-header__title">Role, uprawnienia i audyt</h2>
          <p class="section-header__lead">
            FleetOps porządkuje dostęp do danych operacyjnych, żeby każdy członek zespołu widział tylko właściwe moduły, działania i historię zmian.
          </p>
        </div>
        <div class="grid">
          <div class="card marketing-card">
            <h3 class="card__title">RBAC</h3>
            <p class="card__text">Role dla dyspozytora, menedżera floty, lidera operacji i podglądu.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Audyt zmian</h3>
            <p class="card__text">Historia statusów, notatek i eksportów dostępna do kontroli oraz compliance.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Kontrola dostępu</h3>
            <p class="card__text">Uprawnienia per moduł i widok, przydatne przy pracy z podwykonawcami.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="cta-panel">
          <div class="cta-panel__header">
            <h2 class="cta-panel__title">Gotowy uporządkować pracę floty?</h2>
            <p class="cta-panel__lead">Sprawdź FleetOps w wersji demonstracyjnej lub umów rozmowę o wdrożeniu dla zespołu operacyjnego.</p>
          </div>
          <div class="cta-panel__actions">
            <a class="button button--primary" href="#/contact">Umów rozmowę</a>
            <a class="button button--secondary" href="#/app">Zobacz demo aplikacji</a>
          </div>
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
    description: "Lista funkcji FleetOps: dyspozycja, monitoring, kierowcy, analityka i zgodnosc dla zespolow transportowych.",
    body: `
      <section class="section-tight">
        <h2 class="sr-only">Funkcje operacyjne</h2>
        <div class="grid grid--features">
          <div class="card card--feature">
            <h3 class="card__title">Dyspozycja</h3>
            <ul class="card__list">
              <li>Przypisania kursow i priorytetow</li>
              <li>Widok statusow i szybkie filtry</li>
              <li>Alerty opóźnień i SLA</li>
              <li>Historia zmian i notatki operacyjne</li>
            </ul>
          </div>
          <div class="card card--feature">
            <h3 class="card__title">Monitoring</h3>
            <ul class="card__list">
              <li>ETA w czasie rzeczywistym</li>
              <li>Podglad trasy i punktow kontrolnych</li>
              <li>Wczesne ostrzeżenia o ryzyku opóźnienia</li>
              <li>Lista incydentow i eskalacji</li>
            </ul>
          </div>
          <div class="card card--feature">
            <h3 class="card__title">Kierowcy</h3>
            <ul class="card__list">
              <li>Dyspozycyjnosc i ostatnie kursy</li>
              <li>Kontakt do kierowcy z panelu</li>
              <li>Wydajność kierowców i rotacja</li>
              <li>Notatki i zgodnosc z instrukcjami</li>
            </ul>
          </div>
          <div class="card card--feature">
            <h3 class="card__title">Analityka</h3>
            <ul class="card__list">
              <li>Raporty KPI i SLA</li>
              <li>Eksport CSV do klienta</li>
              <li>Wydajność floty i wykorzystanie pojazdów</li>
              <li>Trendy opóźnień i kosztów</li>
            </ul>
          </div>
          <div class="card card--feature">
            <h3 class="card__title">Zgodnosc</h3>
            <ul class="card__list">
              <li>Audit log zmian statusow</li>
              <li>Role i uprawnienia RBAC</li>
              <li>Polityki SLA i potwierdzenia</li>
              <li>Historia serwisów i przeglądów</li>
            </ul>
          </div>
          <div class="card card--feature">
            <h3 class="card__title">Automatyzacja</h3>
            <ul class="card__list">
              <li>Reguły alertów dla opóźnień i SLA</li>
              <li>Automatyczne przypomnienia dla zespołu</li>
              <li>Szablony procesów operacyjnych</li>
              <li>Powiadomienia o zmianach statusów</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Dla kogo</p>
          <h2 class="section-header__title">Branze, ktore wspiera FleetOps</h2>
          <p class="section-header__lead">FleetOps sprawdza się tam, gdzie liczy się widoczność dostaw, szybka reakcja zespołu i kontrola jakości operacji.</p>
        </div>
        <div class="grid grid--industries">
          <div class="card marketing-card">
            <h3 class="card__title">Logistyka MSP</h3>
            <p class="card__text">Panel operacyjny dla firm, które chcą uporządkować zlecenia, statusy i komunikację bez ciężkich wdrożeń enterprise.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Operatorzy logistyczni</h3>
            <p class="card__text">Jeden standard pracy dla wielu flot, kierowców, klientów i zespołów odpowiedzialnych za realizację dostaw.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Handel internetowy i detaliczny</h3>
            <p class="card__text">Lepsza widoczność dostaw last mile, SLA i opóźnień w procesach ważnych dla obsługi klienta.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="cta-panel">
          <div class="cta-panel__header">
            <h2 class="cta-panel__title">Chcesz sprawdzić funkcje w praktyce?</h2>
            <p class="cta-panel__lead">Otwórz demo FleetOps i zobacz, jak panel wspiera dyspozycję, monitoring, raporty i automatyzację pracy zespołu.</p>
          </div>
          <div class="cta-panel__actions">
            <a class="button button--primary" href="#/contact">Umów rozmowę</a>
            <a class="button button--secondary" href="#/app">Zobacz demo aplikacji</a>
          </div>
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
        <div class="grid grid--pricing">
            <div class="card card--pricing">
              <div class="badge">Start</div>
              <h3 class="card__title">Podstawowa kontrola operacji</h3>
              <div class="card__price">199 PLN</div>
              <p class="card__text">dla małych flot do 15 pojazdów</p>
              <ul class="card__list">
                <li>kontrola zleceń i statusów</li>
                <li>podgląd pojazdów w jednym panelu</li>
                <li>dobry start dla małego zespołu</li>
              </ul>
              <a class="button button--secondary" href="#/login">Przetestuj panel</a>
            </div>
            <div class="card card--pricing">
              <div class="badge">Rozwój</div>
              <h3 class="card__title">Rozszerzona kontrola operacji</h3>
              <div class="card__price">499 PLN</div>
              <p class="card__text">dla zespołów obsługujących do 60 pojazdów</p>
              <ul class="card__list">
                <li>szersza obsługa zleceń i floty</li>
                <li>raporty operacyjne dla zespołu</li>
                <li>więcej kontroli nad codzienną pracą</li>
              </ul>
              <a class="button button--secondary" href="#/contact">Umów demo</a>
            </div>
            <div class="card card--pricing">
              <div class="badge">Korporacyjny</div>
              <h3 class="card__title">Kontrola operacji w większej skali</h3>
              <div class="card__price">Indywidualnie</div>
              <p class="card__text">dla flot powyżej 60 pojazdów</p>
              <ul class="card__list">
                <li>zakres dopasowany do większej skali</li>
                <li>wsparcie dla procesów i zespołów</li>
                <li>elastyczne podejście do wdrożenia</li>
              </ul>
              <a class="button button--secondary" href="#/contact">Porozmawiajmy</a>
            </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Porownanie</p>
          <h2 class="section-header__title">Porównanie planów FleetOps</h2>
          <p class="section-header__lead">Zobacz, które funkcje są dostępne w każdym planie i wybierz zakres dopasowany do skali pracy zespołu.</p>
        </div>
        <div class="table-responsive pricing-table">
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
        <p class="pricing-note">Faktura VAT, SLA i wsparcie w cenie. Ceny netto.</p>
      </section>

      <section class="section-tight">
        <div class="cta-panel">
          <div class="cta-panel__header">
            <h2 class="cta-panel__title">Potrzebujesz wyceny dla swojej floty?</h2>
            <p class="cta-panel__lead">Skontaktuj się, przygotujemy ofertę dopasowaną do skali operacji.</p>
          </div>
          <div class="cta-panel__actions">
            <a class="button button--primary" href="#/contact">Skontaktuj się</a>
            <a class="button button--secondary" href="#/app">Zobacz demo aplikacji</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderSecurityPage() {
  renderMarketingShell({
    title: "Bezpieczeństwo",
    eyebrow: "Bezpieczeństwo",
    lead: "Informacje o standardach bezpieczeństwa FleetOps udostępnimy wkrótce.",
    description: "Bezpieczeństwo FleetOps - strona w przygotowaniu.",
    body: `
      <section class="section-tight">
        <div class="marketing-card">
          <p class="tag">W przygotowaniu</p>
          <h2>Bezpieczeństwo w przygotowaniu</h2>
          <p>Ta podstrona jest w trakcie przygotowań. Udostępnimy szczegóły o praktykach i certyfikacjach bezpieczeństwa.</p>
          <p class="muted small">W przygotowaniu - wróć wkrótce.</p>
          <div class="hero-cta">
            <a class="button button--primary" href="#/contact">Skontaktuj się</a>
            <a class="button button--secondary" href="#/app">Zobacz demo</a>
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
    lead: "Otwarte role i informacje o zespołach FleetOps pojawią się wkrótce.",
    description: "Kariera w FleetOps - strona w przygotowaniu.",
    body: `
      <section class="section-tight">
        <div class="marketing-card">
          <p class="tag">W przygotowaniu</p>
          <h2>Kariera w przygotowaniu</h2>
          <p>Budujemy sekcję z ofertami pracy i opisem zespołu. Jeśli chcesz porozmawiać wcześniej, odezwij się.</p>
          <p class="muted small">W przygotowaniu - sprawdź ponownie niebawem.</p>
          <div class="hero-cta">
            <a class="button button--primary" href="#/contact">Skontaktuj się</a>
            <a class="button button--secondary" href="#/app">Zobacz demo</a>
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
    lead: "Budujemy FleetOps dla zespołów transportowych, które potrzebują przejrzystości, szybkiej reakcji i większego spokoju w codziennej operacji.",
    description: "Poznaj zespół FleetOps i naszą misję budowania operacyjnej przejrzystości w transporcie.",
    body: `
      <section class="section-tight">
        <div class="marketing-hero">
          <div class="marketing-hero__content">
            <h2 class="marketing-hero__title">Nasza misja</h2>
            <p class="marketing-hero__text">Upraszczamy zarządzanie transportem, żeby zespoły operacyjne szybciej widziały statusy, ryzyka i dane potrzebne do decyzji.</p>
            <ul class="marketing-hero__list">
              <li>Jedno źródło prawdy dla statusów</li>
              <li>Operacje oparte o SLA i fakty</li>
              <li>Przejrzysta współpraca z klientami</li>
            </ul>
          </div>
          <div class="marketing-hero__panel">
            <p class="tag">Historia</p>
            <div class="marketing-hero__panel-copy">
              <p class="marketing-hero__panel-text marketing-hero__panel-text--strong">FleetOps powstał z potrzeby uporządkowania codziennej pracy operatorów logistycznych w jednym panelu.</p>
              <p class="marketing-hero__panel-text">Łączymy produktowe podejście z praktyką branży transportowej, żeby wspierać realne procesy operacyjne.</p>
              <p class="marketing-hero__panel-text">Projektujemy FleetOps tak, żeby codzienne decyzje były szybsze, dane bardziej dostępne, a odpowiedzialność w zespole jasno widoczna.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Dlaczego FleetOps</p>
          <h2 class="section-header__title">Operacje bez chaosu</h2>
          <p class="section-header__lead">FleetOps porządkuje statusy, dane i odpowiedzialność, żeby zespół mógł szybciej reagować na zmiany w codziennej pracy.</p>
        </div>
        <div class="grid">
          <div class="card marketing-card">
            <h3 class="card__title">Transparentność</h3>
            <p class="card__text">Jasne statusy, ETA i alerty dla całego zespołu.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Szybkie decyzje</h3>
            <p class="card__text">Fakty zamiast telefonów i arkuszy, bez opóźnień w reakcjach.</p>
          </div>
          <div class="card marketing-card">
            <h3 class="card__title">Skalowalność</h3>
            <p class="card__text">Ten sam proces dla 10 i 500 pojazdów.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Podejście</p>
          <h2 class="section-header__title">Praca w iteracjach</h2>
        </div>
        <div class="grid">
          <div class="card card--step">
            <span class="card__step-number" aria-hidden="true">1</span>
            <h3>Diagnoza</h3>
            <p>Mapujemy procesy dispatch i SLA, by dobrze ustawić priorytety.</p>
          </div>
          <div class="card card--step">
            <span class="card__step-number" aria-hidden="true">2</span>
            <h3>Wdrożenie</h3>
            <p>Konfigurujemy role, alerty i raporty zgodnie z operacjami.</p>
          </div>
          <div class="card card--step">
            <span class="card__step-number" aria-hidden="true">3</span>
            <h3>Ulepszanie</h3>
            <p>Regularnie pracujemy nad KPI, trendami i automatyzacjami.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="cta-panel">
          <div class="cta-panel__header">
            <h2 class="cta-panel__title">Chcesz poznać nasz zespół?</h2>
            <p class="cta-panel__lead">Porozmawiajmy o twojej flocie i pokażmy, jak pracuje FleetOps.</p>
          </div>
          <div class="cta-panel__actions">
            <a class="button button--primary" href="#/contact">Skontaktuj się</a>
            <a class="button button--secondary" href="#/app">Zobacz demo aplikacji</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderContactPage() {
  renderMarketingShell({
    title: "Kontakt",
    eyebrow: "Kontakt",
    lead: "Opisz potrzeby swojej floty, a wrócimy z konkretną odpowiedzią dotyczącą demo, wdrożenia lub zakresu funkcji.",
    description: "Skontaktuj się z zespołem FleetOps. Demo, integracje i pytania o cennik.",
    body: `
      <section class="section-tight">
        <div class="grid grid--contact">
          <div class="contact-form">
            <h2 class="contact-form__title">Formularz kontaktowy</h2>
            <p class="contact-form__lead">Zostaw dane, a odezwiemy się w ciągu 1 dnia roboczego.</p>
            <form id="contactForm" class="contact-form__body">
              <label class="form-control">
                <span class="label">Imię i nazwisko</span>
                <input class="input" name="name" type="text" required minlength="3" placeholder="Jan Kowalski" />
              </label>
              <label class="form-control">
                <span class="label">E-mail służbowy</span>
                <input class="input" name="email" type="email" required placeholder="twoja@firma.pl" />
              </label>
              <label class="form-control">
                <span class="label">Wielkość floty</span>
                <select class="input" name="fleet" required>
                  <option value="">Wybierz</option>
                  <option value="1-15">1-15 pojazdów</option>
                  <option value="16-60">16-60 pojazdów</option>
                  <option value="60+">60+ pojazdów</option>
                </select>
              </label>
              <label class="form-control">
                <span class="label">Wiadomość</span>
                <textarea class="input" name="message" rows="4" required minlength="10" placeholder="Opisz wyzwania operacyjne lub cele..."></textarea>
              </label>
              <div class="form-control">
                <span class="label">Zgoda</span>
                <label class="checkbox-control" for="contactConsent">
                  <input id="contactConsent" name="consent" type="checkbox" required />
                  <span>Zgadzam się na kontakt w sprawie FleetOps. Formularz jest częścią demonstracyjnego projektu portfolio.</span>
                </label>
              </div>
              <button class="button button--primary" type="submit">Wyślij zapytanie</button>
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
              <p class="muted small">Projekt i interfejs: Kamil Król (kp_code_).</p>
              <a class="button button--secondary" href="#/pricing">Zobacz cennik</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Pytania</p>
          <h2 class="section-header__title">Najczęstsze pytania</h2>
        </div>
        <div class="accordion" id="faq">
          <div class="accordion-item">
            <button class="accordion-header">Jak szybko odpowiadacie?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Najczęściej w ciągu 24h w dni robocze.</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">Czy jest demo?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Tak, wersja demo jest dostępna online bez instalacji.</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header">Czy są integracje?<span aria-hidden="true">?</span></button>
            <div class="accordion-content"><p>Integrujemy się z GPS, telematyką oraz ERP/TMS. Szczegóły uzgadniamy w czasie wdrożenia.</p></div>
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
      Toast.show("Uzupełnij wymagane pola.", "warning", { assertive: true });
      return;
    }
    form.reset();
    Toast.show("Dziękujemy! Wkrótce się odezwiemy.", "success");
  });
}

function renderPrivacyPage() {
  renderMarketingShell({
    title: "Polityka prywatności",
    eyebrow: "Polityka prywatności",
    lead: "Szanujemy prywatność użytkowników wersji demonstracyjnej FleetOps. Poniżej opisujemy zakres danych i sposób ich przetwarzania w modelu demo.",
    description: "Polityka prywatności FleetOps (wersja demo). Dane lokalne, brak backendu i jasne zasady przetwarzania informacji.",
    body: `
      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Informacja o wersji demo</p>
          <h2 class="section-header__title">Serwis demonstracyjny bez backendu</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Brak kont produkcyjnych</h3>
            <p>FleetOps to projekt portfolio / demo. Nie tworzymy kont w chmurze ani nie udostępniamy panelu klientom komercyjnym.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane w przeglądarce</h3>
            <p>Wszelkie dane są zapisywane lokalnie w przeglądarce użytkownika (localStorage) i nie są wysyłane na serwer.</p>
          </div>
          <div class="marketing-card">
            <h3>Brak integracji z osobami trzecimi</h3>
            <p>Demo nie przekazuje danych do zewnętrznych systemów ani narzędzi analitycznych poza standardowymi funkcjami przeglądarki.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Administrator</p>
          <h2 class="section-header__title">Kto jest administratorem danych</h2>
        </div>
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
        <div class="section-header">
          <p class="tag">Zakres danych</p>
          <h2 class="section-header__title">Jakie dane mogą wystąpić w demo</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Formularz kontaktowy</h3>
            <ul class="list-check">
              <li>Imię i nazwisko</li>
              <li>E-mail służbowy</li>
              <li>Wiadomość i wielkość floty</li>
            </ul>
            <p class="muted small">Formularz działa lokalnie i nie wysyła danych na serwer. Dane wpisane w formularzu pozostają wyłącznie w przeglądarce użytkownika.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane demo w aplikacji</h3>
            <ul class="list-check">
              <li>Mockowe zlecenia, pojazdy i kierowcy</li>
              <li>Ustawienia SLA i statusy operacyjne</li>
              <li>Preferencje użytkownika (np. motyw)</li>
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
        <div class="section-header">
          <p class="tag">Cookies i technologie podobne</p>
          <h2 class="section-header__title">Pliki cookies oraz localStorage</h2>
        </div>
        <div class="marketing-card">
          <p>W wersji demo nie korzystamy z cookies marketingowych ani narzędzi analitycznych. Serwis może wykorzystywać localStorage w celu zapisania preferencji (np. motyw) oraz danych demo generowanych lokalnie w przeglądarce.</p>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Prawa użytkownika</p>
          <h2 class="section-header__title">Kontrola nad danymi w wersji demo</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Dostęp i poprawa</h3>
            <p>Masz prawo uzyskać informacje o danych zapisanych lokalnie. W wersji demo wystarczy przejrzeć dane w przeglądarce.</p>
          </div>
          <div class="marketing-card">
            <h3>Usunięcie danych</h3>
            <p>Możesz wyczyścić localStorage w ustawieniach przeglądarki, aby usunąć dane demo i preferencje.</p>
          </div>
          <div class="marketing-card">
            <h3>Kontakt z administratorem</h3>
            <p>Jeśli potrzebujesz wsparcia, napisz na kontakt@kp-code.pl. Uwaga: wiadomość wysłana e-mailem (mailto) trafia do administratora i jest przetwarzana w celu odpowiedzi na zapytanie.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Bezpieczeństwo</p>
          <h2 class="section-header__title">Jak dbamy o bezpieczeństwo</h2>
        </div>
        <div class="marketing-card">
          <p>Wersja demo działa wyłącznie po stronie klienta. Nie przechowujemy danych na serwerze, nie profilujemy i nie sprzedajemy informacji. Stosujemy podstawowe praktyki bezpieczeństwa: aktualne zależności, brak publicznego API / endpointów do przesyłania danych oraz minimalny zakres danych.</p>
        </div>
      </section>

      <section class="section-tight cta-panel">
        <div>
          <h2 class="section-header__title">Masz pytania o prywatność?</h2>
          <p>Skontaktuj się z nami, odpowiemy w sprawie wersji demo FleetOps.</p>
        </div>
        <div class="hero-cta">
          <a class="button button--primary" href="#/contact">Kontakt</a>
          <a class="button button--secondary" href="#/app">Przejdź do demo</a>
        </div>
      </section>
    `,
  });
}

function renderTermsPage() {
  renderMarketingShell({
    title: "Regulamin",
    eyebrow: "Regulamin",
    lead: "Regulamin określa zasady korzystania z demonstracyjnej wersji FleetOps. To projekt demo bez backendu i bez gwarancji produkcyjnej.",
    description: "Regulamin korzystania z wersji demo FleetOps. Zasady użytkowania, ograniczenia odpowiedzialności i prawa autorskie.",
    body: `
      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Zakres</p>
          <h2 class="section-header__title">Charakter usługi</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Projekt demonstracyjny</h3>
            <p>FleetOps jest projektem demonstracyjnym (demo). Aplikacja służy do prezentacji interfejsu i funkcji i nie stanowi komercyjnego produktu produkcyjnego.</p>
          </div>
          <div class="marketing-card">
            <h3>Brak gwarancji SLA</h3>
            <p>Nie gwarantujemy ciągłości działania, dostępności, kompletności funkcji ani określonego poziomu wsparcia. Dostęp do demo może być zmieniany lub wstrzymany.</p>
          </div>
          <div class="marketing-card">
            <h3>Tryb lokalny</h3>
            <p>Dane demo zapisywane są lokalnie w przeglądarce użytkownika (np. localStorage), bez synchronizacji z serwerem.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Zasady korzystania</p>
          <h2 class="section-header__title">Co jest dozwolone</h2>
        </div>
        <div class="marketing-card">
          <ul class="list-check">
            <li>Korzystanie z demo w celach edukacyjnych i prezentacyjnych.</li>
            <li>Przeglądanie interfejsu, funkcji i przykładowych danych.</li>
            <li>Kontakt w celu omówienia współpracy lub wdrożenia.</li>
          </ul>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Nadużycia</p>
          <h2 class="section-header__title">Czego zabrania regulamin</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Próby łamania zabezpieczeń</h3>
            <p>Zakazane są próby obejścia zabezpieczeń, ingerencja w działanie aplikacji, testy penetracyjne oraz działania zmierzające do uzyskania nieuprawnionego dostępu.</p>
          </div>
          <div class="marketing-card">
            <h3>Automaty i spam</h3>
            <p>Zakazane jest generowanie sztucznego ruchu, wysyłanie automatycznych zgłoszeń oraz nadużywanie formularzy kontaktowych.</p>
          </div>
          <div class="marketing-card">
            <h3>Użycie komercyjne</h3>
            <p>Zakazane jest wykorzystywanie wersji demo jako gotowego systemu produkcyjnego, w tym do obsługi realnych procesów firmy lub danych osobowych.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Odpowiedzialność</p>
          <h2 class="section-header__title">Ograniczenie odpowiedzialności</h2>
        </div>
        <div class="marketing-card">
          <p>Wersja demo jest udostępniana "tak jak jest" (as is). W najszerszym zakresie dopuszczalnym przez prawo właściciel projektu nie ponosi odpowiedzialności za szkody wynikające z korzystania z demo, w tym za utratę danych lokalnych, przerwy w dostępie, błędy interfejsu lub decyzje podjęte na podstawie prezentowanych informacji.</p>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Prawa autorskie</p>
          <h2 class="section-header__title">Własność intelektualna</h2>
        </div>
        <div class="marketing-card">
          <p>Interfejs, treści, layout, grafiki oraz kod źródłowy FleetOps są chronione prawem autorskim i należą do właściciela projektu: Kamil Król (KP_Code_). Zabronione jest kopiowanie, rozpowszechnianie lub udostępnianie bez uprzedniej pisemnej zgody.</p>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Kontakt</p>
          <h2 class="section-header__title">Dane właściciela</h2>
        </div>

        <div class="card-soft">
          <address class="contact-address">
            <div><strong>Imię i nazwisko:</strong> Kamil Król (KP_Code_)</div>

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
          <h2 class="section-header__title">Chcesz poznać FleetOps bliżej?</h2>
          <p>Przetestuj demo lub napisz do nas z pytaniami o wdrożenie.</p>
        </div>
        <div class="hero-cta">
          <a class="button button--primary" href="#/app">Otwórz demo</a>
          <a class="button button--secondary" href="#/contact">Skontaktuj się</a>
        </div>
      </section>
    `,
  });
}

function renderCookiesPage() {
  renderMarketingShell({
    title: "Polityka cookies",
    eyebrow: "Polityka cookies",
    lead: "Wersja demo FleetOps nie stosuje śledzących plików cookies. Wyjaśniamy, jakie dane techniczne mogą być zapisane lokalnie.",
    description: "Polityka cookies FleetOps (wersja demo). Informacje o danych technicznych, localStorage i sposobach zarządzania ustawieniami.",
    body: `
      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Podstawy</p>
          <h2 class="section-header__title">Jakich mechanizmów używamy</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Brak tracking cookies</h3>
            <p>FleetOps nie wykorzystuje marketingowych ani analitycznych ciasteczek śledzących.</p>
          </div>
          <div class="marketing-card">
            <h3>LocalStorage</h3>
            <p>Preferencje interfejsu i dane demo są przechowywane lokalnie w przeglądarce użytkownika.</p>
          </div>
          <div class="marketing-card">
            <h3>Dane techniczne przeglądarki</h3>
            <p>Przeglądarka może zapisywać dane niezbędne do poprawnego działania strony (np. cache), zgodnie z jej własnymi zasadami.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="landing-section__header">
          <p class="tag">Kategorie</p>
          <h2 class="section-header__title">Jakie dane techniczne mogą wystąpić</h2>
        </div>
        <div class="marketing-card">
          <ul class="list-check">
            <li>Ustawienia motywu i preferencje interfejsu</li>
            <li>Historia ostatnich widoków w demo</li>
            <li>Mockowe dane operacyjne zapisane lokalnie</li>
          </ul>
          <p class="muted small">Wersja demo nie wykorzystuje zewnętrznych skryptów analitycznych ani reklamowych.</p>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Zarządzanie</p>
          <h2 class="section-header__title">Jak kontrolować dane w przeglądarce</h2>
        </div>
        <div class="grid">
          <div class="marketing-card">
            <h3>Ustawienia przeglądarki</h3>
            <p>W ustawieniach przeglądarki możesz wyczyścić dane strony oraz ograniczyć zapisywanie danych lokalnych.</p>
          </div>
          <div class="marketing-card">
            <h3>Czyszczenie localStorage</h3>
            <p>Usunięcie danych lokalnych przywróci demo do stanu początkowego (np. motyw, ustawienia, dane demo).</p>
          </div>
          <div class="marketing-card">
            <h3>Brak narzędzi stron trzecich</h3>
            <p>Nie korzystamy z zewnętrznych narzędzi analitycznych ani reklamowych, które mogłyby ustawić cookies śledzące.</p>
          </div>
        </div>
      </section>

      <section class="section-tight">
        <div class="section-header">
          <p class="tag">Kontakt</p>
          <h2 class="section-header__title">Masz pytania o politykę cookies?</h2>
        </div>
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
            Dane kontaktowe dotyczą twórcy projektu demonstracyjnego FleetOps.
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
