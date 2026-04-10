# Outland Gear

## PL

### Przegląd projektu

Outland Gear to statyczny, wielostronicowy front-end sklepu demonstracyjnego zbudowany w HTML, CSS i Vanilla JavaScript. Repozytorium zawiera źródłowe strony HTML, współdzielone partiale layoutu, modułową warstwę stylów, lokalne dane JSON oraz pipeline budujący finalny output do katalogu `dist/`.

Zakres repo obejmuje stronę główną, katalog produktów, prerenderowane strony detalu produktu i kompletów podróżnych, koszyk, checkout, formularz kontaktowy, FAQ, strony prawne oraz strony potwierdzeń dla formularzy.

### Kluczowe funkcje

- Wielostronicowa architektura oparta o statyczne pliki HTML i współdzielone partiale `header` / `footer`.
- Katalog produktów renderowany z `data/products.json`, z wyszukiwaniem, filtrowaniem, sortowaniem, synchronizacją stanu z URL i paginacją typu "load more".
- Detal produktu i detale kompletów podróżnych oparte o dane JSON, z hydracją treści po stronie klienta oraz build-time prerenderingiem indeksowalnych ścieżek w `dist/`.
- Koszyk oparty o `localStorage`, z aktualizacją ilości, usuwaniem pozycji, licznikiem w nagłówku i przeliczeniem podsumowania zamówienia.
- Formularze kontaktu, newslettera i checkoutu z walidacją po stronie klienta oraz wspólnym dokumentowym modelem potwierdzeń.
- Nawigacja mobilna z drawerem, wyszukiwarka w nagłówku, dropdowny, FAQ accordion, modal informacyjny i przełącznik motywu jasny/ciemny.
- Build produkcyjny generujący `dist/`, minifikujący CSS i JS, inline'ujący partiale, kopiujący zasoby i dane oraz generujący pliki SEO.
- Renderowane testy dostępności oparte o Playwright i `@axe-core/playwright`.

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
├── assets/                # fonty, favicony, logo, obrazy, sprite SVG, manifest metadata
├── css/
│   ├── components/        # współdzielone komponenty UI
│   ├── pages/             # style specyficzne dla widoków
│   ├── base.css           # baza, focus states, utilities
│   ├── layout.css         # warstwa layoutu
│   ├── tokens.css         # tokeny projektu i reduced-motion
│   └── main.css           # główny entry CSS
├── data/                  # produkty, kategorie, komplety podróżne
├── dist/                  # generowany output produkcyjny
├── js/
│   ├── modules/           # moduły funkcjonalne aplikacji
│   ├── app.js             # bootstrap aplikacji
│   └── config.js          # współdzielona konfiguracja
├── partials/              # współdzielony header i footer
├── scripts/               # build, preview, SEO config, image optimization
├── tests/a11y/            # renderowane testy dostępności
├── *.html                 # strony źródłowe
├── package.json
├── netlify.toml
├── playwright.config.js
├── robots.txt
└── sitemap.xml
```

### Instalacja i konfiguracja

```bash
npm install
```

### Development lokalny

Podstawowy podgląd lokalny:

```bash
npm run build:preview
```

Tryb watch dla produkcyjnych assetów:

```bash
npm run watch:css
npm run watch:js
```

Dostępne są również komendy pomocnicze:

```bash
npm run clean:dist
npm run build:prepare
npm run build:html
npm run build:assets
npm run build:seo
npm run build:images
npm run images:optimize
npm run qa:a11y
```

### Build produkcyjny

```bash
npm run build
```

Pipeline:

- odtwarza katalog `dist/`
- minifikuje `css/main.css` do `dist/css/main.min.css`
- bundluje i minifikuje `js/app.js` do `dist/js/app.min.js`
- kopiuje `assets/` i `data/`
- inline'uje `partials/header.html` i `partials/footer.html` do stron HTML
- generuje `robots.txt` i `sitemap.xml`
- prerenderuje indeksowalne strony:
  - `dist/produkt/<slug>/index.html`
  - `dist/komplety/<slug>/index.html`

### Deployment

Repo zawiera konfigurację dla Netlify w `netlify.toml`:

- build command: `npm run build`
- publish directory: `dist`
- nagłówki bezpieczeństwa dla całego serwisu
- reguły cache dla HTML, zasobów, danych, `robots.txt`, `sitemap.xml` i manifestu

### Dostępność

W repo widoczne są zaimplementowane elementy dostępności:

- skip link do głównej treści
- widoczne stany `:focus-visible`
- `aria-current` dla aktywnej nawigacji
- `aria-expanded`, `aria-controls` i zarządzanie fokusem dla drawer navigation, wyszukiwarki i dropdownów
- formularze z etykietami, komunikatami błędów i regionami `aria-live`
- FAQ oparte o przyciski i regiony
- modal z `role="dialog"` i `aria-modal="true"`
- obsługa `prefers-reduced-motion`
- renderowane testy axe uruchamiane przez:

```bash
npm run qa:a11y
```

### SEO

Repo zawiera wdrożone elementy SEO:

- `meta description`
- `canonical`
- Open Graph i Twitter metadata
- `robots.txt`
- `sitemap.xml`
- JSON-LD na stronach publicznych i detalach (`Organization`, `WebPage`, `CollectionPage`, `Product`, `ContactPage`, `FAQPage`)
- wspólną konfigurację adresów w `scripts/seo-config.mjs`
- build-time prerendering indeksowalnych stron produktu i kompletów podróżnych do statycznych ścieżek w `dist/`

Źródłowe strony `produkt.html` i `komplety.html` pozostają warstwą fallback/progressive enhancement, natomiast indeksowalne URL-e są generowane w buildzie.

### Wydajność

W repozytorium widać następujące rozwiązania związane z wydajnością:

- minifikacja CSS i JS w buildzie produkcyjnym
- bundling JS przez `esbuild`
- pipeline optymalizacji obrazów przez `sharp`
- rozdzielenie obrazów źródłowych `assets/img-src/` i wynikowych `assets/img/`
- użycie `AVIF`, `WebP`, `JPG`, `PNG` i `SVG`
- obrazy responsywne przez `picture`, `srcset` i `sizes`
- jawne `width` / `height`
- `loading="lazy"` i `decoding="async"` dla obrazów statycznych i renderowanych dynamicznie
- architektura bez frameworka UI

### Utrzymanie projektu

Najważniejsze miejsca dla dalszego utrzymania:

- `js/app.js` uruchamia bootstrap aplikacji i moduły stron
- `js/modules/` zawiera logikę katalogu, produktu, kompletów, koszyka, formularzy, nawigacji, motywu i helperów UI
- `js/modules/routes.js` centralizuje budowę i odczyt ścieżek detail pages
- `css/tokens.css`, `css/layout.css` i `css/components/` stanowią wspólną warstwę stylów
- `css/pages/` zawiera style specyficzne dla poszczególnych widoków
- `scripts/build-dist.mjs` kontroluje build, inline partials, prerendering i generację plików SEO
- `scripts/seo-config.mjs` jest źródłem prawdy dla originu i indeksowalnych ścieżek
- `tests/a11y/a11y.spec.js` obejmuje kluczowe widoki testami renderowanymi

### Licencja

MIT. Licencja jest zadeklarowana w `package.json`, a plik licencji znajduje się w repozytorium jako `LICENSE`.

## EN

### Project Overview

Outland Gear is a static multi-page storefront front-end built with HTML, CSS, and Vanilla JavaScript. The repository contains source HTML pages, shared layout partials, a modular styling layer, local JSON datasets, and a build pipeline that generates the final production output into `dist/`.

The implemented scope includes the homepage, product listing, prerendered product and travel-kit detail pages, cart, checkout, contact form, FAQ, legal pages, and form confirmation pages.

### Key Features

- Multi-page architecture based on static HTML files and shared `header` / `footer` partials.
- Product listing rendered from `data/products.json`, with search, filtering, sorting, URL state sync, and load-more pagination.
- Product detail and travel-kit detail views powered by JSON data, with client-side hydration and build-time prerendering of indexable routes in `dist/`.
- `localStorage`-based cart with quantity updates, item removal, header counter, and order summary recalculation.
- Contact, newsletter, and checkout forms with client-side validation and a shared document-level confirmation flow.
- Mobile drawer navigation, header search, dropdowns, FAQ accordion, informational modal, and light/dark theme toggle.
- Production build pipeline that generates `dist/`, minifies CSS and JS, inlines partials, copies assets and data, and generates SEO files.
- Rendered accessibility testing powered by Playwright and `@axe-core/playwright`.

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
├── assets/                # fonts, favicons, logo, images, SVG sprite, manifest metadata
├── css/
│   ├── components/        # shared UI components
│   ├── pages/             # page-specific styles
│   ├── base.css           # base layer, focus states, utilities
│   ├── layout.css         # layout layer
│   ├── tokens.css         # project tokens and reduced-motion handling
│   └── main.css           # main CSS entry point
├── data/                  # products, categories, travel kits
├── dist/                  # generated production output
├── js/
│   ├── modules/           # application feature modules
│   ├── app.js             # application bootstrap
│   └── config.js          # shared configuration
├── partials/              # shared header and footer
├── scripts/               # build, preview, SEO config, image optimization
├── tests/a11y/            # rendered accessibility tests
├── *.html                 # source pages
├── package.json
├── netlify.toml
├── playwright.config.js
├── robots.txt
└── sitemap.xml
```

