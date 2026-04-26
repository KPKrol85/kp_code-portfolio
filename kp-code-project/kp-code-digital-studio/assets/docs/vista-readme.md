# Vista

## PL

### Przegląd projektu

Vista to wielostronicowy projekt front-end dla serwisu hotelowo-podróżniczego, zbudowany w czystym HTML, CSS i JavaScript. Repozytorium zawiera komplet stron publicznych (m.in. strona główna, pokoje, oferty, galeria, kontakt oraz strony prawne), warstwę PWA, pipeline budowania assetów oraz przygotowanie do publikacji statycznej.

### Kluczowe funkcje

- Wielostronicowa nawigacja z aktywnym stanem linków i mobilnym menu.
- Przełączanie motywu (light/dark/auto) z zapisem preferencji w `localStorage`.
- Filtrowanie pokoi i galerii po kategoriach.
- Lightbox galerii z obsługą klawiatury, nawigacją poprzedni/następny i trybem fullscreen.
- Formularz kontaktowo-rezerwacyjny z walidacją po stronie klienta (w tym walidacja dat, liczby gości, telefonu i zgód) oraz obsługą Netlify Forms.
- Osadzenie mapy z fallbackiem statycznym.
- Dynamiczne podmiany JSON-LD na podstawie plików z `assets/seo/`.
- Service Worker z cache statycznym i fallbackiem `offline.html`.

### Stack technologiczny

- Runtime:
  - HTML5
  - CSS3
  - JavaScript (ES modules)
- Build i tooling:
  - Node.js + npm
  - PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
  - esbuild (bundling i minifikacja JS)
  - sharp (optymalizacja obrazów)
  - Playwright + axe-core (testy dostępności)
- Hosting/deploy:
  - Konfiguracja Netlify (`netlify/_headers`, `netlify/_redirects`)

### Struktura projektu

```text
pr-01-vista/
├── assets/
│   ├── fonts/
│   ├── img/                 # źródła i obrazy zoptymalizowane
│   └── seo/                 # pliki JSON-LD
├── css/
│   ├── modules/             # warstwy stylów (tokens/base/layout/components/...)
│   ├── style.css            # entry CSS (importy modułów)
│   └── style.min.css        # output produkcyjny
├── js/
│   ├── features/            # moduły funkcjonalne UI
│   ├── script.js            # entry JS
│   ├── script.min.js        # output produkcyjny
│   └── theme-init.js        # wczesna inicjalizacja motywu
├── pwa/
│   └── service-worker.js
├── scripts/                 # skrypty build/test/quality checks
├── netlify/
│   ├── _headers
│   └── _redirects
├── *.html                   # publiczne strony serwisu
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── package.json
```

### Instalacja i konfiguracja

```bash
npm install
```

### Development lokalny

Dostępne są osobne watchery dla CSS i JS:

```bash
npm run watch:css
npm run watch:js
```

Dodatkowe narzędzia developerskie:

```bash
npm run img:watch
npm run check:links
npm run test:a11y
```

### Build produkcyjny

Pełny build produkcyjny (minifikacja CSS/JS oraz przygotowanie `dist/`):

```bash
npm run build
```

Dodatkowe komendy:

```bash
npm run build:css
npm run build:js
npm run build:dist
npm run dist:clean
npm run img:opt
npm run img:clean
```

### Deployment

Repozytorium zawiera konfigurację pod wdrożenie statyczne na Netlify:

- reguły nagłówków bezpieczeństwa i cache (`netlify/_headers`),
- przekierowanie `/index.html -> /` oraz obsługa 404 (`netlify/_redirects`),
- generowanie gotowego artefaktu wdrożeniowego w katalogu `dist/` przez `scripts/build-dist.mjs`.

### Dostępność

W projekcie zaimplementowano m.in.:

- skip link do głównej treści,
- semantyczne regiony i etykiety ARIA w nawigacji, formularzu, zakładkach i lightboxie,
- obsługę klawiatury (menu mobilne, tabs, filtry, lightbox),
- komunikowanie błędów formularza przez `aria-invalid`,
- automatyczne scenariusze testowe dostępności (`scripts/a11y-axe.mjs`).

### SEO

Wdrożone elementy SEO obejmują:

- metadane per strona (`title`, `description`, `canonical`, Open Graph, Twitter),
- `robots.txt` i `sitemap.xml`,
- dane strukturalne JSON-LD (fallback inline + dynamiczne ładowanie z plików `assets/seo/*.json`),
- manifest PWA (`site.webmanifest`).

### Wydajność

W repozytorium widoczne są następujące rozwiązania:

- responsywne obrazy (`srcset`, `sizes`) z wariantami AVIF/WebP/JPG,
- preload głównej grafiki hero,
- lazy loading dla części zasobów (np. mapy i wybranych obrazów),
- pipeline minifikacji CSS/JS,
- skrypty optymalizacji obrazów,
- cache’owanie zasobów statycznych i fallback offline w Service Workerze.

