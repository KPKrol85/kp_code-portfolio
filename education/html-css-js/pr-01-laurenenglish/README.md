# Lauren English

## PL

### Przegląd projektu

Lauren English to statyczna, wielostronicowa witryna edukacyjna prezentująca ofertę indywidualnej nauki języka angielskiego. Repozytorium obejmuje stronę główną, usługi, pakiety, katalog materiałów, lokalny dziennik postępów, kontakt, dokumenty prawne oraz strony techniczne dla błędów, trybu offline i potwierdzenia wysłania formularza.

Każda trasa jest samodzielnym dokumentem HTML. Wspólny shell, metadane, treści oparte na danych i Service Worker są składane przez statyczne skrypty Node.js. Przeglądarka ładuje bezpośrednio kanoniczne źródła `/css/style.css` i `/js/main.js`; projekt nie używa frameworka frontendowego ani routingu SPA.

### Wersja online

[Otwórz Lauren English](https://education-pr01-laurenenglish.netlify.app/)

### Kluczowe funkcje

- responsywny wspólny header, nawigacja mobilna z pułapką fokusu, aktywne stany nawigacji i przełącznik jasnego/ciemnego motywu;
- dane pakietów i materiałów utrzymywane w modułach JavaScript oraz renderowane do HTML podczas buildu;
- katalog materiałów dostępny bez JavaScriptu i rozszerzany po inicjalizacji o filtrowanie kategorii, poziomu i dostępności;
- lokalny dziennik postępów z celami tygodniowymi, dziennymi check-inami, statystykami, resetem i eksportem JSON;
- formularz kontaktowy skonfigurowany dla Netlify Forms z honeypotem i przekierowaniem na stronę podziękowania;
- FAQ accordion, nawigacja po anchorach z przenoszeniem fokusu oraz animacje respektujące `prefers-reduced-motion`;
- generowane metadane SEO, manifest aplikacji, Service Worker i dedykowany fallback offline.

### Stack technologiczny

- **Runtime:** semantyczny HTML5, CSS, Vanilla JavaScript w natywnych modułach ES;
- **CSS:** design tokens, BEM, układ mobile-first, PostCSS, `postcss-import`, cssnano;
- **Build:** statyczne skrypty Node.js ESM, esbuild dla pomocniczego bundla JavaScript, imagemin dla obrazów;
- **Development:** npm z `package-lock.json`, projektowy serwer Python 3 z live reload oraz `serve` do statycznego podglądu;
- **Jakość kodu:** ESLint, Prettier i projektowe walidatory HTML, treści, danych, CSS, SEO, PWA oraz workflow deweloperskiego;
- **Testy przeglądarkowe:** Playwright w Chromium dla widoków desktopowych i mobilnych;
- **Integracja hostingowa:** Netlify Forms i reguły `_redirects`.

### Architektura

- `scripts/shared-shell.mjs` generuje współdzielony skip link, header, nawigację, footer i informacyjny dialog projektu dla sześciu stron publicznych oraz trzech stron prawnych.
- `scripts/site-config.mjs` jest rejestrem tras, metadanych, polityki indeksowania, publicznych zasobów SEO i konfiguracji `PROJECT_DISCLOSURE`.
- `scripts/content-renderers.mjs` łączy dane z `js/data/` z oznaczonymi regionami pakietów i materiałów w HTML.
- `css/style.css` zachowuje kolejność warstw `tokens → base → utilities → components → sections → pages`.
- `js/main.js` inicjalizuje odseparowane moduły funkcjonalne; każdy moduł chroni zapytania DOM i kończy działanie, gdy jego komponent nie występuje na stronie.
- `service-worker.template.js` i `scripts/pwa-config.mjs` są źródłami generowanego `service-worker.js`.

Pliki HTML w katalogu głównym zawierają kanoniczną treść właściwą danej stronie, ale regionów oznaczonych komentarzami `seo:*`, `shared-shell:*`, `package-*` i `materials-*` nie należy edytować ręcznie. `sitemap.xml`, `robots.txt`, `_redirects` i `service-worker.js` także są generowane przez skrypty projektu.

### Struktura projektu

```text
.
├── index.html                 # strona główna
├── uslugi.html                # usługi
├── pakiety.html               # porównanie pakietów
├── materialy.html             # katalog materiałów
├── postepy.html               # lokalny dziennik postępów
├── kontakt.html               # dane kontaktowe i formularz Netlify
├── polityka-prywatnosci.html  # dokumenty prawne
├── regulamin.html
├── cookies.html
├── 404.html                   # strony techniczne
├── offline.html
├── thank-you.html
├── css/                       # tokeny, warstwy bazowe, komponenty, sekcje i strony
├── js/
│   ├── data/                  # pakiety, materiały, dostęp, filtry i definicje postępów
│   ├── modules/               # moduły interakcji
│   ├── pages/                 # logika stron
│   └── state/                 # bezpieczne operacje na stanie przeglądarki
├── scripts/                   # assemblery, renderery, walidatory i serwer developerski
├── assets/                    # obrazy, ikony, fonty, PWA i pomocnicze buildy
├── tests/e2e/                 # testy Playwright
├── docs/                      # dokumentacja architektury i workflow
├── service-worker.template.js
├── service-worker.js          # plik generowany
├── site.webmanifest
├── package.json
└── LICENSE.md
```

### Instalacja

Repozytorium używa npm i zawiera lockfile:

```powershell
npm ci
npx playwright install chromium
```

Projekt nie deklaruje konkretnej wersji Node.js. Python 3 jest wymagany wyłącznie przez projektowy serwer uruchamiany poleceniem `npm run dev` lub plikiem `start-dev.bat`.

### Development lokalny

```powershell
npm run dev
```

Serwer składa HTML, uruchamia witrynę pod `http://127.0.0.1:8181/`, otwiera przeglądarkę i obserwuje źródła. Zmiany zależne od assemblera wywołują ponownie `npm run build:html` przed odświeżeniem strony. Na tym porcie aplikacja usuwa wyłącznie własną lokalną rejestrację Service Workera i cache z prefiksem `lauren-english-v`, aby stan PWA nie zasłaniał zmian źródłowych.

W systemie Windows ten sam workflow można uruchomić przez `start-dev.bat`. Prosty statyczny podgląd jest dostępny przez:

```powershell
npm run serve
```

### Dostępne skrypty

- `npm run dev` — projektowy serwer Python z live reload na porcie `8181`;
- `npm run serve` — statyczny podgląd katalogu głównego;
- `npm run build` — składa HTML i generuje `service-worker.js`;
- `npm run build:html` / `npm run check:html` — aktualizuje lub bez zapisu sprawdza regiony HTML oraz zasoby routingu;
- `npm run build:sw` — waliduje precache i generuje Service Workera z deterministyczną rewizją cache;
- `npm run check:data` / `npm run check:content` — sprawdza dane pakietów i materiałów oraz integralność treści publicznych;
- `npm run check:css` — sprawdza architekturę CSS, tokeny motywów i zdefiniowane pary kontrastu;
- `npm run check:seo` / `npm run check:pwa` — sprawdza odpowiednio kontrakt metadanych i routingu oraz manifest, cache i zasoby PWA;
- `npm run check:dev` — weryfikuje serwer lokalny, MIME, 404, live reload, rebuild HTML i lokalne czyszczenie PWA;
- `npm run lint:js` — uruchamia ESLint dla kanonicznych źródeł JavaScript i modułów projektu;
- `npm run test:e2e` — wykonuje build i pełny zestaw testów Playwright;
- `npm run test:e2e:smoke`, `npm run test:e2e:interactions`, `npm run test:e2e:theme`, `npm run test:e2e:responsive`, `npm run test:e2e:seo`, `npm run test:e2e:pwa` — uruchamiają skupione zestawy przeglądarkowe;
- `npm run build:css` / `npm run build:js` — odświeża pomocnicze pliki w `assets/build/`;
- `npm run build:pwa-screenshots` — odtwarza screenshoty zadeklarowane w manifeście;
- `npm run images` — generuje deterministyczne warianty WebP i AVIF dla rastrowych obrazów treści;
- `npm run format` — formatuje obsługiwane źródła przez Prettier.

### Build produkcyjny

```powershell
npm run build
```

Build działa bez katalogu `dist/`. `build:html` aktualizuje oznaczone regiony dwunastu samodzielnych dokumentów HTML oraz generuje `sitemap.xml`, `robots.txt` i `_redirects`. Następnie `build:sw` waliduje listę precache i tworzy `service-worker.js` na podstawie szablonu, konfiguracji PWA, wersji pakietu i fingerprintu zawartości.

Aktualny runtime nadal korzysta z `/css/style.css` i `/js/main.js`. Śledzone pliki `assets/build/style.min.css` oraz `assets/build/main.min.js` są generowane wyłącznie przez jawne skrypty `build:css` i `build:js`; strony i precache ich nie używają. Wygenerowanych regionów oraz plików produkcyjnych nie należy poprawiać ręcznie.

### Obrazy

Rastrowe fallbacki i ich śledzone warianty produkcyjne leżą razem w `assets/img/`; nie ma osobnego katalogu źródłowego, ponieważ skrypt przetwarza wyłącznie jawnie skonfigurowane pliki JPEG/PNG i nigdy nie czyta własnych outputów WebP ani AVIF. Kanoniczna lista obrazów znajduje się w `scripts/image-config.mjs` i obecnie obejmuje hero strony głównej, hero kontaktu oraz portret Lauren.

Uruchom `npm run images`, aby utworzyć obok każdego fallbacku pliki `.avif` i `.webp`. W HTML używaj natywnego `<picture>` w kolejności AVIF, WebP, a następnie niezmienionego `<img>` JPEG/PNG z zachowanymi atrybutami dostępności, wymiarami i strategią ładowania. Optymalizacja nie jest częścią `npm run build`; wygenerowane warianty są celowo śledzone w repozytorium i należy je odświeżyć przed buildem po zmianie skonfigurowanego obrazu.

### Testy i walidacja

Projekt udostępnia walidatory statyczne dla danych, publicznych treści, HTML, CSS, SEO, PWA i lokalnego workflow. Nie zastępują one testów przeglądarkowych.

Playwright uruchamia Chromium w projektach `1440 × 900` oraz `390 × 844`, z jednym workerem i Service Workerami domyślnie zablokowanymi. Osobny zestaw PWA włącza je w izolowanym kontekście. Testy obejmują główne trasy, wspólny shell, motywy, interakcje klawiaturowe, responsywność, routing, metadane, cache i zachowanie offline.

To zadanie dokumentacyjne nie uruchamiało buildów, walidatorów ani testów, dlatego README nie deklaruje ich aktualnego wyniku.

### Wdrożenie

Publiczna wersja jest dostępna pod adresem wskazanym w sekcji „Wersja online”. Repozytorium nie zawiera `netlify.toml`; build zapisuje komplet publikowanych plików bezpośrednio w katalogu głównym zamiast w `dist/`.

Przed publikacją należy uruchomić `npm run build`. Plik `_redirects` obsługuje alias `/thank-you`, a formularz w `kontakt.html` używa atrybutów Netlify Forms, honeypota `bot-field` i strony docelowej `/thank-you.html`.

### Dostępność

Projekt deklaruje cel WCAG 2.2 AA i implementuje konkretne mechanizmy wspierające ten kierunek, bez deklarowania formalnej zgodności:

- semantyczne landmarki, jeden `h1` na stronę, logiczne nagłówki i skip link;
- natywne kontrolki formularzy, widoczne etykiety, komunikacja pól wymaganych i style `:focus-visible`;
- mobilny drawer z `aria-expanded`, `aria-hidden`, `inert`, pułapką fokusu, obsługą `Escape` i zwrotem fokusu;
- accordion i filtry z synchronizowanymi stanami ARIA oraz obsługą klawiatury;
- przenoszenie fokusu na nagłówek docelowej sekcji po nawigacji do hasha;
- ograniczanie nieistotnego ruchu przez `prefers-reduced-motion`;
- projektowy validator kontrastu dla jawnie zdefiniowanych par w jasnym i ciemnym motywie.

### SEO

`scripts/site-config.mjs` definiuje sześć stron indeksowanych oraz sześć stron technicznych lub prawnych oznaczonych `noindex, nofollow`. Generator zapewnia stronom indeksowanym indywidualne tytuły i opisy, canonical, Open Graph, Twitter Card oraz JSON-LD typu `WebSite` lub `WebPage`.

`npm run build:html` synchronizuje metadane z `sitemap.xml`, `robots.txt` i `_redirects`. Kanonicznym obrazem społecznościowym jest lokalny plik `assets/og/og.png` o wymiarach `1200 × 630`; strony techniczne nie otrzymują canonicali ani metadanych społecznościowych.

### PWA i obsługa offline

`site.webmanifest` deklaruje tryb `standalone`, ikony `192 × 192` i `512 × 512`, trzy skróty oraz screenshoty dla szerokiego i wąskiego widoku. Service Worker jest rejestrowany po załadowaniu strony poza lokalnym środowiskiem na porcie `8181`.

Precache obejmuje główne dokumenty, offline fallback, bezpośredni graf CSS i JavaScript, lokalne fonty, logo, ikony motywu i manifestu oraz wymagane obrazy. Nawigacja używa sieci w pierwszej kolejności, zachowuje rzeczywiste odpowiedzi HTTP i przy braku sieci zwraca kopię znanej strony albo `offline.html`. Aktywacja usuwa wyłącznie starsze cache z prefiksem projektu.

### Wydajność

- runtime nie ma zależności frameworkowych ani zewnętrznych skryptów;
- Inter i Literata są dostarczane lokalnie jako WOFF2 z `font-display: swap`, a head preloaduje tylko krytyczny plik Literata 700;
- ważne obrazy mają jawne wymiary, hero korzysta z `fetchpriority="high"`, a obrazy poniżej pierwszego widoku mogą używać `loading="lazy"`;
- `scripts/pwa-config.mjs` definiuje budżety liczby requestów i rozmiaru początkowych fontów oraz obrazu hero, sprawdzane przez `npm run check:pwa`;
- pomocnicze bundle w `assets/build/` pozostają poza bieżącym grafem requestów i precache.

Sekcja opisuje zastosowane mechanizmy; repozytorium nie przechowuje wyniku Lighthouse ani innej aktualnej metryki wydajnościowej.

### Informacja o projekcie

Publiczna wersja portfolio wyświetla na pierwszej wizycie informacyjny dialog Project Disclosure Modal. Nie jest on zgodą na cookies, akceptacją regulaminu ani zgodą marketingową. Konfiguracja `PROJECT_DISCLOSURE` w `scripts/site-config.mjs` określa flagę `enabled`, bieżący `version`, klucz `laurenEnglishProjectDisclosure` oraz dopuszczone trasy. Modal otwiera się tylko na sześciu stronach indeksowanych; strony prawne, 404, offline i podziękowanie pozostają nieblokowane.

Po użyciu przycisku „Przejdź do strony” w `localStorage` zapisywana jest bieżąca wersja. Zmiana `version` wyświetla informację ponownie, a niedostępny Web Storage nie blokuje przejścia do serwisu. Dla wdrożenia rzeczywistego klienta ustaw `enabled: false` i uruchom `npm run build:html`; nie trzeba usuwać markup ani modułu JavaScript.

### Dane i trwałość stanu

- `js/data/packages.js` przechowuje trzy pakiety `start`, `regular` i `intensive`; homepage i `pakiety.html` korzystają z tych samych rekordów.
- `js/data/materials.js` zawiera statyczny katalog, a `materialAccess.js` i `materialFilters.js` centralizują stany dostępu, powiązania z pakietami i filtrowanie.
- dziennik postępów zapisuje cele i maksymalnie czternaście dni check-inów w `localStorage` pod kluczem `lauren_progress_v1`; dane można zresetować lub pobrać jako JSON.
- wybrany motyw jest również zapisywany lokalnie, z bezpiecznym fallbackiem pamięciowym, gdy Web Storage jest niedostępny.

Stan dziennika nie jest synchronizowany z kontem, bazą danych ani zdalną kopią zapasową. Formularz kontaktowy jest niezależną integracją Netlify Forms.

### Licencja

Lauren English jest własnościowym projektem Kamila Króla — KP_Code. Publiczny kod można przeglądać w portfolio oraz uruchamiać lokalnie do prywatnej, niekomercyjnej oceny. Kopiowanie, redystrybucja, publiczne wdrożenie, tworzenie utworów zależnych lub wykorzystanie komercyjne wymaga uprzedniej pisemnej zgody.

Pełne warunki, w których polska wersja jest rozstrzygająca, zawiera [LICENSE.md](LICENSE.md).

### Atrybucje

- Font Literata jest dołączony na licencji SIL Open Font License 1.1; tekst licencji znajduje się w [assets/fonts/OFL-Literata.txt](assets/fonts/OFL-Literata.txt).
- Wykorzystane inline SVG pochodzą z Font Awesome Free v7.3.1. Oryginalne komentarze licencyjne są zachowane przy ikonach, zgodnie z [warunkami Font Awesome Free](https://fontawesome.com/license/free).

## EN

### Project Overview

Lauren English is a static multi-page educational website presenting an individual English-learning offer. The repository includes the homepage, services, packages, a materials catalogue, a browser-local progress journal, contact, legal documents, and technical pages for errors, offline mode, and form submission confirmation.

Each route is a standalone HTML document. The shared shell, metadata, data-backed content, and Service Worker are assembled by static Node.js scripts. The browser loads the canonical `/css/style.css` and `/js/main.js` sources directly; the project uses neither a frontend framework nor SPA routing.

### Live Version

[Open Lauren English](https://education-pr01-laurenenglish.netlify.app/)

### Key Features

- responsive shared header, focus-trapped mobile navigation, active navigation states, and a light/dark theme toggle;
- package and material data maintained in JavaScript modules and rendered to HTML at build time;
- a materials catalogue available without JavaScript and progressively enhanced with category, level, and access filters;
- a browser-local progress journal with weekly goals, daily check-ins, statistics, reset, and JSON export;
- a contact form configured for Netlify Forms with a honeypot and thank-you-page redirect;
- an FAQ accordion, anchor navigation with focus transfer, and animations that respect `prefers-reduced-motion`;
- generated SEO metadata, an application manifest, a Service Worker, and a dedicated offline fallback.

### Tech Stack

- **Runtime:** semantic HTML5, CSS, and Vanilla JavaScript using native ES modules;
- **CSS:** design tokens, BEM, mobile-first layouts, PostCSS, `postcss-import`, and cssnano;
- **Build:** static Node.js ESM scripts, esbuild for an auxiliary JavaScript bundle, and imagemin for images;
- **Development:** npm with `package-lock.json`, a project-specific Python 3 live-reload server, and `serve` for static preview;
- **Code quality:** ESLint, Prettier, and project validators for HTML, content, data, CSS, SEO, PWA, and the development workflow;
- **Browser testing:** Playwright with Chromium desktop and mobile projects;
- **Hosting integration:** Netlify Forms and `_redirects` rules.

### Architecture

- `scripts/shared-shell.mjs` generates the shared skip link, header, navigation, footer, and informational project dialog for six public pages and three legal pages.
- `scripts/site-config.mjs` is the registry for routes, metadata, indexing policy, public SEO assets, and `PROJECT_DISCLOSURE` configuration.
- `scripts/content-renderers.mjs` connects data from `js/data/` with marked package and material regions in HTML.
- `css/style.css` preserves the `tokens → base → utilities → components → sections → pages` layer order.
- `js/main.js` initializes isolated feature modules; each module guards its DOM queries and exits when its component is absent from the page.
- `service-worker.template.js` and `scripts/pwa-config.mjs` are the sources for the generated `service-worker.js`.

Root HTML files contain canonical page-specific content, but regions marked with `seo:*`, `shared-shell:*`, `package-*`, and `materials-*` comments must not be edited manually. `sitemap.xml`, `robots.txt`, `_redirects`, and `service-worker.js` are also generated by project scripts.

### Project Structure

```text
.
├── index.html                 # homepage
├── uslugi.html                # services
├── pakiety.html               # package comparison
├── materialy.html             # materials catalogue
├── postepy.html               # browser-local progress journal
├── kontakt.html               # contact details and Netlify form
├── polityka-prywatnosci.html  # legal documents
├── regulamin.html
├── cookies.html
├── 404.html                   # technical pages
├── offline.html
├── thank-you.html
├── css/                       # tokens, base layers, components, sections, and pages
├── js/
│   ├── data/                  # packages, materials, access, filters, and progress definitions
│   ├── modules/               # interaction modules
│   ├── pages/                 # page logic
│   └── state/                 # safe browser-state operations
├── scripts/                   # assemblers, renderers, validators, and development server
├── assets/                    # images, icons, fonts, PWA assets, and auxiliary builds
├── tests/e2e/                 # Playwright tests
├── docs/                      # architecture and workflow documentation
├── service-worker.template.js
├── service-worker.js          # generated file
├── site.webmanifest
├── package.json
└── LICENSE.md
```

### Installation

The repository uses npm and includes a lockfile:

```powershell
npm ci
npx playwright install chromium
```

The project does not declare a specific Node.js version. Python 3 is required only by the project server started with `npm run dev` or `start-dev.bat`.

### Local Development

```powershell
npm run dev
```

The server assembles HTML, serves the website at `http://127.0.0.1:8181/`, opens a browser, and watches source files. Changes that depend on the assembler rerun `npm run build:html` before the page reloads. On this port, the application removes only its own local Service Worker registration and caches prefixed with `lauren-english-v`, preventing PWA state from masking source changes.

On Windows, the same workflow can be started with `start-dev.bat`. A simple static preview is available through:

```powershell
npm run serve
```

### Available Scripts

- `npm run dev` — starts the project Python live-reload server on port `8181`;
- `npm run serve` — serves a static preview of the repository root;
- `npm run build` — assembles HTML and generates `service-worker.js`;
- `npm run build:html` / `npm run check:html` — updates or read-only checks HTML regions and routing assets;
- `npm run build:sw` — validates the precache and generates the Service Worker with a deterministic cache revision;
- `npm run check:data` / `npm run check:content` — validates package and material data plus public-content integrity;
- `npm run check:css` — checks CSS architecture, theme tokens, and defined contrast pairs;
- `npm run check:seo` / `npm run check:pwa` — checks the metadata and routing contract, then the manifest, cache, and PWA assets;
- `npm run check:dev` — verifies the local server, MIME types, 404 handling, live reload, HTML rebuilds, and local PWA cleanup;
- `npm run lint:js` — runs ESLint for the project’s canonical JavaScript and module sources;
- `npm run test:e2e` — runs the build and the complete Playwright suite;
- `npm run test:e2e:smoke`, `npm run test:e2e:interactions`, `npm run test:e2e:theme`, `npm run test:e2e:responsive`, `npm run test:e2e:seo`, `npm run test:e2e:pwa` — run focused browser suites;
- `npm run build:css` / `npm run build:js` — refresh the auxiliary files in `assets/build/`;
- `npm run build:pwa-screenshots` — recreates the screenshots declared by the manifest;
- `npm run images` — generates deterministic WebP and AVIF variants for raster content images;
- `npm run format` — formats supported source files with Prettier.

### Production Build

```powershell
npm run build
```

The build does not create a `dist/` directory. `build:html` updates marked regions in twelve standalone HTML documents and generates `sitemap.xml`, `robots.txt`, and `_redirects`. `build:sw` then validates the precache and creates `service-worker.js` from its template, the PWA configuration, the package version, and a content fingerprint.

The current runtime still uses `/css/style.css` and `/js/main.js`. Tracked files `assets/build/style.min.css` and `assets/build/main.min.js` are generated only by the explicit `build:css` and `build:js` scripts; pages and the precache do not use them. Generated regions and production files must not be edited manually.

### Images

Raster fallbacks and their tracked production variants live together in `assets/img/`; there is no separate source directory because the optimizer processes only explicitly configured JPEG/PNG files and never reads its own WebP or AVIF output. The canonical image list is `scripts/image-config.mjs` and currently covers the homepage hero, contact hero, and Lauren portrait.

Run `npm run images` to create `.avif` and `.webp` files alongside each fallback. In HTML, use native `<picture>` in AVIF, WebP, then unchanged JPEG/PNG `<img>` order while preserving accessibility attributes, dimensions, and loading strategy. Image optimization is not part of `npm run build`; generated variants are intentionally tracked and must be refreshed before a build when a configured image changes.

### Testing and Validation

The project provides static validators for data, public content, HTML, CSS, SEO, PWA, and the local workflow. They complement rather than replace browser tests.

Playwright runs Chromium projects at `1440 × 900` and `390 × 844`, with one worker and Service Workers blocked by default. A dedicated PWA suite enables them in an isolated context. Tests cover primary routes, the shared shell, themes, keyboard interactions, responsive behavior, routing, metadata, caching, and offline behavior.

This documentation-only task did not run builds, validators, or tests, so the README does not claim a current passing result.

### Deployment

The public deployment is available at the URL listed under “Live Version.” The repository does not contain `netlify.toml`; the build writes the complete publishable output directly to the repository root instead of `dist/`.

Run `npm run build` before publishing. `_redirects` handles the `/thank-you` alias, while the form in `kontakt.html` uses Netlify Forms attributes, the `bot-field` honeypot, and `/thank-you.html` as its destination.

### Accessibility

The project states WCAG 2.2 AA as a target and implements concrete mechanisms supporting that direction without claiming formal conformance:

- semantic landmarks, one `h1` per page, logical headings, and a skip link;
- native form controls, visible labels, required-field communication, and `:focus-visible` styles;
- a mobile drawer with `aria-expanded`, `aria-hidden`, `inert`, focus trapping, `Escape` handling, and focus return;
- accordion and filters with synchronized ARIA state and keyboard support;
- focus transfer to the destination section heading after hash navigation;
- reduced non-essential motion through `prefers-reduced-motion`;
- a project contrast validator for explicitly defined light- and dark-theme pairs.

### SEO

`scripts/site-config.mjs` defines six indexable pages and six technical or legal pages marked `noindex, nofollow`. The generator gives indexable pages individual titles and descriptions, canonical links, Open Graph, Twitter Card, and `WebSite` or `WebPage` JSON-LD.

`npm run build:html` keeps the metadata synchronized with `sitemap.xml`, `robots.txt`, and `_redirects`. The canonical social image is the local `assets/og/og.png` file sized `1200 × 630`; technical pages receive neither canonical links nor social metadata.

### PWA and Offline Support

`site.webmanifest` declares `standalone` display mode, `192 × 192` and `512 × 512` icons, three shortcuts, and screenshots for wide and narrow views. The Service Worker is registered after page load outside the local development environment on port `8181`.

The precache includes primary documents, the offline fallback, the direct CSS and JavaScript graph, local fonts, branding, theme and manifest icons, and required images. Navigation is network-first, preserves real HTTP responses, and returns a cached known page or `offline.html` when the network is unavailable. Activation removes only older caches using the project prefix.

### Performance

- the runtime has no framework dependencies or external scripts;
- Inter and Literata are served locally as WOFF2 with `font-display: swap`, while the head preloads only the critical Literata 700 file;
- important images have explicit dimensions, the hero uses `fetchpriority="high"`, and below-the-fold images can use `loading="lazy"`;
- `scripts/pwa-config.mjs` defines request-count and byte budgets for initial fonts and the hero image, validated by `npm run check:pwa`;
- auxiliary bundles under `assets/build/` stay outside the current request graph and precache.

This section describes implemented mechanisms; the repository does not store a Lighthouse result or another current performance metric.

### Project Disclosure

The public portfolio deployment shows an informational Project Disclosure Modal on a first visit. It is not cookie consent, terms acceptance, or marketing consent. `PROJECT_DISCLOSURE` in `scripts/site-config.mjs` defines `enabled`, the current `version`, the `laurenEnglishProjectDisclosure` storage key, and eligible routes. The dialog opens only on the six indexable pages; legal, 404, offline, and thank-you pages remain unblocked.

Using “Przejdź do strony” stores the current version in `localStorage`. Changing `version` intentionally displays the notice again, and unavailable Web Storage never prevents entry to the site. For a real-client deployment, set `enabled: false` and run `npm run build:html`; neither the markup nor the JavaScript module needs to be removed.

### Data and State Persistence

- `js/data/packages.js` stores the three `start`, `regular`, and `intensive` packages; the homepage and `pakiety.html` use the same records.
- `js/data/materials.js` contains the static catalogue, while `materialAccess.js` and `materialFilters.js` centralize access states, package relationships, and filtering.
- the progress journal stores goals and up to fourteen days of check-ins in `localStorage` under `lauren_progress_v1`; users can reset the data or download it as JSON.
- the selected theme is also stored locally, with an in-memory fallback when Web Storage is unavailable.

Journal state is not synchronized with an account, database, or remote backup. The contact form is a separate Netlify Forms integration.

### License

Lauren English is a proprietary project owned by Kamil Król — KP_Code. The public source may be reviewed as portfolio work and run locally for private, non-commercial evaluation. Copying, redistribution, public deployment, derivative use, or commercial use requires prior written permission.

Full terms, with the Polish version prevailing, are available in [LICENSE.md](LICENSE.md).

### Attributions

- Literata is included under the SIL Open Font License 1.1; the license text is available in [assets/fonts/OFL-Literata.txt](assets/fonts/OFL-Literata.txt).
- Inline SVGs are sourced from Font Awesome Free v7.3.1. Original license comments are preserved next to the icons in accordance with the [Font Awesome Free terms](https://fontawesome.com/license/free).