### Setup and Installation

```bash
npm install
```

### Local Development

Primary local preview:

```bash
npm run build:preview
```

Watch mode for production assets:

```bash
npm run watch:css
npm run watch:js
```

Additional helper commands:

```bash
npm run clean:dist
npm run build:prepare
npm run build:html
npm run build:assets
npm run build:seo
npm run build:images
npm run images:optimize
npm run qa:a11y
```

### Production Build

```bash
npm run build
```

The pipeline:

- recreates the `dist/` directory
- minifies `css/main.css` into `dist/css/main.min.css`
- bundles and minifies `js/app.js` into `dist/js/app.min.js`
- copies `assets/` and `data/`
- inlines `partials/header.html` and `partials/footer.html` into HTML files
- generates `robots.txt` and `sitemap.xml`
- prerenders indexable detail pages:
  - `dist/produkt/<slug>/index.html`
  - `dist/komplety/<slug>/index.html`

### Deployment

The repository includes Netlify configuration in `netlify.toml`:

- build command: `npm run build`
- publish directory: `dist`
- security headers for the site
- cache rules for HTML, assets, data, `robots.txt`, `sitemap.xml`, and the manifest

### Accessibility

The repository includes visible accessibility implementation:

- skip link to the main content
- visible `:focus-visible` states
- `aria-current` for active navigation
- `aria-expanded`, `aria-controls`, and focus management for drawer navigation, search, and dropdowns
- forms with labels, inline error messaging, and `aria-live` status regions
- FAQ built with buttons and labelled regions
- modal dialog with `role="dialog"` and `aria-modal="true"`
- `prefers-reduced-motion` handling
- rendered axe-based tests available via:

```bash
npm run qa:a11y
```

### SEO

The repository implements:

- `meta description`
- `canonical`
- Open Graph and Twitter metadata
- `robots.txt`
- `sitemap.xml`
- JSON-LD on public pages and detail views (`Organization`, `WebPage`, `CollectionPage`, `Product`, `ContactPage`, `FAQPage`)
- shared URL policy in `scripts/seo-config.mjs`
- build-time prerendering of indexable product and travel-kit pages to static routes in `dist/`

The source `produkt.html` and `komplety.html` pages remain fallback/progressive-enhancement entry points, while indexable URLs are generated during the build.

### Performance

The repository contains explicit performance-related implementation:

- CSS and JS minification in the production build
- JS bundling via `esbuild`
- image optimization pipeline using `sharp`
- separation between source images in `assets/img-src/` and generated assets in `assets/img/`
- use of `AVIF`, `WebP`, `JPG`, `PNG`, and `SVG`
- responsive images via `picture`, `srcset`, and `sizes`
- explicit `width` / `height`
- `loading="lazy"` and `decoding="async"` for static and dynamically rendered images
- lightweight architecture without a UI framework

### Project Maintenance

Key locations for ongoing maintenance:

- `js/app.js` bootstraps the application and page modules
- `js/modules/` contains catalog, product, travel-kit, cart, form, navigation, theme, and UI helper logic
- `js/modules/routes.js` centralizes detail-page path building and resolution
- `css/tokens.css`, `css/layout.css`, and `css/components/` define the shared styling layer
- `css/pages/` contains page-specific styles
- `scripts/build-dist.mjs` controls the build, partial inlining, prerendering, and SEO file generation
- `scripts/seo-config.mjs` is the source of truth for origin and indexable paths
- `tests/a11y/a11y.spec.js` covers key rendered views with automated checks

### License

MIT. The license is declared in `package.json`, and the repository also includes a `LICENSE` file.
