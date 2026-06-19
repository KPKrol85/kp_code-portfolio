# Audit Resolved

Krotkie notki o sprawach zamknietych po audycie.

Format wpisu: `YYYY-MM-DD - [Priorytet] Temat: krotki opis dowodu lub decyzji.`

## Resolved

- 2026-06-18 - [P2] Eksport CSV zlecen w demo: CSV export is intentionally unavailable in the demo version. `scripts/ui/views/ordersView.js` usuwa nieosiagalna implementacje blob/download i zostawia natywnie wylaczony przycisk z jasnym tytulem, a `tests/smoke.spec.js` weryfikuje disabled CSV oraz niezmieniony eksport JSON raportow. Usunieto dokladny wpis P2 z `AUDIT.md`.

- 2026-06-18 - [P2] Preferencje tabel/list w ustawieniach: `scripts/ui/views/settingsView.js` podpina przycisk `25 wierszy` pod realne `FleetStore.setListPrefs()` dla `orders`, `fleet` i `drivers`, a `Gesty widok` pod istniejace `FleetStore.setCompact()`. Stan UI uzywa `aria-pressed`, `styles/src/06-app-components.css` dodaje widoczna aktywna klase przycisku, preferencje sa zapisywane przez istniejacy mechanizm storage, a `tests/smoke.spec.js` weryfikuje persystencje po reloadzie. Usunieto dokladny wpis P2 z `AUDIT.md`.

- 2026-05-25 - [P2] Jawna zgoda w formularzu kontaktowym: `scripts/ui/marketingPages.js` renderuje teraz wymagany checkbox `#contactConsent` / `name="consent"` z widoczna etykieta informujaca, ze formularz dotyczy demonstracyjnego projektu portfolio, a `styles/src/03-components.css` dodaje maly styl dla `.checkbox-control`. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano `node --check`, targeted `rg` i check natywnej walidacji formularza.

- 2026-05-25 - [P1] Pelne reduced-motion dla pozostalych animacji: `styles/src/04-data.css` wylacza shimmer skeleton loaderow przy `prefers-reduced-motion: reduce`, `styles/src/05-landing.css` wylacza `heroFade` dla `.img-swap`, a `styles/src/03-components.css` usuwa przejscie `max-height` paneli accordion w reduced motion bez zmiany normalnego ruchu. Usunieto dokladny wpis P1 z `daily-AUDIT.md`; zweryfikowano targeted `rg`.

- 2026-05-24 - [P2] Wspolny shell landing/marketing: `scripts/ui/layoutLanding.js` udostepnia wspolne helpery dla headera, footera, resources menu, mobile drawer, theme toggle, scroll state, logo scroll i accordion init, a `scripts/ui/marketingPages.js` renderuje publiczne strony przez te same helpery bez osobnej kopii nawigacji i stopki. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano `node --check`, targeted `rg` oraz `npm run test:smoke`.

- 2026-05-24 - [P2] Celowane live regions: `index.html` nie ustawia juz `aria-live="polite"` na calym `#app`, dodaje dedykowany ukryty `#fleetops-route-status`, `scripts/router.js` oglasza krotkie komunikaty `Widok: ...` po udanym renderze route, a komunikaty tymczasowe pozostaja w dedykowanych regionach toast `role="status"` / `role="alert"`. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano targeted `rg` oraz `npm run test:smoke`.

- 2026-05-23 - [P2] Przestarzaly helper minifikacji JS usuniety: `minify-js.js` nie mial referencji w `package.json`, dokumentacji ani aktywnym workflow, celowal w nieistniejace `js/` i `js/dist`, a produkcyjna minifikacja pozostaje w `build-dist.js`. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano targeted `rg`.

- 2026-05-23 - [P2] Spojna polska kopia UI: widoczne etykiety, ARIA labels, komunikaty toast, modale i testy smoke uzywaja naturalnych polskich tekstow z diakrytykami tam, gdzie sa user-facing. Zachowano techniczne identyfikatory i akceptowane terminy SaaS/KPI/SLA/CSV/API/RBAC; usunieto dokladny wpis P2 z `daily-AUDIT.md` i zweryfikowano targeted `rg`.

- 2026-05-23 - [P2] Sitemap zawiera tylko kanoniczne indexowalne URL-e: `sitemap.xml` zostawia homepage `https://saas-pr02-fleetops.netlify.app/`, usuwa duplikat `/index.html` oraz strone `404.html` oznaczona `noindex, follow`. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano targeted `rg`.

