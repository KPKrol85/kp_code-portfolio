# FleetOps

## PL

### Przegląd projektu

FleetOps to statyczna aplikacja demonstracyjna frontendu dla operacji transportowych i flotowych. Repozytorium zawiera landing page, strony informacyjne, ekran logowania demo oraz panel aplikacyjny renderowany po stronie przeglądarki.

Aplikacja działa bez backendu. Dane demo, preferencje użytkownika, stan logowania, filtry, ustawienia list i zmiany rekordów są obsługiwane lokalnie w przeglądarce.

### Kluczowe funkcje

- Routing oparty o hash URL dla stron publicznych, logowania i widoków aplikacyjnych.
- Widoki panelu: przegląd KPI, zlecenia, flota, kierowcy, raporty i ustawienia.
- Dane demo dla zleceń, pojazdów, kierowców, aktywności, alertów i raportów.
- Lokalne dodawanie, edycja i usuwanie zleceń, pojazdów oraz kierowców.
- Filtrowanie, sortowanie, wyszukiwanie i przyrostowe ładowanie list.
- Role demo i blokowanie wybranych akcji na podstawie uprawnień.
- Motyw jasny/ciemny, tryb kompaktowy i reset danych demo.
- Fallback `<noscript>` dla przeglądarek bez JavaScriptu.
- Manifest aplikacji, statyczna strona `404.html` i plik źródłowy `sw.js`.

### Stack technologiczny

Runtime:

- HTML5
- CSS3
- Vanilla JavaScript
- Web Storage API
- Web App Manifest

Tooling:

- Node.js / npm
- PostCSS
- cssnano
- postcss-cli
- terser
- sharp

### Struktura projektu

```text
.
├── index.html              # Główny dokument HTML i punkt wejścia aplikacji
├── 404.html                # Statyczna strona błędu
├── build-dist.js           # Produkcyjny build do dist/
├── optimize-images.js      # Optymalizacja obrazów runtime z assets/img-src/
├── sw.js                   # Plik źródłowy service workera
├── _headers                # Nagłówki dla statycznego hostingu
├── _redirects              # Reguły fallback dla aplikacji statycznej
├── assets/
│   ├── favicon/            # Favicony, manifest i ikony manifestu
│   ├── fonts/              # Lokalne fonty
│   ├── icons/              # Ikony UI
│   ├── img-src/            # Edytowalne źródła obrazów
│   ├── img/                # Zoptymalizowane obrazy runtime
│   ├── logos/              # Logo i assety brandowe
│   ├── og-img/             # Obrazy Open Graph
│   ├── screenshots/        # Screenshoty manifestu
│   └── shortcuts/          # Ikony skrótów manifestu
├── styles/
│   ├── main.css            # Development CSS entrypoint
│   └── src/                # Modularne źródła CSS
├── scripts/                # Routing, stan, dane demo, layouty, widoki i komponenty UI
├── dist/                   # Wygenerowany output produkcyjny
├── package.json            # Skrypty npm i zależności developerskie
└── LICENSE                 # Warunki użycia repozytorium
```

Główna logika aplikacji znajduje się w `scripts/`:

- `scripts/router.js` obsługuje routing hash-based i ochronę widoków `/app`.
- `scripts/main.js` inicjalizuje stan, motyw, status online/offline i routing.
- `scripts/state/store.js` zarządza stanem aplikacji i zapisem do `localStorage`.
- `scripts/data/seed.js` dostarcza dane demonstracyjne.
- `scripts/ui/layoutLanding.js` i `scripts/ui/layoutApp.js` renderują główne układy.
- `scripts/ui/views/` zawiera widoki modułów aplikacyjnych.
- `scripts/ui/components/` zawiera komponenty modal, dropdown, accordion, toast i table.

### Instalacja i konfiguracja

```bash
npm install
```

### Development lokalny

Development preview uruchamia projekt z katalogu źródłowego i ładuje czytelny CSS przez `styles/main.css`.

```bash
npm run preview
```

Domyślny adres lokalny:

```text
http://localhost:8181/
```

### Build produkcyjny

```bash
npm run build
```

Build uruchamia optymalizację obrazów, generuje `dist/`, minifikuje CSS do `dist/styles/main.min.css`, minifikuje aktywne pliki JavaScript z `scripts/` i kopiuje wymagane assety runtime. Katalog `assets/img-src/` nie jest kopiowany do `dist/`.

Preview wygenerowanej produkcji:

```bash
npm run preview:dist
```

Domyślny adres:

```text
http://localhost:8182/
```

### Pipeline obrazów

```bash
npm run optimize:images
```

Pipeline obrazów:

- czyta źródła z `assets/img-src/`;
- generuje zoptymalizowane obrazy runtime do `assets/img/`;
- dla obrazów hero generuje AVIF, WebP i JPG fallback;
- pozostawia favicony, Open Graph, screenshoty, skróty manifestu i SVG bez zmian.

### CSS

Development CSS entrypoint:

```text
styles/main.css
```

Modularne źródła CSS:

```text
styles/src/00-settings.css
styles/src/01-base.css
styles/src/02-layout.css
styles/src/03-components.css
styles/src/04-data.css
styles/src/05-landing.css
styles/src/06-app.css
```

Produkcja używa wygenerowanego pliku:

```text
dist/styles/main.min.css
```

System tokenów CSS:

- `--fs-01` do `--fs-08` definiują skalę font-size;
- `--fw-regular`, `--fw-medium`, `--fw-semibold`, `--fw-bold` definiują font-weight;
- `--lh-tight`, `--lh-snug`, `--lh-normal`, `--lh-relaxed` definiują line-height;
- `--space-0` do `--space-8` definiują rem-based spacing scale;
- bezpieczne użycia `font-size`, `font-weight` i `line-height` w source CSS zostały podpięte pod tokeny.

### Deployment

Repozytorium zawiera konfigurację dla statycznego hostingu:

- `_redirects` obsługuje fallback do `index.html`;
- `_headers` definiuje nagłówki bezpieczeństwa i cache dla assetów;
- `robots.txt` i `sitemap.xml` są obecne w katalogu źródłowym i kopiowane do `dist/`;
- produkcyjny output znajduje się w `dist/`.

### Dostępność

W kodzie widoczne są:

- link pomijania do `#main-content`;
- fallback `<noscript>`;
- role i etykiety ARIA w nawigacji, drawerach, menu, modalach i statusach;
- obsługa `aria-current`, `aria-expanded`, `aria-controls`, `aria-modal`, `aria-live` i `aria-invalid`;
- pułapka fokusu i obsługa Escape w modalach oraz drawerach;
- widoczne style fokusu;
- obsługa `prefers-reduced-motion` w CSS.

### SEO

Repozytorium zawiera:

- meta description i title;
- canonical URL;
- Open Graph i Twitter Card metadata;
- favicony i Web App Manifest;
- `robots.txt`;
- `sitemap.xml`;
- statyczną stronę `404.html`.

### Wydajność

W kodzie widoczne są:

- preload lokalnego fontu Inter WOFF2;
- hero image przez `picture` z AVIF, WebP i JPG fallback;
- jawne wymiary, `fetchpriority="high"` i `decoding="async"` dla obrazu hero;
- produkcyjny CSS bundle w `dist/styles/main.min.css`;
- minifikacja aktywnych skryptów JavaScript do `dist/scripts/`;
- optymalizacja obrazów przez `sharp`;
- reguły cache dla `/assets/*` w `_headers`.

### Utrzymanie projektu

- `styles/src/` jest źródłem prawdy dla CSS.
- `styles/main.css` jest development entrypointem.
- `dist/` jest generowanym outputem i nie powinien być edytowany ręcznie.
- `assets/img-src/` zawiera edytowalne źródła obrazów.
- `assets/img/` zawiera zoptymalizowane obrazy runtime.
- `assets/logos/` zawiera logo, a `assets/icons/` zawiera ikony UI.
- `styles/src/00-settings.css` zawiera tokeny kolorów, typografii, spacingu, promieni, cieni i motywów.
- `npm audit` zwraca obecnie `0 vulnerabilities`.

### Licencja

Repozytorium zawiera plik `LICENSE` z deklaracją `UNLICENSED`. Kod jest udostępniony do celów portfolio, referencji i przeglądu kodu zgodnie z treścią pliku licencji.

## EN

### Project Overview

FleetOps is a static frontend demo application for transport and fleet operations. The repository includes a landing page, informational pages, a demo login screen, and a browser-rendered application dashboard.

The application runs without a backend. Demo data, user preferences, authentication state, filters, list settings, and record changes are handled locally in the browser.

### Key Features

- Hash-based URL routing for public pages, login, and application views.
- Dashboard views: KPI overview, orders, fleet, drivers, reports, and settings.
- Demo data for orders, vehicles, drivers, activity, alerts, and reports.
- Local create, edit, and delete flows for orders, vehicles, and drivers.
- Filtering, sorting, search, and incremental list loading.
- Demo roles and action blocking based on permissions.
- Light/dark theme, compact mode, and demo data reset.
- `<noscript>` fallback for browsers without JavaScript.
- Application manifest, static `404.html` page, and `sw.js` source file.

### Tech Stack

Runtime:

- HTML5
- CSS3
- Vanilla JavaScript
- Web Storage API
- Web App Manifest

Tooling:

- Node.js / npm
- PostCSS
- cssnano
- postcss-cli
- terser
- sharp

### Project Structure

