# Ambre

## PL

### Przegląd projektu

Ambre to statyczny, wielostronicowy projekt front-end dla restauracji fine dining. Repozytorium zawiera publiczne strony serwisu (`index.html`, `menu.html`, `galeria.html`), strony prawne (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`) oraz dedykowane widoki `404.html` i `offline.html`.

### Kluczowe funkcje

- Wielostronicowa nawigacja z sekcjami strony głównej oraz osobnymi podstronami menu i galerii.
- Interaktywne moduły UI w Vanilla JS: menu mobilne, scrollspy, sticky header, przełącznik motywu, płynne przewijanie, lightbox galerii, filtry zakładek i „load more”.
- Formularz rezerwacji z walidacją po stronie klienta (telefon, zgoda, honeypot) oraz wysyłką przez `fetch` z fallbackiem do natywnego submitu.
- PWA: `manifest.webmanifest`, rejestracja service workera, ekran offline i cache strategii dla HTML/CSS/JS/obrazów.
- Zestaw stron i zasobów SEO: canonical, Open Graph, Twitter Cards, JSON-LD, `robots.txt`, `sitemap.xml`.

### Stack technologiczny

**Runtime**

- HTML5
- CSS3 (architektura oparta o importy: base/layout/components/pages)
- Vanilla JavaScript (moduły ES)
- Service Worker + Web App Manifest

**Tooling / QA**

- npm
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
- esbuild
- ESLint
- Stylelint
- html-validate
- Playwright + `@axe-core/playwright`
- Lighthouse CI (`@lhci/cli`)
- Sharp (optymalizacja obrazów)

### Struktura projektu

```text
.
├── assets/                 # obrazy, fonty, ikony, warianty zoptymalizowane
├── css/                    # style źródłowe i bundle style.min.css
│   ├── base/
│   ├── layout/
│   ├── components/
│   └── pages/
├── js/
│   ├── modules/            # moduły funkcjonalne UI
│   ├── script.js           # entry point aplikacji
│   ├── script.min.js       # bundle produkcyjny
│   ├── sw-register.js      # rejestracja SW
│   └── pwa-install.js      # obsługa instalacji PWA
├── scripts/                # skrypty build/QA/SEO/a11y/CSP/obrazy
├── doc/                    # mapa architektury i ustawienia skryptów
├── *.html                  # strony publiczne
├── sw.js                   # service worker
├── manifest.webmanifest
├── _headers / _redirects   # konfiguracja hostingu statycznego
└── package.json
```

### Instalacja i konfiguracja

```bash
npm install
```

### Development lokalny

Dostępne skrypty deweloperskie:

```bash
npm run watch:css
npm run watch:js
npm run qa
```

### Build produkcyjny

```bash
npm run build
npm run build:dist
```

`build:dist` generuje katalog `dist/` z gotowymi plikami HTML, assetami, plikami statycznymi i zbudowanymi bundle’ami CSS/JS.

### Deployment

Repozytorium zawiera pliki `_headers` i `_redirects`, a także skrypt `check:server:prod`, co wskazuje na workflow wdrożenia dla hostingu statycznego z regułami nagłówków i przekierowań.

### Dostępność

Zaobserwowane implementacje dostępności:

- skip link do głównej treści,
- semantyczne struktury (`header`, `nav`, `main`, `section`, `footer`),
- atrybuty ARIA dla nawigacji, FAQ, lightboxa i komunikatów formularza,
- obsługa klawiatury w komponentach interaktywnych,
- automatyczne testy a11y (`npm run qa:a11y`).

### SEO

Zaobserwowane elementy SEO:

- meta description, canonical, Open Graph, Twitter Cards,
- JSON-LD na stronach głównych serwisu,
- `robots.txt` i `sitemap.xml`,
- dedykowany skrypt walidacji SEO (`npm run qa:seo`).

### Wydajność

Zaobserwowane implementacje wydajnościowe:

- pipeline minifikacji CSS i bundlowania/minifikacji JS,
- zoptymalizowane formaty obrazów (`webp`, `avif`) oraz skrypty ich generowania i weryfikacji,
- preload fontów,
- cache aplikacji przez service workera,
- audyty Lighthouse CI (`npm run qa:lighthouse`).

### Utrzymanie projektu

- Główny entry point front-endu: `js/script.js`; logika podzielona na moduły w `js/modules/`.
- Kompozycja stylów oparta o `css/style.css` i importy warstwowe (`base`, `layout`, `components`, `pages`).
- Skrypty operacyjne (QA, SEO, a11y, obrazki, CSP, build `dist`) znajdują się w `scripts/`.
- Dokumentacja mapująca hooki HTML do modułów JS jest utrzymywana w `doc/ARCHITECTURE_MAP.md`.

### Licencja

Projekt jest oznaczony jako `UNLICENSED`.

## EN

### Project Overview

Ambre is a static multi-page front-end project for a fine dining restaurant website. The repository includes public pages (`index.html`, `menu.html`, `galeria.html`), legal pages (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`), and dedicated `404.html` and `offline.html` views.

