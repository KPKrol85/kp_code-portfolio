# Atelier No.02

## Wersja Polska

### Przegląd projektu
Atelier No.02 to wielostronicowa strona front-end restauracji fine dining, przygotowana jako projekt portfolio. Projekt działa jako statyczny serwis HTML/CSS/JS z konfiguracją pod hosting typu Netlify.

### Kluczowe funkcje (na podstawie kodu)
- Wielostronicowy serwis: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html` oraz strony prawne i techniczne (`offline.html`, `404.html`, `thank-you.html`).
- Responsywna nawigacja z menu mobilnym, dropdownami i obsługą klawiatury.
- Przełącznik motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Sekcja menu oparta o `data/menu.json` (render dynamiczny + filtrowanie + wyszukiwarka).
- Galeria z lightboxem (nawigacja klawiaturą, fullscreen, swipe).
- Formularz kontaktowy Netlify (`data-netlify="true"`, honeypot `bot-field`) z walidacją klienta.
- PWA: `manifest.webmanifest` + `sw.js` + strona `offline.html`.

### Tech stack
- HTML5
- CSS (modułowa architektura: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript (moduły ES)
- Node.js tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Struktura projektu
- `css/base` - tokeny, reset, baza, typografia
- `css/layout` - layout globalny (header/footer/grid)
- `css/components` - komponenty i stany
- `css/pages` - style specyficzne dla podstron
- `js/app`, `js/features`, `js/core` - bootstrap, inicjalizacja i funkcje domenowe
- `assets` - obrazy, fonty, ikony
- `data/menu.json` - dane menu

### Setup i uruchomienie
1. `npm install`
2. Dev server: `npm run dev:server`
3. Build assets: `npm run build`
4. Pełna weryfikacja: `npm run check`

### Build i deployment
- Konfiguracja deploymentu zawiera `_headers` i `_redirects`.
- Redirect `/* /404.html 404` jest skonfigurowany.
- Manifest jest podpięty przez `<link rel="manifest" href="manifest.webmanifest">`.
- Rejestracja Service Workera jest wykonywana poza localhost (`js/bootstrap.js`).

### Dostępność
- Skip links są obecne na stronach.
- Nawigacja mobilna ma `aria-expanded`, `aria-controls` i focus trap.
- Występują błędy kontrastu WCAG2AA wykryte przez `pa11y-ci` (szczegóły w `AUDIT.md`).

### SEO
- Strony mają `meta description`, `canonical`, OpenGraph oraz `twitter:*`.
- JSON-LD występuje na stronach głównych i prawnych; nie występuje na `404.html`, `offline.html`, `thank-you.html`.
- `robots.txt` i `sitemap.xml` są obecne.

### Wydajność
- Obrazy używają wariantów AVIF/WEBP/JPG i lazy loading w sekcjach treści.
- Fonty są preloadowane i ustawione z `font-display: swap`.
- W projekcie występuje niespójność assetów minifikowanych (`style.min.css`) względem referencji SW/offline (opis w `AUDIT.md`).

### Roadmap
- Naprawa spójności ścieżek build/runtime dla offline i SW.
- Korekta kontrastu stopki i elementów dekoracyjnych (WCAG AA).
- Ujednolicenie źródeł stylów animacji (`animations.css` vs `home.css`).
- Rozszerzenie `sitemap.xml` o indeksowalne strony (np. `contact.html`).

### Licencja
MIT (zgodnie z `package.json`).

---

## English Version

### Project Overview
Atelier No.02 is a multi-page front-end fine-dining restaurant website built as a portfolio project. It runs as a static HTML/CSS/JS site with deployment-oriented configuration for Netlify-like hosting.

### Key Features (from implemented code)
- Multi-page site: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, plus legal/technical pages (`offline.html`, `404.html`, `thank-you.html`).
- Responsive navigation with mobile menu, dropdowns, and keyboard handling.
- Light/dark theme toggle with persisted preference in `localStorage`.
- Menu section powered by `data/menu.json` (dynamic rendering + filtering + search).
- Gallery lightbox (keyboard navigation, fullscreen, swipe).
- Netlify contact form (`data-netlify="true"`, honeypot `bot-field`) with client-side validation.
- PWA setup: `manifest.webmanifest` + `sw.js` + `offline.html`.

### Tech Stack
- HTML5
- CSS (modular architecture: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript (ES modules)
- Node.js tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Structure Overview
- `css/base` - tokens, reset, base, typography
- `css/layout` - global layout (header/footer/grid)
- `css/components` - components and states
- `css/pages` - page-specific styles
- `js/app`, `js/features`, `js/core` - bootstrap, initialization, feature modules
- `assets` - images, fonts, icons
- `data/menu.json` - menu data

### Setup & Run
1. `npm install`
2. Dev server: `npm run dev:server`
3. Build assets: `npm run build`
4. Full validation: `npm run check`

### Build & Deployment Notes
- Deployment config includes `_headers` and `_redirects`.
- Redirect `/* /404.html 404` is configured.
- Manifest is linked via `<link rel="manifest" href="manifest.webmanifest">`.
- Service Worker registration runs outside localhost (`js/bootstrap.js`).

### Accessibility Notes
- Skip links are implemented across pages.
- Mobile navigation includes `aria-expanded`, `aria-controls`, and focus trapping.
- WCAG2AA contrast failures were detected by `pa11y-ci` (see `AUDIT.md`).

### SEO Notes
- Pages include `meta description`, `canonical`, OpenGraph, and `twitter:*` metadata.
- JSON-LD is present on main/legal pages; not detected on `404.html`, `offline.html`, `thank-you.html`.
- `robots.txt` and `sitemap.xml` are present.

### Performance Notes
- Images use AVIF/WEBP/JPG variants and lazy loading in content sections.
- Fonts are preloaded and use `font-display: swap`.
- There is a minified asset path inconsistency (`style.min.css`) in SW/offline references (documented in `AUDIT.md`).

### Roadmap
- Fix build/runtime path consistency for offline and SW assets.
- Correct footer/decorative contrast issues for WCAG AA.
- Consolidate reveal animation styles (`animations.css` vs `home.css`).
- Extend `sitemap.xml` to include indexable pages (e.g. `contact.html`).

### License
MIT (as defined in `package.json`).
