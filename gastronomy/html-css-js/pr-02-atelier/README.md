# Atelier No.02 — dokumentacja projektu

## PL

### Przegląd projektu
Atelier No.02 to wielostronicowy serwis portfolio restauracji fine dining zbudowany w HTML, CSS i JavaScript (bez frameworka). Projekt zawiera strony: główną, o nas, menu, galerię, dokumenty prawne oraz stronę 404/offline.

### Kluczowe funkcje (potwierdzone w implementacji)
- Architektura CSS oparta o warstwy `base`, `layout`, `components`, `pages`, `utilities` oraz tokeny w `css/base/tokens.css`.
- Metodologia nazewnictwa BEM w komponentach (`.nav__item`, `.menu-card__title`, `.footer__social` itd.).
- Responsywne obrazy (`picture`, AVIF/WebP/JPG) z `srcset`, `sizes`, `loading`, `decoding` i wymiarami `width/height`.
- Formularz kontaktowy przygotowany pod Netlify Forms (`data-netlify="true"`, honeypot, walidacja po stronie klienta).
- Nawigacja mobilna z obsługą klawiatury, focus trap, `aria-expanded` i `aria-controls`.
- Tryb jasny/ciemny z zapisem preferencji użytkownika.
- Service Worker z fallbackiem offline (`offline.html`) i pre-cache wybranych zasobów.
- Meta SEO, Open Graph, Twitter Cards, robots, sitemap i JSON-LD na podstronach.

### Tech stack
- HTML5
- CSS3 + PostCSS (`postcss-import`, `cssnano`)
- JavaScript ES modules + `esbuild`
- `sharp` + własny skrypt do obróbki obrazów
- `http-server` do lokalnego podglądu

### Struktura projektu (skrót)
- `css/` — style źródłowe (modułowe)
- `js/` — moduły funkcjonalne aplikacji
- `assets/` + `assets/img-optimized/` — media i ikony
- `data/menu.json` — dane menu
- `sw.js`, `manifest.webmanifest`, `_headers`, `_redirects` — warstwa PWA/deploy

### Instalacja i uruchomienie
```bash
npm install
npm run build
npm run dev:server
```
Domyślny serwer lokalny: `http://localhost:5173`.

### Build i wdrożenie
- Bundle CSS/JS jest generowany lokalnie (`css/style.min.css`, `js/script.min.js`).
- Konfiguracja deploy jest przygotowana pod Netlify (`_headers`, `_redirects`).
- Manifest i service worker są ładowane z roota serwisu.

### Dostępność (stan obecny)
- Zaimplementowano skip link, widoczne style `:focus-visible`, semantyczne sekcje i nagłówki.
- Nawigacja mobilna obsługuje `Escape`, pułapkę fokusu i zamykanie poza obszarem menu.
- Obsługa `prefers-reduced-motion` jest obecna w JS/CSS dla animacji.
- W trybie bez JS treść bazowa jest dostępna, a użytkownik otrzymuje komunikat `noscript`.

### SEO (stan obecny)
- Każda główna podstrona posiada canonical, `meta description`, `robots`, Open Graph i JSON-LD.
- `robots.txt` wskazuje `sitemap.xml`, a sitemap zawiera publiczne URL-e serwisu.

### Wydajność (stan obecny)
- Obrazy są dostarczane w nowoczesnych formatach i wariantach rozdzielczości.
- Fonty ładowane są jako WOFF2 z `font-display: swap`.
- Zastosowano preload fontów oraz obrazu hero na stronie głównej.

### Roadmap
- Podmiana przykładowego linku mapy (`maps.example.com`) na docelowy adres produkcyjny.
- Ograniczenie/standaryzacja logowania diagnostycznego w inline rejestracji SW.
- Dalsze porządki metadanych SEO dla stron specjalnych (np. 404).
- Rozszerzenie testów automatycznych o walidację linków i schematu JSON-LD.
- Opcjonalna integracja polityki cookies z realnym CMP.

### Licencja
MIT (zgodnie z `package.json`).

---

## EN

### Project overview
Atelier No.02 is a multi-page fine-dining portfolio website built with HTML, CSS, and JavaScript (no framework). The project includes home, about, menu, gallery, legal pages, plus 404/offline pages.

### Key features (implementation-backed)
- Modular CSS architecture with `base`, `layout`, `components`, `pages`, `utilities`, and design tokens in `css/base/tokens.css`.
- BEM naming convention across UI blocks (`.nav__item`, `.menu-card__title`, `.footer__social`, etc.).
- Responsive images (`picture`, AVIF/WebP/JPG) with `srcset`, `sizes`, `loading`, `decoding`, and explicit `width/height`.
- Contact form prepared for Netlify Forms (`data-netlify="true"`, honeypot, client-side validation).
- Mobile navigation with keyboard support, focus trap, `aria-expanded`, and `aria-controls`.
- Light/dark theme toggle with persisted user preference.
- Service Worker with offline fallback (`offline.html`) and pre-cached assets.
- SEO metadata, Open Graph, Twitter Cards, robots, sitemap, and JSON-LD across pages.

### Tech stack
- HTML5
- CSS3 + PostCSS (`postcss-import`, `cssnano`)
- JavaScript ES modules + `esbuild`
- `sharp` + custom image processing script
- `http-server` for local preview

### Project structure (short)
- `css/` — modular source styles
- `js/` — application feature modules
- `assets/` + `assets/img-optimized/` — media and icons
- `data/menu.json` — menu data source
- `sw.js`, `manifest.webmanifest`, `_headers`, `_redirects` — PWA/deployment layer

### Setup & run
```bash
npm install
npm run build
npm run dev:server
```
Default local server: `http://localhost:5173`.

### Build and deployment notes
- CSS/JS bundles are generated locally (`css/style.min.css`, `js/script.min.js`).
- Deployment configuration is prepared for Netlify (`_headers`, `_redirects`).
- Manifest and service worker are loaded from the site root.

### Accessibility notes (current state)
- Skip link, visible `:focus-visible` states, semantic sections, and heading structure are implemented.
- Mobile nav supports `Escape`, focus trapping, and outside-click closing.
- `prefers-reduced-motion` handling is present in JS and CSS.
- Baseline content remains usable without JavaScript, with a `noscript` notice.

### SEO notes (current state)
- Each main page includes canonical, `meta description`, `robots`, Open Graph, and JSON-LD.
- `robots.txt` references `sitemap.xml`, and sitemap contains public URLs.

### Performance notes (current state)
- Images are served in modern formats with multiple size variants.
- Fonts are WOFF2 and use `font-display: swap`.
- Font preload and hero image preload are implemented on the homepage.

### Roadmap
- Replace placeholder map URL (`maps.example.com`) with a production map destination.
- Reduce/standardize diagnostic logging in inline SW registration.
- Tighten SEO metadata for special pages (e.g., 404).
- Add automated checks for link integrity and JSON-LD validity.
- Optionally connect cookie policy to a real CMP solution.

### License
MIT (as declared in `package.json`).