### Key Features

- Multi-page navigation with homepage sections and dedicated menu/gallery pages.
- Interactive Vanilla JS UI modules: mobile navigation, scrollspy, sticky header, theme switcher, smooth scrolling, gallery lightbox, tab filters, and load-more behavior.
- Reservation form with client-side validation (phone, consent, honeypot) and `fetch` submission with native submit fallback.
- PWA surface: `manifest.webmanifest`, service worker registration, offline screen, and caching strategies for HTML/CSS/JS/images.
- SEO file and metadata set: canonical, Open Graph, Twitter Cards, JSON-LD, `robots.txt`, and `sitemap.xml`.

### Tech Stack

**Runtime**

- HTML5
- CSS3 (import-based architecture: base/layout/components/pages)
- Vanilla JavaScript (ES modules)
- Service Worker + Web App Manifest

**Tooling / QA**

- npm
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
- esbuild
- ESLint
- Stylelint
- html-validate
- Playwright + `@axe-core/playwright`
- Lighthouse CI (`@lhci/cli`)
- Sharp (image optimization)

### Project Structure

```text
.
├── assets/                 # images, fonts, icons, optimized variants
├── css/                    # source styles and style.min.css bundle
│   ├── base/
│   ├── layout/
│   ├── components/
│   └── pages/
├── js/
│   ├── modules/            # UI feature modules
│   ├── script.js           # application entry point
│   ├── script.min.js       # production bundle
│   ├── sw-register.js      # SW registration
│   └── pwa-install.js      # PWA install handling
├── scripts/                # build/QA/SEO/a11y/CSP/image scripts
├── doc/                    # architecture map and script settings
├── *.html                  # public pages
├── sw.js                   # service worker
├── manifest.webmanifest
├── _headers / _redirects   # static hosting configuration
└── package.json
```

### Setup and Installation

```bash
npm install
```

### Local Development

Available development scripts:

```bash
npm run watch:css
npm run watch:js
npm run qa
```

### Production Build

```bash
npm run build
npm run build:dist
```

`build:dist` creates a `dist/` directory with production HTML files, assets, static files, and built CSS/JS bundles.

### Deployment

The repository includes `_headers` and `_redirects` files, plus a `check:server:prod` script, indicating a static-hosting deployment workflow with explicit headers and redirect rules.

### Accessibility

Implemented accessibility patterns include:

- a skip link to main content,
- semantic page structure (`header`, `nav`, `main`, `section`, `footer`),
- ARIA usage for navigation, FAQ, lightbox, and form status messages,
- keyboard support in interactive components,
- automated a11y checks (`npm run qa:a11y`).

### SEO

Implemented SEO surface includes:

- meta description, canonical, Open Graph, and Twitter Cards,
- JSON-LD on core site pages,
- `robots.txt` and `sitemap.xml`,
- dedicated SEO validation script (`npm run qa:seo`).

### Performance

Verified performance-oriented implementation includes:

- CSS minification and JS bundling/minification pipeline,
- optimized image formats (`webp`, `avif`) with generation and verification scripts,
- font preloading,
- app-shell/runtime caching via service worker,
- Lighthouse CI audits (`npm run qa:lighthouse`).

### Project Maintenance

- Main front-end entry point: `js/script.js`; feature logic is split across `js/modules/`.
- Style composition is controlled by `css/style.css` and layered imports (`base`, `layout`, `components`, `pages`).
- Operational scripts (QA, SEO, a11y, images, CSP, `dist` build) are located in `scripts/`.
- HTML-to-JS hook mapping documentation is maintained in `doc/ARCHITECTURE_MAP.md`.

### License

This project is declared as `UNLICENSED`.
