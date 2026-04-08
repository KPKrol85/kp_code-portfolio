# Outland Gear

## PL

### Przegląd projektu
OutlandGear to statyczny, wielostronicowy front-end sklepu demonstracyjnego zbudowany w HTML, CSS i Vanilla JavaScript. Repozytorium zawiera komplet stron publicznych, wspólne partiale layoutu, modułowy system stylów i skryptowy pipeline budujący produkcyjny output do katalogu `dist/`.

Zakres wdrożony w repo obejmuje m.in. stronę główną, katalog produktów, kartę produktu, koszyk, checkout, kontakt, FAQ, strony prawne oraz dodatkową stronę z kompletami podróżnymi.

### Kluczowe funkcje
- Wielostronicowa struktura oparta o statyczne pliki HTML i współdzielone partiale `header` / `footer`.
- Dynamiczny katalog produktów renderowany z `data/products.json`, z filtrowaniem, sortowaniem, paginacją typu "load more" i obsługą parametrów URL.
- Dynamiczna karta produktu oparta o parametr `slug`, z renderowaniem galerii, specyfikacji, sekcji produktów powiązanych oraz aktualizacją metadanych strony.
- Koszyk oparty o `localStorage`, z aktualizacją ilości, usuwaniem pozycji i przeliczeniem podsumowania zamówienia.
- Formularze kontaktu, newslettera i checkoutu z walidacją po stronie klienta oraz komunikatami statusu.
- FAQ w formie akordeonu oraz modal informacyjny uruchamiany z poziomu wspólnej stopki.
- Build produkcyjny generujący `dist/`, minifikujący CSS i JS, inline’ujący partiale oraz generujący `robots.txt` i `sitemap.xml` ze wspólnej konfiguracji SEO.
- Manifest aplikacji webowej z ikonami, shortcutami i screenshotami.
- Automatyczny audit dostępności renderowanych stron oparty o Playwright i `@axe-core/playwright`.

### Stack technologiczny
Runtime:
- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- JSON jako lokalne źródło danych

Build i QA:
- Node.js
- PostCSS
- `postcss-import`
- `cssnano`
- `esbuild`
- `sharp`
- Playwright
- `@axe-core/playwright`

### Struktura projektu
```text
.
├── assets/                 # favicony, logo, obrazy źródłowe i zoptymalizowane, sprite SVG, screenshots, shortcuty
├── css/
│   ├── components/         # współdzielone komponenty UI
│   ├── pages/              # style specyficzne dla widoków
│   ├── base.css            # reset i baza typografii / focus states
│   ├── layout.css          # layout współdzielony
│   ├── tokens.css          # tokeny projektu
│   └── main.css            # główny punkt wejścia stylów
├── data/                   # dane produktów
├── dist/                   # generowany build produkcyjny
├── js/
│   ├── modules/            # moduły funkcjonalne aplikacji
│   ├── app.js              # główny bootstrap front-endu
│   ├── config.js           # współdzielona konfiguracja
│   └── utils.js            # helpery ogólne
├── partials/               # współdzielony header i footer
├── scripts/                # build, preview, SEO generation, image optimization
├── tests/a11y/            # testy dostępności renderowanych stron
├── *.html                  # strony źródłowe
├── package.json
├── playwright.config.js
├── postcss.config.js
├── robots.txt
└── sitemap.xml
```

### Instalacja i konfiguracja
```bash
npm install
```

### Development lokalny
Podstawowe komendy:

```bash
npm run build:preview
```

Buduje projekt i uruchamia lokalny podgląd katalogu `dist/` pod `http://127.0.0.1:4173`.

Tryb watch dla assetów produkcyjnych:

```bash
npm run watch:css
npm run watch:js
```

Dostępne są również komendy pomocnicze:

```bash
npm run clean:dist
npm run build:prepare
npm run build:images
npm run build:seo
npm run images:optimize
```

### Build produkcyjny
```bash
npm run build
```

Build:
- czyści i odtwarza katalog `dist/`
- minifikuje CSS z `css/main.css` do `dist/css/main.min.css`
- bundluje i minifikuje `js/app.js` do `dist/js/app.min.js`
- kopiuje `assets/` i `data/`
- inline’uje partiale `partials/header.html` i `partials/footer.html` do stron HTML w `dist/`
- generuje `robots.txt` i `sitemap.xml` z jednej konfiguracji SEO