```text
.
├── index.html              # Main HTML document and application entry point
├── 404.html                # Static error page
├── build-dist.js           # Production build into dist/
├── optimize-images.js      # Runtime image optimization from assets/img-src/
├── sw.js                   # Service worker source file
├── _headers                # Headers for static hosting
├── _redirects              # Static-app fallback rules
├── assets/
│   ├── favicon/            # Favicons, manifest, and manifest icons
│   ├── fonts/              # Local fonts
│   ├── icons/              # UI icons
│   ├── img-src/            # Editable image sources
│   ├── img/                # Optimized runtime images
│   ├── logos/              # Logo and brand assets
│   ├── og-img/             # Open Graph images
│   ├── screenshots/        # Manifest screenshots
│   └── shortcuts/          # Manifest shortcut icons
├── styles/
│   ├── main.css            # Development CSS entrypoint
│   └── src/                # Modular CSS sources
├── scripts/                # Routing, state, demo data, layouts, views, and UI components
├── dist/                   # Generated production output
├── package.json            # npm scripts and development dependencies
└── LICENSE                 # Repository usage terms
```

The main application logic is located in `scripts/`:

- `scripts/router.js` handles hash-based routing and `/app` view protection.
- `scripts/main.js` initializes state, theme, online/offline status, and routing.
- `scripts/state/store.js` manages application state and `localStorage` persistence.
- `scripts/data/seed.js` provides demo data.
- `scripts/ui/layoutLanding.js` and `scripts/ui/layoutApp.js` render the main layouts.
- `scripts/ui/views/` contains application module views.
- `scripts/ui/components/` contains modal, dropdown, accordion, toast, and table components.

### Setup and Installation

```bash
npm install
```

### Local Development

The development preview serves the source project and loads readable CSS through `styles/main.css`.

```bash
npm run preview
```

Default local URL:

```text
http://localhost:8181/
```

### Production Build

```bash
npm run build
```

The build runs image optimization, generates `dist/`, minifies CSS into `dist/styles/main.min.css`, minifies the active JavaScript files from `scripts/`, and copies required runtime assets. The `assets/img-src/` directory is excluded from `dist/`.

Preview the generated production output:

```bash
npm run preview:dist
```

Default URL:

```text
http://localhost:8182/
```

### Image Pipeline

```bash
npm run optimize:images
```

The image pipeline:

- reads source images from `assets/img-src/`;
- generates optimized runtime images into `assets/img/`;
- generates AVIF, WebP, and JPG fallback variants for hero images;
- leaves favicons, Open Graph images, screenshots, manifest shortcuts, and SVG files unchanged.

### CSS

Development CSS entrypoint:

```text
styles/main.css
```

Modular CSS sources:

```text
styles/src/00-settings.css
styles/src/01-base.css
styles/src/02-layout.css
styles/src/03-components.css
styles/src/04-data.css
styles/src/05-landing.css
styles/src/06-app.css
```

Production uses the generated file:

```text
dist/styles/main.min.css
```

CSS token system:

- `--fs-01` through `--fs-08` define the font-size scale;
- `--fw-regular`, `--fw-medium`, `--fw-semibold`, and `--fw-bold` define font weights;
- `--lh-tight`, `--lh-snug`, `--lh-normal`, and `--lh-relaxed` define line heights;
- `--space-0` through `--space-8` define the rem-based spacing scale;
- safe `font-size`, `font-weight`, and `line-height` usages in source CSS are wired to tokens.

### Deployment

The repository includes static hosting configuration:

- `_redirects` handles fallback to `index.html`;
- `_headers` defines security headers and asset caching;
- `robots.txt` and `sitemap.xml` are present in source and copied into `dist/`;
- production output is generated into `dist/`.

### Accessibility

The code includes:

- skip link to `#main-content`;
- `<noscript>` fallback;
- ARIA roles and labels in navigation, drawers, menus, modals, and status elements;
- usage of `aria-current`, `aria-expanded`, `aria-controls`, `aria-modal`, `aria-live`, and `aria-invalid`;
- focus trapping and Escape-key handling in modals and drawers;
- visible focus states;
- `prefers-reduced-motion` handling in CSS.

### SEO

The repository includes:

- meta description and title;
- canonical URL;
- Open Graph and Twitter Card metadata;
- favicons and Web App Manifest;
- `robots.txt`;
- `sitemap.xml`;
- static `404.html` page.

### Performance

The code includes:

- preload for the local Inter WOFF2 font;
- hero image delivery through `picture` with AVIF, WebP, and JPG fallback;
- explicit dimensions, `fetchpriority="high"`, and `decoding="async"` for the hero image;
- production CSS bundle in `dist/styles/main.min.css`;
- active JavaScript minification into `dist/scripts/`;
- image optimization through `sharp`;
- cache rules for `/assets/*` in `_headers`.

### Project Maintenance

- `styles/src/` is the source of truth for CSS.
- `styles/main.css` is the development entrypoint.
- `dist/` is generated output and should not be edited manually.
- `assets/img-src/` contains editable image sources.
- `assets/img/` contains optimized runtime images.
- `assets/logos/` contains logos, while `assets/icons/` contains UI icons.
- `styles/src/00-settings.css` contains color, typography, spacing, radius, shadow, and theme tokens.
- `npm audit` currently reports `0 vulnerabilities`.

### License

The repository includes a `LICENSE` file declaring `UNLICENSED` usage terms. The code is provided for portfolio, reference, and code review purposes according to the license file.
