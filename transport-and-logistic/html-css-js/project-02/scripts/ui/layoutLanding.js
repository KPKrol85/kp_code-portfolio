function renderLanding() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="landing">
      <header class="container navbar" role="banner">
        <div class="logo flex" aria-label="FleetOps">
          <img src="assets/icons/logo.svg" alt="FleetOps logo" width="28" height="28" />
          <span>FleetOps</span>
        </div>
        <nav aria-label="Nawigacja główna">
          <ul class="nav-links">
            <li><a href="#/">Product</a></li>
            <li><a href="#/">Features</a></li>
            <li><a href="#/">Pricing</a></li>
            <li><a href="#/about">About</a></li>
            <li><a href="#/contact">Contact</a></li>
            <li><a class="button ghost" href="#/login">Log in</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        <section class="container section hero">
          <div>
            <div class="tag">Fleet & Transport Operations Center</div>
            <h1>FleetOps — zarządzanie transportem bez tarcia.</h1>
            <p>Monitoruj zlecenia, pojazdy i kierowców w jednym widoku. Alerty SLA, realtime ETA i szybkie decyzje wspierane przez przejrzysty interfejs.</p>
            <div class="hero-cta">
              <a class="button primary" href="#/login">Get started</a>
              <a class="button secondary" href="#/app">View demo</a>
              <span class="muted small">Bez instalacji. Mock data.</span>
            </div>
          </div>
          <div class="hero-visual">
            <div class="flex-between">
              <div>
                <p class="muted small">Rezerwacje</p>
                <h3>124 aktywne</h3>
              </div>
              <div class="badge">99.2% on-time</div>
            </div>
            <div class="progress-bar" style="margin: 14px 0 18px;">
              <span style="width: 72%"></span>
            </div>
            <div class="hero-stats">
              <div class="hero-stat">
                <p class="muted small">Orders w trasie</p>
                <h4>48</h4>
              </div>
              <div class="hero-stat">
                <p class="muted small">Opóźnienia</p>
                <h4>3</h4>
              </div>
              <div class="hero-stat">
                <p class="muted small">Dostawy dziś</p>
                <h4>71</h4>
              </div>
            </div>
          </div>
        </section>

        <section class="container section">
          <div class="flex-between" style="margin-bottom: var(--space-3);">
            <div>
              <p class="tag">Features</p>
              <h2>Usprawnij dispatch, zdrowie floty i SLA.</h2>
              <p>Pracuj szybciej dzięki jasnym statusom, filtrom i alertom prosto z dashboardu.</p>
            </div>
            <a class="button ghost" href="#/login">Launch console</a>
          </div>
          <div class="grid feature-grid">
            <div class="feature-card">
              <h3>Dispatch flow</h3>
              <p>Przydzielaj kursy, śledź postęp i reaguj na zakłócenia z jednego widoku.</p>
            </div>
            <div class="feature-card">
              <h3>Fleet health</h3>
              <p>Przeglądy, serwisy i awarie pod kontrolą dzięki checklistom i timeline.</p>
            </div>
            <div class="feature-card">
              <h3>SLA alerts</h3>
              <p>Alerty o opóźnieniach i KPI, zanim klient to zauważy.</p>
            </div>
            <div class="feature-card">
              <h3>Reports</h3>
              <p>Wydajność, wykorzystanie floty i emisje w lekkich raportach eksportowalnych.</p>
            </div>
          </div>
        </section>

        <section class="container section">
          <p class="tag">How it works</p>
          <h2>3 kroki do kontroli nad transportem</h2>
          <div class="grid how-grid" style="margin-top: var(--space-3);">
            <div class="step">
              <h3>1. Podłącz dane</h3>
              <p>Dodaj zlecenia i flotę lub skorzystaj z danych demo.</p>
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
          <p class="tag">Pricing</p>
          <h2>Lekki cennik na start</h2>
          <div class="pricing" style="margin-top: var(--space-3);">
            <div class="price-card">
              <div class="badge">Starter</div>
              <div class="price">$39</div>
              <p>10 pojazdów, podstawowe alerty, export CSV.</p>
              <button class="button secondary">Start free</button>
            </div>
            <div class="price-card">
              <div class="badge">Pro</div>
              <div class="price">$79</div>
              <p>50 pojazdów, SLA alerts, raporty tygodniowe.</p>
              <button class="button primary">Request trial</button>
            </div>
            <div class="price-card">
              <div class="badge">Enterprise</div>
              <p>Custom</p>
              <p>Integracje, SSO, dedykowany support.</p>
              <button class="button ghost">Talk to us</button>
            </div>
          </div>
        </section>

        <section class="container section">
          <p class="tag">Testimonials</p>
          <h2>Operatorzy o FleetOps</h2>
          <div class="testimonials" style="margin-top: var(--space-3);">
            <div class="testimonial">
              <p>"Planowanie tras skróciło się o 40%. Alerty SLA są bardzo klarowne."</p>
              <p class="muted small">COO, CargoNord</p>
            </div>
            <div class="testimonial">
              <p>"Kierowcy wiedzą, co robić. Wsparcie klienta widzi statusy live."</p>
              <p class="muted small">Operations Lead, FreshLine</p>
            </div>
            <div class="testimonial">
              <p>"UI jak Linear, ale dla transportu. Zespół pokochał."</p>
              <p class="muted small">Fleet Manager, AeroParts</p>
            </div>
          </div>
        </section>

        <section class="container section faq">
          <p class="tag">FAQ</p>
          <h2>Najczęstsze pytania</h2>
          <div class="accordion" id="faq">
            <div class="accordion-item">
              <button class="accordion-header">Czy mogę używać trybu dark?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>Tak, FleetOps ma wbudowany toggle, który zapamiętuje wybór.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">Czy dane to produkcja?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>To mocki bez backendu. Idealne do demo i portfolio.</p></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-header">Jak zacząć?<span aria-hidden="true">▾</span></button>
              <div class="accordion-content"><p>Wejdź na "Get started" lub "View demo" i odkryj dashboard.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer class="container footer">
        <div class="logo flex">
          <img src="assets/icons/logo.svg" alt="FleetOps" width="22" height="22" />
          <span>FleetOps</span>
        </div>
        <div class="footer-links">
          <a href="#/privacy">Privacy</a>
          <a href="#/terms">Terms</a>
          <a href="#/cookies">Cookies</a>
          <a href="#/about">About</a>
          <a href="#/contact">Contact</a>
        </div>
      </footer>
    </div>
  `;

  const faq = document.getElementById('faq');
  if (faq) Accordion.init(faq);
}

window.renderLanding = renderLanding;
