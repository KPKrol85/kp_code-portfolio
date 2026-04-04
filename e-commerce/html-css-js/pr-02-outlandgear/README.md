# Outland Gear — Dokumentacja projektu (PL)

## Przegląd projektu
Outland Gear to statyczny serwis front-end e-commerce (wielostronicowy), oparty na HTML/CSS/ES Modules, z danymi produktów ładowanymi z plików JSON oraz dynamicznym renderowaniem listy, karty produktu i koszyka. Dowód: `package.json` (narzędzia build), `js/app.js` (bootstrap modułów), `data/products.json` i `data/categories.json` (źródła danych).

## Kluczowe funkcje (wyłącznie wykryte w repo)
- Wielostronicowa nawigacja: strona główna, kategoria, produkt, koszyk, checkout, kontakt, o nas, regulamin, polityka prywatności. (np. `index.html`, `kategoria.html`, `produkt.html`, `koszyk.html`, `checkout.html`).
- Dynamiczne komponenty JS:
  - katalog + filtrowanie/sortowanie (`js/modules/catalog.js`),
  - karta produktu + mini-galeria (`js/modules/product.js`),
  - koszyk z localStorage (`js/modules/cart.js`, `js/modules/storage.js`),
  - formularze checkout/kontakt z walidacją (`js/modules/checkout.js`, `js/modules/contact.js`, `js/modules/form-ux.js`).
- Obsługa partials dla nagłówka/stopki z fallbackiem HTML (`js/modules/partials.js`, `partials/header.html`, `partials/footer.html`).
- Podstawowe fallbacki no-JS na wybranych stronach (`kategoria.html`, `produkt.html`, `koszyk.html` sekcje `<noscript>`).

## Stack technologiczny
- HTML5 (statyczne podstrony).
- CSS z podziałem na tokeny, base, layout, komponenty, strony (`css/main.css` + importy).
- JavaScript ES Modules (`js/app.js` + `js/modules/*`).
- Build: PostCSS (`postcss-import`, `cssnano`) i esbuild (`package.json`, `postcss.config.js`).

## Struktura projektu
- `css/` — tokeny, baza, layout, komponenty, style per-page.
- `js/` — entrypoint aplikacji i moduły domenowe.
- `data/` — dane katalogowe JSON.
- `partials/` — współdzielony header/footer.
- `assets/svg/` — grafiki SVG.
- `scripts/` — narzędzia pomocnicze (`optimize-images.mjs`).

## Setup i uruchomienie
1. Zainstaluj zależności: `npm install`.
2. Development (watch):
   - `npm run watch:css`
   - `npm run watch:js`
3. Build produkcyjny: `npm run build`.
4. Podgląd builda produkcyjnego: `npm run build:preview`.

## Uwagi build / deployment
- Produkcyjny build generuje pełny deploy-ready katalog `dist/`.
- Minifikowane CSS i JS są zapisywane wyłącznie do `dist/css/main.min.css` i `dist/js/app.min.js`.
- Build inlinuje `partials/header.html` i `partials/footer.html` do HTML w `dist`, więc output nie wymaga runtime fetchowania partials.
- W repo obecne są `robots.txt` i `sitemap.xml`.
- Nie wykryto plików konfiguracyjnych hostingu typu `_headers`, `_redirects`, `netlify.toml`, `vercel.json`.
- Nie wykryto `manifest.webmanifest` ani rejestracji service workera.

## Uwagi dostępności (A11y)
- Jest skip link (`.skip-link`) i cel `#main` na stronach.
- Widoczne style `:focus-visible` w bazowym CSS.
- Nawigacja mobilna zawiera focus trap i powrót focusu po zamknięciu drawer.
- Dropdown/nav korzysta z `aria-expanded`, `aria-hidden`, `aria-controls`; aktywny link ustawiany przez `aria-current`.
- Jest wsparcie `prefers-reduced-motion` przez tokeny czasów animacji i `scroll-behavior`.
- Część stron ma fallback no-JS, ale checkout i kontakt są oparte o JS (`preventDefault`) i nie mają dedykowanego `<noscript>` workflow.

