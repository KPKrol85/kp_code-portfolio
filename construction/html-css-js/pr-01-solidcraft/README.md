# SolidCraft

## 🇵🇱 Polska wersja

### 1. Przegląd projektu

SolidCraft to statyczny serwis WWW firmy remontowo-budowlanej. Projekt obejmuje stronę główną, podstrony usługowe, strony dokumentów, stronę 404, stronę offline i stronę potwierdzenia wysłania formularza.

### 2. Kluczowe funkcje

- Wielosekcyjna strona główna (oferta, realizacje, opinie, FAQ, kontakt).
- Podstrony usług w katalogu `oferta/`.
- Formularz kontaktowy z integracją Netlify Forms (`data-netlify`, honeypot `bot-field`) oraz walidacją po stronie klienta (w tym maskowanie/formatowanie numeru telefonu).
- Rozwijane menu nawigacji i menu mobilne z obsługą klawiatury (`Esc`, trap focus, `aria-expanded`).
- Przełączanie motywu jasny/ciemny z inicjalizacją motywu przed renderowaniem.
- Lightbox galerii/oferty z obsługą klawiatury i dialogiem modalnym.
- Baner cookies oparty o `localStorage`.
- Warstwa PWA: `manifest.webmanifest`, `sw.js`, rejestracja Service Workera.
- Generowanie i utrzymywanie `sitemap.xml` oraz obecność `robots.txt`.

### 3. Tech stack

- HTML5 (wielostronicowa struktura statyczna).
- CSS (moduły przez `@import`: tokens/base/layout/components/sections/utilities).
- Vanilla JavaScript (moduły ES).
- Node.js + npm.
- Tooling: PostCSS (`postcss-import`, `postcss-preset-env`, `autoprefixer`, `cssnano`), esbuild, live-server, Prettier, sharp.
- QA/tooling developerskie: Playwright + axe-core (skrypt audytu a11y), skrypty walidacji linków i assetów.
- Konfiguracja hostingu: Netlify (`netlify.toml`, `_headers`, `_redirects`).

### 4. Struktura projektu

- `index.html` — strona główna.
- `oferta/*.html` — podstrony usług.
- `doc/*.html` — strony dokumentów.
- `thank-you/index.html`, `404.html`, `offline.html` — strony pomocnicze/systemowe.
- `css/style.css` + `css/modules/*` — źródła stylów.
- `js/script.js` + `js/modules/*` — logika UI i funkcje interaktywne.
- `js/theme-init.js`, `js/sw-register.js`, `sw.js` — inicjalizacja motywu i PWA.
- `scripts/*` — skrypty budowania, QA i automatyzacji.

### 5. Setup i instalacja

```bash
npm install
```

### 6. Local development

```bash
npm run dev
npm run watch:css
npm run watch:js
npm run check:html
npm run qa:a11y
```

### 7. Build produkcyjny

```bash
npm run build
npm run build:dist
```

- `npm run build` generuje zminifikowane assety: `css/style.min.css` i `js/script.min.js`.
- `npm run build:dist` przygotowuje katalog `dist/`, kopiuje pliki runtime i przepisuje referencje HTML do assetów minifikowanych.

### 8. Deployment

- Repozytorium zawiera konfigurację Netlify:
  - `netlify.toml`: build command `npm run build`, katalog publikacji `dist`.
  - `_headers`: nagłówki bezpieczeństwa (m.in. CSP, HSTS, X-Frame-Options).
  - `_redirects`: przekierowania 301 oraz fallback `/* -> /404.html 404`.

### 9. Dostępność (Accessibility)

- Skip link (`Pomiń do treści`).
- Atrybuty ARIA i stany nawigacji (`aria-expanded`, `aria-controls`, `aria-modal`).
- Obsługa klawiatury dla nawigacji, dropdownu, lightboxa i banera cookies.
- Komunikaty formularza przez region live (`aria-live`, `role=status`).
- Dedykowany skrypt audytu a11y (`npm run qa:a11y`) oparty o axe-core.

### 10. SEO

- Metatagi SEO w dokumentach HTML (title, description, canonical, robots).
- Open Graph i Twitter Cards.
- Dane strukturalne JSON-LD osadzone w HTML.
- `robots.txt` i `sitemap.xml`.
- Skrypt generowania mapy strony (`npm run build:sitemap`, wymaga `SITE_URL`).

### 11. Wydajność (Performance)

- Minifikacja CSS/JS (PostCSS + esbuild).
- Obrazy przetwarzane do wielu formatów/rozmiarów przez skrypt `images.js` (AVIF/WebP/JPG).
- Preload kluczowych zasobów (fonty, hero image).
- Lazy loading dla wybranych zasobów.
- Service Worker z cache runtime i offline fallback (`offline.html`).

### 12. Utrzymanie projektu

- Główna orkiestracja front-endu: `js/script.js`.
- Logika domenowa podzielona w `js/modules/` (nawigacja, formularze, lightbox, consent mapy, cookies).
- Architektura stylów oparta o moduły CSS importowane przez `css/style.css`.
- Skrypty jakości i procesu release w katalogu `scripts/`.
- Ustawienia PostCSS w `postcss.config.js`, konfiguracja deployu w `netlify.toml`.