### Dostępność
Repo zawiera wdrożone elementy dostępności widoczne w kodzie:
- skip link do głównej treści
- widoczne stany `:focus-visible`
- etykiety formularzy, komunikaty błędów i statusy `aria-live`
- `aria-current` dla aktywnej nawigacji
- `aria-expanded`, `aria-controls` i focus management dla menu mobilnego, wyszukiwarki i dropdownów
- akordeon FAQ oparty o przyciski i regiony
- dialog modalny z `role="dialog"` i `aria-modal="true"`
- obsługę `prefers-reduced-motion`
- testy renderowanej dostępności uruchamiane komendą:

```bash
npm run qa:a11y
```

### SEO
W repo wdrożono:
- `meta description`
- `canonical`
- Open Graph i Twitter Card metadata
- `robots.txt`
- `sitemap.xml`
- JSON-LD na wybranych stronach (`Organization`, `WebPage`, `CollectionPage`, `Product`, `ContactPage`, `FAQPage`)
- build-time generowanie `robots.txt` i `sitemap.xml` z jednej konfiguracji URL

Dodatkowo karta produktu aktualizuje metadane i dane strukturalne dynamicznie na podstawie ładowanego produktu.

### Wydajność
W repo widoczne są następujące rozwiązania:
- minifikacja CSS i JS w buildzie produkcyjnym
- bundling JS przez `esbuild`
- pipeline optymalizacji obrazów przez `sharp`
- rozdzielenie obrazów źródłowych (`assets/img-src/`) i wynikowych (`assets/img/`)
- wykorzystanie formatów `AVIF`, `WebP`, `PNG`, `JPG`, `SVG`
- obrazy responsywne przez `picture`, `srcset` i `sizes`
- jawne `width` / `height` dla obrazów
- `loading="lazy"` i `decoding="async"` dla wybranych obrazów renderowanych statycznie i dynamicznie
- lekka architektura bez frameworka UI

### Utrzymanie projektu
Najważniejsze miejsca dla dalszego rozwoju:
- `js/app.js` uruchamia moduły strony i bootstrap wspólnych partiali
- `js/modules/` zawiera logikę domenową: katalog, produkt, koszyk, checkout, kontakt, FAQ, nawigację, newsletter i UI helpers
- `css/tokens.css`, `css/layout.css` i `css/components/` stanowią współdzieloną warstwę stylów
- `css/pages/` zawiera warstwę stylów specyficznych dla widoków
- `scripts/build-dist.mjs` kontroluje generowanie builda produkcyjnego
- `scripts/seo-config.mjs` jest źródłem prawdy dla hosta i listy stron indexowalnych
- `tests/a11y/a11y.spec.js` obejmuje kluczowe renderowane strony testami axe

### Licencja
MIT. Licencja jest zadeklarowana w `package.json`.

## EN

### Project Overview
OutlandGear is a static multi-page storefront front-end built with HTML, CSS, and Vanilla JavaScript. The repository includes the full set of public pages, shared layout partials, a modular styling system, and a script-based pipeline that generates a production build into `dist/`.

The implemented scope includes a homepage, product listing, product detail page, cart, checkout, contact page, FAQ, legal pages, and an additional travel kits page.

### Key Features
- Multi-page structure based on static HTML files and shared `header` / `footer` partials.
- Dynamic product listing rendered from `data/products.json`, with filtering, sorting, load-more pagination, and URL parameter handling.
- Dynamic product page driven by the `slug` query parameter, including gallery rendering, specifications, related products, and page metadata updates.
- `localStorage`-based cart with quantity updates, item removal, and order summary recalculation.
- Contact, newsletter, and checkout forms with client-side validation and status messaging.
- FAQ accordion and informational modal launched from the shared footer.
- Production build pipeline that generates `dist/`, minifies CSS and JS, inlines partials, and generates `robots.txt` and `sitemap.xml` from shared SEO configuration.
- Web app manifest with icons, shortcuts, and screenshots.
- Automated rendered accessibility audit powered by Playwright and `@axe-core/playwright`.

### Tech Stack
Runtime:
- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- JSON as a local data source