## Uwagi SEO
- Wykryte: `meta description`, canonical, Open Graph, Twitter Card, robots meta, `robots.txt`, `sitemap.xml`, JSON-LD.
- `og:url` jest spójne z canonical na analizowanych podstronach.
- OG image wskazuje na istniejący asset SVG (`assets/svg/social-share-placeholder.svg`).

## Uwagi wydajności
- Obrazy mają zdefiniowane `width`/`height` w wielu miejscach.
- Miniatury i obrazy renderowane dynamicznie używają `loading="lazy"` i `decoding="async"` (dla dynamicznie tworzonych `<img>`).
- Brak preloadu fontów i brak self-hostowanych plików fontów (użyte fallbackowe stacki rodzin fontów w tokenach).
- W repo współistnieją source + minified assety CSS/JS (decyzja build/deploy).

## Roadmap (rekomendowana na podstawie audytu)
- Ujednolicić strategię assetów produkcyjnych (source vs minified w HTML).
- Dodać no-JS fallback dla checkout/kontakt lub endpoint `action`.
- Rozszerzyć SEO structured data dla stron produktowych (`Product` schema).
- Dodać politykę linków zewnętrznych (`rel="noopener noreferrer"` dla nowych kart).
- Rozważyć manifest + SW tylko jeśli jest realny plan offline/PWA.

## Licencja
- Plik licencji nie został wykryty w repozytorium.

---

# Outland Gear — Project Documentation (EN)

## Project overview
Outland Gear is a static multi-page e-commerce front-end built with HTML/CSS/ES Modules. Product/category data is loaded from JSON files, while listing/product/cart experiences are rendered/enhanced via JavaScript modules.

## Key implemented features (repository-evidenced)
- Multi-page structure: home, category, product, cart, checkout, contact, about, terms, privacy.
- JS domain modules for catalog filtering, product view, cart state, checkout/contact form UX.
- Partial header/footer loading with graceful fallback.
- No-JS fallback content on selected pages (category/product/cart).

## Tech stack
- HTML5 static pages.
- Modular CSS architecture (`tokens`, `base`, `layout`, `components`, `pages`).
- JavaScript ES Modules.
- Build tooling: PostCSS + esbuild.

## Project structure overview
- `css/` styling layers.
- `js/` app entry and feature modules.
- `data/` JSON datasets.
- `partials/` shared HTML fragments.
- `assets/svg/` visual assets.
- `scripts/` utility scripts.

## Setup & run
1. `npm install`
2. Run watchers: `npm run watch:css` and `npm run watch:js`
3. Production build: `npm run build`
4. Preview the production build: `npm run build:preview`

## Build/deployment notes
- `dist/` is the only deploy-ready output.
- Built HTML in `dist` references `css/main.min.css` and `js/app.min.js`.
- Source files remain the editable development baseline.
- `robots.txt` and `sitemap.xml` are present.
- No `_headers`, `_redirects`, `netlify.toml`, or `vercel.json` detected.
- No PWA manifest or service worker registration detected.

## Accessibility notes
- Skip links + landmark targeting are present.
- Focus-visible styling exists in base CSS.
- Mobile drawer includes keyboard focus management and Escape handling.
- ARIA state attributes are used for nav/dropdown interactions.
- Reduced-motion handling is present via media query token overrides.
- Checkout/contact currently rely on JS submit interception and do not provide dedicated no-JS workflows.

## SEO notes
- Description, canonical, OG/Twitter metadata, robots directives, sitemap, and JSON-LD are present.
- Canonical and `og:url` alignment appears consistent on sampled pages.

## Performance notes
- Many images include explicit dimensions.
- Lazy loading is present on gallery/thumb and dynamic listing/cart imagery.
- No explicit font preloading strategy detected.
- Source and minified assets coexist in repository.

## Roadmap
- Align production asset-loading strategy.
- Improve no-JS baseline for form submissions.
- Add product-specific structured data.
- Harden external-link security defaults.
- Add PWA surface only if product scope requires it.

## License
- No license file detected in repository.