- 2026-05-23 - [P2] JavaScript respektuje reduced motion przy scrollu: `scripts/utils/dom.js` udostepnia `FleetUI.getMotionSafeScrollBehavior()`, a logo scroll oraz dashboard alerts uzywaja `auto` przy `prefers-reduced-motion: reduce` i `smooth` w pozostalych przypadkach. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano targeted `rg` i check przegladarkowy dla obu preferencji ruchu.

- 2026-05-23 - [P2] Lokalna sciezka fontu Inter: `styles/src/00-settings.css`, `index.html` i `404.html` wskazuja `/assets/fonts/inter-latin.woff2`, zgodnie z realnym polozeniem pliku w `assets/fonts/`. Usunieto dokladny wpis P2 z `daily-AUDIT.md`; zweryfikowano targeted `rg` oraz podglad lokalny bez requestu do `/styles/assets/fonts/...`.

- 2026-05-23 - [P1] Dropdown disclosure semantics: `layoutApp.js`, `layoutLanding.js`, `marketingPages.js`, `dashboardView.js`, `ordersView.js`, `fleetView.js` i `driversView.js` nie renderuja juz niepelnej semantyki ARIA menu; triggery zachowuja `aria-expanded`/`aria-controls`, a zawartosc pozostaje natywnymi linkami, buttonami i kontrolkami. Zweryfikowano targeted `rg` dla `role="menu"` / `aria-haspopup="menu"` / `role="menuitem"` oraz `npm run test:smoke` z regresja Escape i brakiem pulapki fokusu.

- 2026-05-22 - [P1] Dostepny feedback dynamiczny: `scripts/ui/components/toast.js` ma stale regiony live `role="status"` i `role="alert"` z `aria-live` oraz `aria-atomic`, blokujace komunikaty w `scripts/router.js`, `scripts/core/permissions.js`, `scripts/ui/marketingPages.js` i `scripts/ui/views/ordersView.js` sa oznaczane jako assertive, a formularze CRUD w `ordersView.js`, `fleetView.js` i `driversView.js` lacza pola z bledami przez stabilne ID i `aria-describedby` przy minimalnych helperach w `scripts/utils/dom.js`. Zweryfikowano `npm run test:smoke` oraz targeted `rg`; dokladny wpis P1 zostal usuniety z `daily-AUDIT.md`.

- 2026-05-20 - [P1] Bezpieczne renderowanie shell/toast: `scripts/ui/layoutApp.js` escapuje dane uzytkownika przez `window.FleetUI.escapeHtml`, a `scripts/ui/components/toast.js` renderuje komunikaty przez `document.createTextNode`.

- 2026-05-20 - [P1] Spojna domena produkcyjna: `index.html`, `404.html`, `sitemap.xml`, `robots.txt` i `assets/favicon/site.webmanifest` wskazuja `https://saas-pr02-fleetops.netlify.app`.

- 2026-05-22 - [P1] Manifest shortcuts zgodne z hash routerem: `assets/favicon/site.webmanifest` uzywa `/#/app`, `/#/app/fleet` i `/#/app/orders` dla skrotow PWA.

- 2026-05-22 - [P2] Manifest screenshot paths: `assets/favicon/site.webmanifest` uzywa root-relative `src` dla screenshotow, zeby dzialaly lokalnie i produkcyjnie.

- 2026-05-22 - [P2] Open Graph asset map: `IMAGE-ASSET-PIPELINE-MAP.md` wskazuje `.jpg` dla `assets/og-img/og-1200x1200.jpg` i `og-1200x630.jpg`.

- 2026-05-20 - [P2] Accordion ARIA: `scripts/ui/components/accordion.js` synchronizuje `aria-expanded`, `aria-controls` i stabilne ID paneli akordeonu.

- 2026-05-20 - [P2] Marketing markup quotes: `scripts/ui/marketingPages.js` ma usuniete nadmiarowe cudzyslowy w `class="grid marketing-grid"`.

- 2026-05-20 - [P2] Service worker registration: `sw.js` zostal zweryfikowany i jest rejestrowany progresywnie z `scripts/main.js`.

- 2026-05-20 - [P2] Heading hierarchy: app routes maja route-level `h1`, glowne sekcje widokow `h2`, a karty i zagniezdzone grupy `h3`.

- 2026-05-20 - [P2] Smoke tests: dodano minimalne testy Playwright dla landing/login, routingu aplikacji, CRUD zlecen i bezpiecznego renderowania tekstu.