### Utrzymanie projektu

- Główna orkiestracja front-endu znajduje się w `js/script.js`.
- Funkcjonalności UI są rozdzielone na moduły w `js/features/`.
- Warstwa stylów jest podzielona modułowo przez `css/modules/` i spinana przez `css/style.css`.
- Pipeline build i walidacje jakości znajdują się w `scripts/`.
- Reguły deployu i nagłówki bezpieczeństwa są utrzymywane w `netlify/`.

### Licencja

Projekt jest udostępniony na licencji MIT (plik `LICENSE`).

## EN

### Project Overview

Vista is a multi-page front-end project for a hospitality/travel website, built with plain HTML, CSS, and JavaScript. The repository includes the full set of public pages (including home, rooms, offers, gallery, contact, and legal pages), a PWA layer, an asset build pipeline, and static deployment preparation.

### Key Features

- Multi-page navigation with active link state and mobile menu.
- Theme switching (light/dark/auto) with preference persistence in `localStorage`.
- Category-based filtering for rooms and gallery views.
- Gallery lightbox with keyboard support, previous/next navigation, and fullscreen mode.
- Contact/booking form with client-side validation (including dates, guest count, phone, and consent) plus Netlify Forms handling.
- Embedded map with static fallback.
- Dynamic JSON-LD replacement based on files from `assets/seo/`.
- Service Worker with static caching and `offline.html` fallback.

### Tech Stack

- Runtime:
  - HTML5
  - CSS3
  - JavaScript (ES modules)
- Build and tooling:
  - Node.js + npm
  - PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
  - esbuild (JS bundling and minification)
  - sharp (image optimization)
  - Playwright + axe-core (accessibility testing)
- Hosting/deployment:
  - Netlify configuration (`netlify/_headers`, `netlify/_redirects`)

### Project Structure

```text
pr-01-vista/
├── assets/
│   ├── fonts/
│   ├── img/                 # source and optimized images
│   └── seo/                 # JSON-LD files
├── css/
│   ├── modules/             # style layers (tokens/base/layout/components/...)
│   ├── style.css            # CSS entry file (module imports)
│   └── style.min.css        # production output
├── js/
│   ├── features/            # UI feature modules
│   ├── script.js            # JS entry file
│   ├── script.min.js        # production output
│   └── theme-init.js        # early theme initialization
├── pwa/
│   └── service-worker.js
├── scripts/                 # build/test/quality-check scripts
├── netlify/
│   ├── _headers
│   └── _redirects
├── *.html                   # public website pages
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── package.json
```

### Setup and Installation

```bash
npm install
```

### Local Development

Dedicated watchers are available for CSS and JS:

```bash
npm run watch:css
npm run watch:js
```

Additional development utilities:

```bash
npm run img:watch
npm run check:links
npm run test:a11y
```

### Production Build

Full production build (CSS/JS minification and `dist/` generation):

```bash
npm run build
```

Additional commands:

```bash
npm run build:css
npm run build:js
npm run build:dist
npm run dist:clean
npm run img:opt
npm run img:clean
```

### Deployment

The repository includes configuration for static deployment on Netlify:

- security and caching header rules (`netlify/_headers`),
- `/index.html -> /` redirect and 404 handling (`netlify/_redirects`),
- generation of a deployable artifact in `dist/` via `scripts/build-dist.mjs`.

### Accessibility

The implementation includes:

- a skip link to main content,
- semantic regions and ARIA labeling in navigation, forms, tabs, and lightbox,
- keyboard interaction support (mobile menu, tabs, filters, lightbox),
- form error signaling through `aria-invalid`,
- automated accessibility test scenarios (`scripts/a11y-axe.mjs`).

### SEO

Implemented SEO surface includes:

- per-page metadata (`title`, `description`, `canonical`, Open Graph, Twitter),
- `robots.txt` and `sitemap.xml`,
- structured data via JSON-LD (inline fallback + dynamic loading from `assets/seo/*.json`),
- PWA manifest (`site.webmanifest`).

### Performance

The repository includes the following explicit optimizations:

- responsive images (`srcset`, `sizes`) with AVIF/WebP/JPG variants,
- preload of the primary hero image,
- lazy loading for selected resources (for example map and selected images),
- CSS/JS minification pipeline,
- image optimization scripts,
- static asset caching and offline fallback in the Service Worker.

### Project Maintenance

- Main front-end bootstrapping lives in `js/script.js`.
- UI behavior is split into dedicated modules in `js/features/`.
- Styling is modularized in `css/modules/` and composed through `css/style.css`.
- Build and quality scripts are maintained in `scripts/`.
- Deployment rules and security headers are maintained in `netlify/`.

### License

This project is distributed under the MIT License (`LICENSE` file).