Build and QA:
- Node.js
- PostCSS
- `postcss-import`
- `cssnano`
- `esbuild`
- `sharp`
- Playwright
- `@axe-core/playwright`

### Project Structure
```text
.
├── assets/                 # favicons, logo, source and optimized images, SVG sprite, screenshots, shortcuts
├── css/
│   ├── components/         # shared UI components
│   ├── pages/              # page-specific styles
│   ├── base.css            # reset and base typography / focus states
│   ├── layout.css          # shared layout layer
│   ├── tokens.css          # design tokens
│   └── main.css            # main stylesheet entry point
├── data/                   # product data
├── dist/                   # generated production build
├── js/
│   ├── modules/            # application feature modules
│   ├── app.js              # main frontend bootstrap
│   ├── config.js           # shared configuration
│   └── utils.js            # general helpers
├── partials/               # shared header and footer
├── scripts/                # build, preview, SEO generation, image optimization
├── tests/a11y/            # rendered accessibility tests
├── *.html                  # source pages
├── package.json
├── playwright.config.js
├── postcss.config.js
├── robots.txt
└── sitemap.xml
```

### Setup and Installation
```bash
npm install
```

### Local Development
Primary command:

```bash
npm run build:preview
```

This builds the project and starts a local preview server for `dist/` at `http://127.0.0.1:4173`.

Watch mode for production assets:

```bash
npm run watch:css
npm run watch:js
```

Additional helper commands:

```bash
npm run clean:dist
npm run build:prepare
npm run build:images
npm run build:seo
npm run images:optimize
```

### Production Build
```bash
npm run build
```

The build process:
- recreates the `dist/` directory
- minifies CSS from `css/main.css` into `dist/css/main.min.css`
- bundles and minifies `js/app.js` into `dist/js/app.min.js`
- copies `assets/` and `data/`
- inlines `partials/header.html` and `partials/footer.html` into HTML files in `dist/`
- generates `robots.txt` and `sitemap.xml` from a single SEO configuration

### Accessibility
The repository includes visible accessibility implementation in source code:
- skip link to main content
- visible `:focus-visible` states
- form labels, inline error messaging, and `aria-live` status regions
- `aria-current` for active navigation links
- `aria-expanded`, `aria-controls`, and focus management for the mobile menu, search panel, and dropdowns
- FAQ accordion built with buttons and labelled regions
- modal dialog with `role="dialog"` and `aria-modal="true"`
- `prefers-reduced-motion` support
- rendered accessibility tests available via:

```bash
npm run qa:a11y
```

### SEO
The repository implements:
- `meta description`
- `canonical`
- Open Graph and Twitter Card metadata
- `robots.txt`
- `sitemap.xml`
- JSON-LD on selected pages (`Organization`, `WebPage`, `CollectionPage`, `Product`, `ContactPage`, `FAQPage`)
- build-time generation of `robots.txt` and `sitemap.xml` from a shared URL policy

In addition, the product page updates metadata and structured data dynamically based on the loaded product.

### Performance
The repository contains explicit performance-related implementation:
- CSS and JS minification in the production build
- JS bundling via `esbuild`
- image optimization pipeline using `sharp`
- separation between source images (`assets/img-src/`) and generated assets (`assets/img/`)
- use of `AVIF`, `WebP`, `PNG`, `JPG`, and `SVG`
- responsive images via `picture`, `srcset`, and `sizes`
- explicit `width` / `height` on images
- `loading="lazy"` and `decoding="async"` for selected static and dynamically rendered images
- lightweight architecture without a UI framework

### Project Maintenance
Key locations for future maintenance:
- `js/app.js` bootstraps page modules and shared partial loading
- `js/modules/` contains domain logic for catalog, product, cart, checkout, contact, FAQ, navigation, newsletter, and UI helpers
- `css/tokens.css`, `css/layout.css`, and `css/components/` define the shared styling layer
- `css/pages/` contains page-specific styles
- `scripts/build-dist.mjs` controls production build generation
- `scripts/seo-config.mjs` is the source of truth for origin and indexable URLs
- `tests/a11y/a11y.spec.js` covers key rendered pages with axe-based checks

### License
MIT. The license is declared in `package.json`.