### 13. Roadmapa

- Dodać automatyczne uruchamianie `check:html` i `qa:a11y` w CI.
- Rozszerzyć testy regresji dla kluczowych interakcji UI (formularz, menu, lightbox).
- Ujednolicić proces publikacji `sitemap.xml` z przekazywaniem `SITE_URL` w pipeline deploy.
- Dodać statyczną analizę JS/CSS (lint) do workflow developerskiego.
- Rozbudować dokumentację techniczną modułów `js/modules/*` o kontrakty wejść/wyjść.

### 14. Licencja

MIT (zgodnie z `package.json`).

---

## 🇬🇧 English version

### 1. Project Overview

SolidCraft is a static website for a construction and renovation company. The project includes a homepage, service subpages, legal pages, a 404 page, an offline page, and a form submission confirmation page.

### 2. Key Features

- Multi-section homepage (services, projects, testimonials, FAQ, contact).
- Service subpages in the `oferta/` directory.
- Contact form with Netlify Forms integration (`data-netlify`, `bot-field` honeypot) and client-side validation (including phone number formatting/masking).
- Expandable navigation and mobile menu with keyboard handling (`Esc`, focus trap, `aria-expanded`).
- Light/dark theme toggle with pre-render theme initialization.
- Gallery/offer lightbox with keyboard support and modal dialog semantics.
- Cookie banner persisted in `localStorage`.
- PWA layer: `manifest.webmanifest`, `sw.js`, Service Worker registration.
- `sitemap.xml` generation/maintenance and `robots.txt` presence.

### 3. Tech Stack

- HTML5 (static multi-page structure).
- CSS (modular architecture via `@import`: tokens/base/layout/components/sections/utilities).
- Vanilla JavaScript (ES modules).
- Node.js + npm.
- Tooling: PostCSS (`postcss-import`, `postcss-preset-env`, `autoprefixer`, `cssnano`), esbuild, live-server, Prettier, sharp.
- Developer QA/tooling: Playwright + axe-core (a11y audit script), link and asset validation scripts.
- Hosting configuration: Netlify (`netlify.toml`, `_headers`, `_redirects`).

### 4. Project Structure

- `index.html` — homepage.
- `oferta/*.html` — service pages.
- `doc/*.html` — legal pages.
- `thank-you/index.html`, `404.html`, `offline.html` — auxiliary/system pages.
- `css/style.css` + `css/modules/*` — style sources.
- `js/script.js` + `js/modules/*` — UI logic and interactive features.
- `js/theme-init.js`, `js/sw-register.js`, `sw.js` — theme bootstrap and PWA.
- `scripts/*` — build, QA, and automation scripts.

### 5. Setup and Installation

```bash
npm install
```

### 6. Local Development

```bash
npm run dev
npm run watch:css
npm run watch:js
npm run check:html
npm run qa:a11y
```

### 7. Production Build

```bash
npm run build
npm run build:dist
```

- `npm run build` generates minified assets: `css/style.min.css` and `js/script.min.js`.
- `npm run build:dist` prepares the `dist/` directory, copies runtime files, and rewrites HTML references to minified assets.

### 8. Deployment

- The repository contains Netlify deployment configuration:
  - `netlify.toml`: build command `npm run build`, publish directory `dist`.
  - `_headers`: security headers (including CSP, HSTS, X-Frame-Options).
  - `_redirects`: 301 redirects and fallback `/* -> /404.html 404`.

### 9. Accessibility

- Skip link (`Pomiń do treści`).
- ARIA attributes and navigation states (`aria-expanded`, `aria-controls`, `aria-modal`).
- Keyboard support for navigation, dropdown, lightbox, and cookie banner.
- Form status messaging through live regions (`aria-live`, `role=status`).
- Dedicated a11y audit script (`npm run qa:a11y`) powered by axe-core.

### 10. SEO

- SEO meta tags in HTML documents (title, description, canonical, robots).
- Open Graph and Twitter Cards.
- Inline JSON-LD structured data.
- `robots.txt` and `sitemap.xml`.
- Sitemap generation script (`npm run build:sitemap`, requires `SITE_URL`).

### 11. Performance

- CSS/JS minification (PostCSS + esbuild).
- Image processing into multiple formats/sizes through `images.js` (AVIF/WebP/JPG).
- Preload for key assets (fonts, hero image).
- Lazy loading for selected resources.
- Service Worker with runtime cache and offline fallback (`offline.html`).

### 12. Project Maintenance

- Front-end bootstrap/orchestration: `js/script.js`.
- Domain logic split under `js/modules/` (navigation, forms, lightbox, map consent, cookies).
- CSS architecture based on modular files imported via `css/style.css`.
- Quality/release scripts in `scripts/`.
- PostCSS config in `postcss.config.js`, deployment config in `netlify.toml`.

### 13. Roadmap

- Add automatic `check:html` and `qa:a11y` execution in CI.
- Extend regression tests for key UI interactions (form, menu, lightbox).
- Standardize `sitemap.xml` publishing with `SITE_URL` passed in the deployment pipeline.
- Add JS/CSS static analysis (linting) to the developer workflow.
- Expand technical docs for `js/modules/*` with explicit input/output contracts.

### 14. License

MIT (as defined in `package.json`).
