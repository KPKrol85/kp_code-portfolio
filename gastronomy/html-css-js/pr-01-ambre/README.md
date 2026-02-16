# Ambre — Audytowany projekt portfolio front-end

## 🇵🇱 Wersja polska

## Przegląd projektu
Ambre to wielostronicowy serwis internetowy dla restauracji (HTML + modularny CSS + Vanilla JS) z wdrożonymi elementami PWA (manifest, Service Worker, strona offline) oraz konfiguracją pod wdrożenie na Netlify.

## Kluczowe funkcje (wyłącznie wykryte w kodzie)
- Wielostronicowa struktura: `index.html`, `menu.html`, `galeria.html`, strony prawne i `404.html`.
- Nawigacja desktop/mobile z menu hamburgerowym i `aria-expanded`.
- Przełącznik motywu jasny/ciemny (`data-theme`, `localStorage`).
- Filtrowanie menu i galerii, lightbox, sekcje FAQ typu accordion.
- Formularz rezerwacji z walidacją po stronie klienta i polem honeypot.
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`, rejestracja SW.
- Build i QA oparte o npm scripts (PostCSS, esbuild, link checker, linting).

## Tech stack
- HTML5
- CSS3 (modularna architektura: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript ES Modules (Vanilla JS)
- Node.js tooling: PostCSS, cssnano, esbuild, ESLint, Stylelint, html-validate
- Netlify (`_headers`, `_redirects`)

## Struktura projektu
- `css/base/` — tokeny i typografia.
- `css/layout/` — warstwa layoutu (header/footer).
- `css/components/` — komponenty UI.
- `css/pages/` — style stron specyficznych.
- `js/modules/` — moduły funkcjonalne.
- `scripts/` — automatyzacja QA i optymalizacji obrazów.

## Uruchomienie lokalne
```bash
npm install
npm run build
```

Dostępne są też skrypty watch (`watch:css`, `watch:js`) oraz pakiet kontroli jakości (`npm run qa`).

## Build i deployment
- Produkcyjnie HTML ładuje bundlowane pliki: `/css/style.min.css`, `/js/script.min.js`.
- `_headers` definiuje polityki bezpieczeństwa (m.in. CSP, HSTS, Permissions-Policy).
- `_redirects` mapuje krótkie ścieżki (`/menu`, `/galeria`, itp.) i fallback `/* -> /404.html`.

## Dostępność (stan obecny)
- Obecne: skip link, focus-visible, semantyczne nagłówki, `aria-current`/`aria-expanded`, fallback `.no-js`.
- Ograniczenia: formularz rezerwacji nie ma akcji serwerowej i przy wyłączonym JS nie realizuje submitu.

## SEO (stan obecny)
- Obecne: canonical, `og:*`, Twitter Card, `robots.txt`, `sitemap.xml`, JSON-LD na stronach głównych.
- Ograniczenia: pole `email` w JSON-LD i linki `mailto:` używają nieprawidłowego formatu adresu.

## Wydajność (stan obecny)
- Obecne: obrazy AVIF/WebP + JPEG fallback, `loading="lazy"`, preload fontów, minifikacja CSS/JS.
- Ograniczenia: wykryty 1 błąd ścieżki zasobu w `404.html` (`href=/css/style.min.css"`).

## Roadmap
- Naprawa krytycznych błędów ścieżek i danych kontaktowych.
- Fallback serwerowy dla formularza (progressive enhancement).
- Uporządkowanie pozostałości debugowych JS.
- Dalsza standaryzacja architektury BEM.

## Licencja
MIT (zgodnie z `package.json`).

---

## 🇬🇧 English version

## Project overview
Ambre is a multi-page website for a restaurant (HTML + modular CSS + Vanilla JS) enhanced with PWA features (manifest, Service Worker, offline page) and configured for Netlify deployment.

## Key features (only detected in code)
- Multi-page structure: `index.html`, `menu.html`, `galeria.html`, legal pages, and `404.html`.
- Desktop/mobile navigation with hamburger toggle and `aria-expanded`.
- Light/dark theme switcher (`data-theme`, `localStorage`).
- Menu and gallery filtering, lightbox, accordion-based FAQ.
- Reservation form with client-side validation and honeypot field.
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`, SW registration.
- Build and QA via npm scripts (PostCSS, esbuild, link checker, linting).

## Tech stack
- HTML5
- CSS3 (modular architecture: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript ES Modules (Vanilla JS)
- Node.js tooling: PostCSS, cssnano, esbuild, ESLint, Stylelint, html-validate
- Netlify (`_headers`, `_redirects`)

## Project structure
- `css/base/` — tokens and typography.
- `css/layout/` — layout layer (header/footer).
- `css/components/` — UI components.
- `css/pages/` — page-specific styles.
- `js/modules/` — feature modules.
- `scripts/` — QA and image optimization automation.

## Setup and run
```bash
npm install
npm run build
```

Watch scripts (`watch:css`, `watch:js`) and QA command (`npm run qa`) are available.

## Build and deployment notes
- Production HTML loads bundled assets: `/css/style.min.css`, `/js/script.min.js`.
- `_headers` defines security policies (including CSP, HSTS, Permissions-Policy).
- `_redirects` maps short paths (`/menu`, `/galeria`, etc.) and fallback `/* -> /404.html`.

## Accessibility notes (current state)
- Present: skip link, focus-visible, semantic headings, `aria-current`/`aria-expanded`, `.no-js` baseline.
- Limitation: reservation form has no server action and does not submit when JavaScript is disabled.

## SEO notes (current state)
- Present: canonical, `og:*`, Twitter Card, `robots.txt`, `sitemap.xml`, JSON-LD on key pages.
- Limitation: JSON-LD `email` and `mailto:` links use an invalid address format.

## Performance notes (current state)
- Present: AVIF/WebP + JPEG fallback, `loading="lazy"`, font preloads, minified CSS/JS.
- Limitation: one broken asset path detected in `404.html` (`href=/css/style.min.css"`).

## Roadmap
- Fix critical path and contact data issues.
- Add server fallback for form submission (progressive enhancement).
- Remove JS debug leftovers.
- Continue BEM consistency standardization.

## License
MIT (as declared in `package.json`).
