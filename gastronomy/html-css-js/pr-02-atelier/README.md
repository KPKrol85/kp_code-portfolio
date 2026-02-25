# Atelier No.02

## Wersja Polska

### Przegląd projektu
Atelier No.02 to wielostronicowa strona front-end restauracji fine dining przygotowana jako projekt portfolio. Implementacja opiera się na HTML/CSS/JS z modularną architekturą i konfiguracją pod statyczny deployment.

### Kluczowe funkcje (na podstawie kodu)
- Wielostronicowy serwis: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, strony prawne oraz techniczne (`offline.html`, `404.html`, `thank-you.html`).
- Responsywna nawigacja z menu mobilnym, dropdownami i obsługą klawiatury.
- Przełącznik motywu jasny/ciemny z zapisem preferencji użytkownika.
- Dynamiczne renderowanie sekcji menu z `data/menu.json` + filtrowanie i wyszukiwarka.
- Galeria z lightboxem (klawiatura, fullscreen, swipe).
- Formularz kontaktowy z integracją Netlify (`data-netlify="true"`, honeypot) i walidacją po stronie klienta.
- PWA baseline: `manifest.webmanifest`, `sw.js`, ekran `offline.html`.

### Tech stack
- HTML5
- CSS (modułowy podział `base/layout/components/pages`)
- JavaScript (moduły ES)
- Tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Struktura projektu
- `css/base` - tokeny, reset, baza, typografia
- `css/layout` - layout globalny
- `css/components` - komponenty i stany
- `css/pages` - style podstron
- `js/app`, `js/features`, `js/core` - inicjalizacja i logika funkcjonalna
- `assets` - obrazy, fonty, ikony
- `data/menu.json` - dane menu

### Setup i uruchomienie
1. `npm install`
2. `npm run dev:server`
3. `npm run build`
4. `npm run check`

### Build i deployment
- Konfiguracja deploymentu: `_headers`, `_redirects`, `manifest.webmanifest`.
- Rejestracja Service Workera jest ograniczona do środowisk innych niż localhost (`js/bootstrap.js`).
- Strategia assetów: pliki `.min.css/.min.js` są build-stage assets i nie są wymagane jako warunek działania środowiska deweloperskiego.

### Dostępność
- Skip links, focus styles, `aria-expanded`, `aria-current` i obsługa klawiatury są zaimplementowane.
- `prefers-reduced-motion` jest obsłużone w JS/CSS.
- W audycie WCAG2AA wykryto realne błędy kontrastu (szczegóły: `AUDIT.md`).

### SEO
- Strony mają `meta description`, canonical, OpenGraph i `robots` meta.
- JSON-LD występuje na stronach głównych/prawnych.
- `robots.txt` i `sitemap.xml` są obecne.

### Wydajność
- Obrazy wykorzystują warianty AVIF/WEBP/JPG, lazy loading i deklaracje `width`/`height`.
- Fonty są preloadowane, a `@font-face` używa `font-display: swap`.
- Kod zawiera podstawowe mechanizmy progressive enhancement i degradacji bez JS.

### Roadmap
- Domknięcie kontrastu WCAG AA.
- Ujednolicenie tokenów kolorystycznych i usunięcie niespójności zmiennych.
- Redukcja duplikacji reguł stylów animacji.
- Rozszerzenie `sitemap.xml` o wszystkie indeksowalne podstrony.

### Licencja
MIT (zgodnie z `package.json`).

---

## English Version

### Project Overview
Atelier No.02 is a multi-page fine-dining restaurant front-end website built as a portfolio project. The implementation is based on HTML/CSS/JS with modular architecture and static deployment configuration.

### Key Features (from implemented code)
- Multi-page site: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, plus legal and technical pages (`offline.html`, `404.html`, `thank-you.html`).
- Responsive navigation with mobile menu, dropdowns, and keyboard handling.
- Light/dark theme toggle with persisted user preference.
- Dynamic menu rendering from `data/menu.json` with filtering and search.
- Gallery lightbox (keyboard, fullscreen, swipe).
- Netlify-integrated contact form (`data-netlify="true"`, honeypot) with client-side validation.
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech Stack
- HTML5
- CSS (modular split across `base/layout/components/pages`)
- JavaScript (ES modules)
- Tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Structure Overview
- `css/base` - tokens, reset, base, typography
- `css/layout` - global layout
- `css/components` - components and states
- `css/pages` - page-specific styles
- `js/app`, `js/features`, `js/core` - initialization and feature logic
- `assets` - images, fonts, icons
- `data/menu.json` - menu dataset

### Setup & Run
1. `npm install`
2. `npm run dev:server`
3. `npm run build`
4. `npm run check`

### Build & Deployment Notes
- Deployment config includes `_headers`, `_redirects`, and `manifest.webmanifest`.
- Service Worker registration is restricted outside localhost (`js/bootstrap.js`).
- Asset strategy: `.min.css/.min.js` are build-stage assets and are not required for local non-min development runtime.

### Accessibility Notes
- Skip links, focus styling, `aria-expanded`, `aria-current`, and keyboard support are implemented.
- `prefers-reduced-motion` is handled in JS/CSS.
- Real WCAG2AA contrast issues were detected (details in `AUDIT.md`).

### SEO Notes
- Pages include `meta description`, canonical, OpenGraph, and `robots` meta tags.
- JSON-LD is present on main/legal pages.
- `robots.txt` and `sitemap.xml` are present.

### Performance Notes
- Images use AVIF/WEBP/JPG variants, lazy loading, and explicit `width`/`height`.
- Fonts are preloaded and `@font-face` uses `font-display: swap`.
- Progressive enhancement and no-JS fallback behavior are implemented.

### Roadmap
- Resolve WCAG AA contrast failures.
- Align color token usage and remove undefined variable usage.
- Remove duplicated reveal animation rules.
- Extend `sitemap.xml` with all indexable pages.

### License
MIT (as declared in `package.json`).
