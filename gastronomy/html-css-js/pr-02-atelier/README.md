# Atelier No.02

## Wersja polska

### Przegląd projektu
Atelier No.02 to wielostronicowy serwis portfolio (HTML + modularny CSS + ES Modules JS) prezentujący demonstracyjny projekt dla branży gastronomicznej. Repozytorium zawiera stronę główną, podstrony ofertowe, podstrony prawne oraz strony techniczne (`404.html`, `offline.html`, `thank-you.html`).

### Kluczowe funkcje
- Wielostronicowa nawigacja z rozwijanymi sekcjami i wariantem mobilnym.
- Przełącznik motywu z persystencją preferencji użytkownika.
- Sekcje treści oparte o modularny system komponentów CSS.
- Dynamiczne renderowanie danych menu z `data/menu.json`.
- Galeria z modułem lightbox i obsługą klawiatury.
- Formularz kontaktowy Netlify (`data-netlify`, `netlify-honeypot`).
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.
- Quality gate uruchamiany przez skrypty npm (`lint`, `validate:html`, `check:links`, `check:a11y`).

### Stack technologiczny
- HTML5 (strony statyczne)
- CSS (architektura modułowa + tokeny)
- JavaScript ES Modules
- Node.js tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci, sharp

### Struktura projektu
- `css/base/` - reset, tokeny, typografia, fundamenty
- `css/layout/` - układy sekcji i siatki
- `css/components/` - komponenty UI
- `css/pages/` - style per podstrona
- `css/utilities/` - klasy pomocnicze
- `js/app/`, `js/features/`, `js/core/` - logika inicjalizacji i moduły funkcjonalne
- `assets/` - fonty, obrazy, ikony
- `data/` - dane wejściowe dla sekcji menu
- `_headers`, `_redirects`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `sw.js` - pliki deploy/SEO/PWA

### Setup i uruchomienie
1. `npm install`
2. `npm run build`
3. `npm run dev:server`
4. `npm run check` (pełny pakiet jakości)

### Polityka entrypointów JS
- `js/core.js` (lekki runtime): `initMisc`, `initNav`, `initThemeToggle`; używany na stronach prostych/informacyjnych (`404.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`).
- `js/script.js` (pełny runtime): `initApp` + inicjalizatory common/per-page; używany na stronach feature (`index.html`, `about.html`, `menu.html`, `gallery.html`, `thank-you.html`).
- `offline.html` jest wyjątkiem deploy i ładuje `js/script.min.js` bezpośrednio.
- Szczegółowa mapa stron i reguły wyboru: `settings.md` → `JS entrypoints policy (core vs script)`.

### Build i wdrożenie
- Konfiguracja pod hosting statyczny: `_headers`, `_redirects`.
- Manifest i service worker są osadzone dla deployu root (`/`).
- `netlify.toml`: not detected in project.
- `vercel.json`: not detected in project.
- Konfiguracja bundlera typu Vite/Webpack: not detected in project.

### Dostępność
- Występują skip linki i fallback `noscript` na stronach.
- Hierarchia nagłówków H1-H2-H3 jest spójna na sprawdzonych podstronach.
- Istnieją regresje wykryte automatycznie:
  - `aria-label-misuse` w `menu.html:468`.
  - Niewystarczający kontrast stopki w testach `pa11y-ci` (1/10 URL pass).

### SEO
- Występują: `title`, `meta description`, canonical, Open Graph, Twitter card (na większości stron).
- `robots.txt` i `sitemap.xml` są obecne.
- JSON-LD występuje na głównych podstronach (m.in. `index.html`, `about.html`, `menu.html`, `gallery.html`, strony prawne).
- `og:url` i canonical nie są kompletne na wszystkich stronach technicznych (`404.html`, `thank-you.html`).

### Wydajność
- Obrazy wykorzystują `picture` + AVIF/WebP/JPG fallback.
- Występuje `loading="lazy"` i jawne wymiary obrazów.
- Preload zasobów krytycznych jest wdrożony.
- Service worker ma guard lokalnego środowiska (`localhost`, `127.0.0.1`, `::1`) w `js/bootstrap.js`.
- Aktualnie quality gate wykrywa brakujące pliki obrazów (`cytrusowe-ciasto-720x480.*`) używane w `index.html` i `menu.html`.

