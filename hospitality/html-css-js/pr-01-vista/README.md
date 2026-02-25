# Vista — Hotels & Travel

## PL

### Przegląd projektu
Profesjonalny projekt portfolio front-end dla branży hospitality, zrealizowany jako strona wielopodstronowa w czystym HTML, CSS i JavaScript. Projekt obejmuje stronę główną, podstrony ofertowe, galerię, kontakt oraz strony prawne.

### Kluczowe funkcje
- Wielostronicowa architektura: `index.html`, `rooms.html`, `offers.html`, `gallery.html`, `contact.html`, `onas.html`, strony prawne oraz `404.html` i `offline.html`.
- Modularny CSS oparty o tokeny (`css/modules/tokens.css`) i podział na warstwy: base/layout/components/sections/utilities/themes/motion/print.
- Stylowanie i nazewnictwo komponentów w konwencji BEM (np. `site-header__inner`, `room-card__img`, `gallery-cats__link`).
- Modułowy JavaScript (`js/features/*`) dla nawigacji, motywu, tabów, lightboxa, filtrów galerii, formularza i dynamicznego JSON-LD.
- PWA: `site.webmanifest`, rejestracja Service Workera i fallback offline (`offline.html`).
- Konfiguracja wdrożeniowa Netlify (`netlify/_headers`, `netlify/_redirects`).

### Tech stack
- HTML5
- CSS3 + design tokens + PostCSS (`postcss-import`, `cssnano`)
- Vanilla JavaScript (ES modules)
- Node.js tooling (`sharp`, `chokidar`)
- Netlify (nagłówki bezpieczeństwa i przekierowania)

### Struktura projektu (skrót)
- `css/` — entry CSS + moduły
- `js/` — entry JS + moduły feature
- `assets/img/` — obrazy źródłowe i zoptymalizowane + favicon/OG/logo
- `assets/seo/` — JSON-LD per podstrona
- `pwa/` — service worker
- `netlify/` — konfiguracja hostingu

### Setup i uruchomienie
1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Zbuduj CSS i obrazy:
   ```bash
   npm run build
   ```
3. W środowisku lokalnym uruchom serwer statyczny (dowolny), np.:
   ```bash
   npx serve .
   ```

### Build i wdrożenie
- `npm run css:build` generuje `css/style.min.css`.
- `npm run img:opt` generuje WebP/AVIF do `assets/img/optimized`.
- Netlify wykorzystuje:
  - `netlify/_headers` (CSP, HSTS, Referrer-Policy, itp.)
  - `netlify/_redirects` (redirect `/index.html` → `/` oraz fallback 404).

### Dostępność (A11y)
- Skip link (`.skip-link`) obecny na podstronach.
- Semantyczne sekcje (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Widoczne style focus (`:focus-visible`) i obsługa klawiatury dla nawigacji, tabów i lightboxa.
- Obsługa `prefers-reduced-motion` w module `motion.css`.
- Formularz kontaktowy ma walidację atrybutową + walidację JS i komunikaty błędów `aria-live`.

### SEO
- Każda podstrona ma `title`, `meta description`, `canonical`, `og:*`, `twitter:*`, `robots`.
- JSON-LD jest dostarczane jako fallback inline + aktualizacja z plików `assets/seo/*.json`.
- Dostępne: `robots.txt` i `sitemap.xml`.

### Wydajność
- Obrazy realizowane przez `<picture>` z AVIF/WebP + JPEG fallback.
- Atrybuty `loading="lazy"` i `decoding="async"` na większości obrazów niekrytycznych.
- Preload obrazu hero na stronie głównej.
- Fonty lokalne (`woff2`) ładowane przez `@font-face` z `font-display: swap`.

### Roadmap
- Zastąpienie konsolowych logów SW wzorcem telemetrycznym bez `console.*` w bundle runtime.
- Opcjonalne cache busting assetów (hashing nazw plików) przy wdrożeniu.
- Rozszerzenie automatycznych testów statycznych (link check + a11y lint).
- Dalsze dopracowanie krytycznej ścieżki renderowania (critical CSS).
- Wzmocnienie strategii cache PWA dla obrazów o wysokiej wadze.

### Licencja
MIT

---

## EN

### Project overview
Production-oriented front-end portfolio project for the hospitality domain, implemented as a multi-page website in plain HTML, CSS, and JavaScript. It includes a homepage, offer pages, gallery, contact page, and legal pages.

### Key features
- Multi-page architecture: `index.html`, `rooms.html`, `offers.html`, `gallery.html`, `contact.html`, `onas.html`, legal pages, plus `404.html` and `offline.html`.
- Modular CSS built around design tokens (`css/modules/tokens.css`) and layer separation: base/layout/components/sections/utilities/themes/motion/print.
- BEM-oriented component naming (e.g. `site-header__inner`, `room-card__img`, `gallery-cats__link`).
- Modular JavaScript (`js/features/*`) for navigation, theme switching, tabs, lightbox, gallery filters, forms, and dynamic JSON-LD.
- PWA setup: `site.webmanifest`, Service Worker registration, and offline fallback (`offline.html`).
- Netlify deployment configuration (`netlify/_headers`, `netlify/_redirects`).

### Tech stack
- HTML5
- CSS3 + design tokens + PostCSS (`postcss-import`, `cssnano`)
- Vanilla JavaScript (ES modules)
- Node.js tooling (`sharp`, `chokidar`)
- Netlify (security headers and redirects)

### Structure overview (short)
- `css/` — CSS entry + modules
- `js/` — JS entry + feature modules
- `assets/img/` — source and optimized images + favicon/OG/logo
- `assets/seo/` — JSON-LD per page
- `pwa/` — service worker
- `netlify/` — hosting configuration

### Setup & run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build CSS and images:
   ```bash
   npm run build
   ```
3. Run any static local server, e.g.:
   ```bash
   npx serve .
   ```

### Build & deployment notes
- `npm run css:build` builds `css/style.min.css`.
- `npm run img:opt` generates WebP/AVIF into `assets/img/optimized`.
- Netlify uses:
  - `netlify/_headers` (CSP, HSTS, Referrer-Policy, etc.)
  - `netlify/_redirects` (`/index.html` → `/` and 404 fallback).

### Accessibility notes
- Skip link (`.skip-link`) is present across pages.
- Semantic landmarks are used (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Visible focus styles (`:focus-visible`) and keyboard support for nav, tabs, and lightbox.
- `prefers-reduced-motion` handling is included in `motion.css`.
- Contact form includes native attributes + JS validation with `aria-live` error feedback.

### SEO notes
- Each page includes `title`, `meta description`, `canonical`, `og:*`, `twitter:*`, and `robots`.
- JSON-LD is delivered via inline fallback + runtime updates from `assets/seo/*.json`.
- `robots.txt` and `sitemap.xml` are included.

### Performance notes
- Images use `<picture>` with AVIF/WebP and JPEG fallback.
- `loading="lazy"` and `decoding="async"` are used for most non-critical images.
- Hero image preload is defined on the homepage.
- Local `woff2` fonts are loaded via `@font-face` with `font-display: swap`.

### Roadmap
- Replace runtime SW console logging with non-console diagnostics.
- Add optional cache-busting strategy (hashed assets) for deployment.
- Extend automated static checks (link checking + accessibility linting).
- Continue refining critical render path (critical CSS strategy).
- Improve PWA caching strategy for heavy visual assets.

### License
MIT