### Roadmap
- Usunąć brakujące referencje obrazów lub dogenerować brakujące warianty `720x480`.
- Zamknąć błędy `html-validate` (DOCTYPE style, `type` dla `button/input`, `aria-label-misuse`).
- Podnieść kontrast tekstu stopki, aby przejść automatyczny audyt WCAG.
- Ujednolicić metadane OG/canonical na stronach technicznych.
- Ograniczyć placeholdery produkcyjne (np. link mapy w `about.html`).

### Licencja
MIT (zgodnie z `package.json`).

---

## English version

### Project overview
Atelier No.02 is a multi-page portfolio site (HTML + modular CSS + ES Modules JS) presenting a demo project for the hospitality domain. The repository includes the homepage, feature subpages, legal pages, and technical pages (`404.html`, `offline.html`, `thank-you.html`).

### Key features
- Multi-page navigation with dropdown sections and mobile variant.
- Theme switcher with persisted user preference.
- Content sections based on a modular CSS component system.
- Dynamic menu data rendering from `data/menu.json`.
- Gallery with lightbox module and keyboard support.
- Netlify contact form (`data-netlify`, `netlify-honeypot`).
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.
- npm-based quality gate (`lint`, `validate:html`, `check:links`, `check:a11y`).

### Tech stack
- HTML5 (static pages)
- CSS (modular architecture + tokens)
- JavaScript ES Modules
- Node.js tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci, sharp

### Structure overview
- `css/base/` - reset, tokens, typography, fundamentals
- `css/layout/` - layouts and grids
- `css/components/` - UI components
- `css/pages/` - page-level styles
- `css/utilities/` - utility classes
- `js/app/`, `js/features/`, `js/core/` - initialization and feature modules
- `assets/` - fonts, images, icons
- `data/` - menu data source
- `_headers`, `_redirects`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `sw.js` - deploy/SEO/PWA files

### Setup & run
1. `npm install`
2. `npm run build`
3. `npm run dev:server`
4. `npm run check` (full quality gate)

### JS Entrypoints Policy
- `js/core.js` (light runtime): `initMisc`, `initNav`, `initThemeToggle`; used on simple/informational pages (`404.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`).
- `js/script.js` (full runtime): `initApp` + common/per-page initializers; used on feature pages (`index.html`, `about.html`, `menu.html`, `gallery.html`, `thank-you.html`).
- `offline.html` is a deliberate deploy exception and loads `js/script.min.js` directly.
- Full page mapping and selection rules: `settings.md` → `JS entrypoints policy (core vs script)`.

### Build & deployment notes
- Static-host deployment files are present: `_headers`, `_redirects`.
- Manifest and service worker are configured for root deployment (`/`).
- `netlify.toml`: not detected in project.
- `vercel.json`: not detected in project.
- Vite/Webpack-style build config: not detected in project.

### Accessibility notes
- Skip links and `noscript` fallbacks are present.
- H1-H2-H3 heading hierarchy is consistent on reviewed pages.
- Known automated regressions:
  - `aria-label-misuse` in `menu.html:468`.
  - Footer contrast failures in `pa11y-ci` output (1/10 URL pass).

### SEO notes
- `title`, `meta description`, canonical, Open Graph, and Twitter tags are present on most pages.
- `robots.txt` and `sitemap.xml` are present.
- JSON-LD is present on core pages (including `index.html`, `about.html`, `menu.html`, `gallery.html`, legal pages).
- `og:url` and canonical are not complete on all technical pages (`404.html`, `thank-you.html`).

### Performance notes
- Images use `picture` with AVIF/WebP/JPG fallback.
- `loading="lazy"` and explicit image dimensions are implemented.
- Critical resource preloads are implemented.
- Service worker local-environment guard exists in `js/bootstrap.js` (`localhost`, `127.0.0.1`, `::1`).
- Current quality gate reports missing image variants (`cytrusowe-ciasto-720x480.*`) referenced in `index.html` and `menu.html`.

### Roadmap
- Remove broken image references or generate missing `720x480` variants.
- Resolve `html-validate` errors (DOCTYPE style, `type` on `button/input`, `aria-label-misuse`).
- Increase footer text contrast to pass automated WCAG checks.
- Standardize OG/canonical metadata on technical pages.
- Remove production placeholder links (for example map URL in `about.html`).

### License
MIT (as declared in `package.json`).
