# Volt Garage

## PL

### Przegląd projektu
Volt Garage to statyczny, wielostronicowy front-end e-commerce o charakterze demonstracyjnym. Repozytorium zawiera źródła HTML/CSS/Vanilla JS, lokalny katalog produktów zasilany z JSON, prosty koszyk oparty o `localStorage`, stronę kontaktową z atrybutami Netlify Forms oraz pipeline budujący gotowy pakiet `dist/`.

### Kluczowe funkcje
- Wielostronicowa struktura serwisu: strona główna, sklep, produkt, kolekcje, promocje, kontakt, checkout, koszyk, strony prawne, statusy `404` i `offline`.
- Dynamiczne renderowanie kart produktów i szczegółów produktu z danych w [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json).
- Filtrowanie, wyszukiwanie i sortowanie katalogu na stronie sklepu.
- Koszyk przechowywany lokalnie w przeglądarce.
- Przełączanie motywu `light` / `dark` z preloadem motywu przed załadowaniem CSS.
- PWA baseline: `site.webmanifest`, Service Worker, strona offline, prompt instalacji i komunikaty o aktualizacji.
- Wstrzykiwanie JSON-LD dla breadcrumbs, list produktów i strony produktu.
- Składanie HTML z partiali `src/partials/*` podczas budowy `dist/`.

### Stack technologiczny
- HTML5
- CSS z podziałem na partiale i tokeny projektowe
- Vanilla JavaScript (ES modules)
- Node.js 18+
- PostCSS + `postcss-import` + `cssnano`
- esbuild
- html-validate, ESLint, Stylelint, Prettier

### Struktura projektu
- [index.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/index.html), [404.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/404.html), [offline.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/offline.html), [thank-you.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/thank-you.html): główne entry pointy.
- [pages/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/pages): podstrony funkcjonalne i prawne.
- [src/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/src/partials): partiale nagłówka i stopki włączane do buildu `dist/`.
- [css/main.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.css) + [css/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/partials): warstwa stylów.
- [js/main.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.js) + [js/ui/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/ui) + [js/features/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/features): bootstrap aplikacji, moduły UI i funkcje domenowe.
- [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json): dane katalogowe.
- [scripts/build-dist.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/scripts/build-dist.js): składanie `dist/`.

### Instalacja i uruchomienie
```bash
npm install
```

Tryb lokalnego podglądu gotowego buildu:
```bash
npm run build
npm run preview
```

Szybki pakiet QA:
```bash
npm run qa
```

Przydatne pojedyncze komendy:
```bash
npm run qa:html
npm run qa:js
npm run qa:css
npm run validate:jsonld
npm run qa:links
```

### Notatki build / deployment
- `npm run build:css` tworzy [css/main.min.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.min.css).
- `npm run build:js` tworzy [js/main.min.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.min.js).
- `npm run build:dist` kopiuje wymagane zasoby, rozwija partiale HTML i podmienia odwołania z wersji źródłowych na `.min.*` w `dist/`.
- Konfiguracja hostingowa jest przygotowana pod statyczny deployment z [\_headers](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_headers) i [\_redirects](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_redirects).

### Dostępność
- Skip link do `#main` jest obecny w partialu nagłówka.
- Styl `:focus-visible` i tryb klawiaturowy są zaimplementowane w CSS/JS.
- Nawigacja mobilna i dropdowny obsługują `aria-expanded`, `aria-current` i zamykanie klawiszem `Escape`.
- Animacje respektują `prefers-reduced-motion`.
- Formularze mają walidację kliencką z komunikatami ARIA.
- No-JS baseline jest częściowo zachowany: treści statyczne, fallbacki list produktów i strona kontaktowa pozostają używalne.

### SEO
- Każda główna podstrona ma `title`, `meta description`, canonical i Open Graph.
- Strona główna zawiera statyczne JSON-LD `OnlineStore` i `WebSite`.
- Breadcrumbs, `ItemList` i `Product` JSON-LD są uzupełniane przez JavaScript tam, gdzie to potrzebne.
- Repozytorium zawiera [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt), [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml) i [humans.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/humans.txt).

### Wydajność
- Obrazy produktów i hero korzystają z `picture`, AVIF/WebP, `loading`, `decoding` i zadanych wymiarów.
- Fonty mają `font-display: swap`.
- Motyw jest ustalany przed załadowaniem CSS, co ogranicza flash motywu.
- Service Worker dodaje cache dla HTML, assetów i offline fallback.
- Dist używa zminifikowanych bundle’i CSS/JS.

### Roadmap
- Ujednolicić publiczne mapowanie tras między HTML, `sitemap.xml`, `site.webmanifest` i skryptami QA.
- Rozważyć statyczne strony produktowe lub pre-render dla SEO produktowego.
- Doprecyzować produkcyjne zachowanie checkoutu albo wyraźniej oznaczyć go jako flow demonstracyjny.
- Dodać spójne testy regresyjne dla manifestu, sitemap i route inventory.
- Rozszerzyć dokumentację operacyjną wokół build/deploy/QA.

### Licencja
Brak pliku `LICENSE` w repozytorium.

---

## EN

### Project overview
Volt Garage is a static multi-page e-commerce front-end with a demonstrational character. The repository contains HTML/CSS/Vanilla JS sources, a local JSON-backed product catalog, a `localStorage` cart, a contact page prepared for Netlify Forms, and a build pipeline that assembles a production-ready `dist/` package.

### Key features
- Multi-page site structure: homepage, shop, product, collections, promotions, contact, checkout, cart, legal pages, `404`, and `offline`.
- Dynamic product cards and product detail rendering from [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json).
- Catalog filtering, search, and sorting on the shop page.
- Browser-local cart storage.
- `light` / `dark` theme switching with a pre-CSS theme preload snippet.
- PWA baseline: `site.webmanifest`, Service Worker, offline page, install CTA, and update notifications.
- JSON-LD injection for breadcrumbs, item lists, and product pages.
- HTML partial assembly from `src/partials/*` during `dist/` packaging.

### Tech stack
- HTML5
- CSS with partials and design tokens
- Vanilla JavaScript (ES modules)
- Node.js 18+
- PostCSS + `postcss-import` + `cssnano`
- esbuild
- html-validate, ESLint, Stylelint, Prettier

### Structure overview
- [index.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/index.html), [404.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/404.html), [offline.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/offline.html), [thank-you.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/thank-you.html): primary entry points.
- [pages/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/pages): feature and legal subpages.
- [src/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/src/partials): header/footer partials expanded during build.
- [css/main.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.css) + [css/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/partials): styling layer.
- [js/main.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.js) + [js/ui/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/ui) + [js/features/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/features): app bootstrap, UI modules, and feature logic.
- [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json): catalog data.
- [scripts/build-dist.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/scripts/build-dist.js): `dist/` assembly pipeline.

### Setup & run
```bash
npm install
```

Preview the built package locally:
```bash
npm run build
npm run preview
```

Run the main QA bundle:
```bash
npm run qa
```

Useful individual commands:
```bash
npm run qa:html
npm run qa:js
npm run qa:css
npm run validate:jsonld
npm run qa:links
```

### Build / deployment notes
- `npm run build:css` outputs [css/main.min.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.min.css).
- `npm run build:js` outputs [js/main.min.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.min.js).
- `npm run build:dist` copies required assets, expands HTML partials, and rewrites source asset references to minified bundles inside `dist/`.
- Hosting headers and redirect rules are provided in [\_headers](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_headers) and [\_redirects](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_redirects).

### Accessibility notes
- A skip link to `#main` is present in the header partial.
- `:focus-visible` styling and keyboard mode handling are implemented.
- Mobile navigation and dropdowns use `aria-expanded`, `aria-current`, and `Escape` handling.
- Motion is reduced when `prefers-reduced-motion` is enabled.
- Forms include client-side validation with ARIA status/error messaging.
- The no-JS baseline is partially preserved: static content, product-list fallback messages, and the contact page remain usable.

### SEO notes
- Main pages include `title`, `meta description`, canonical, and Open Graph tags.
- The homepage ships static `OnlineStore` and `WebSite` JSON-LD.
- Breadcrumb, `ItemList`, and `Product` JSON-LD are injected by JavaScript where needed.
- The repo includes [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt), [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml), and [humans.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/humans.txt).

### Performance notes
- Hero and product images use `picture`, AVIF/WebP, `loading`, `decoding`, and explicit dimensions.
- Fonts use `font-display: swap`.
- Theme selection runs before CSS loads, reducing theme flash.
- The Service Worker adds HTML, asset, and offline caching.
- The production package references minified CSS/JS bundles.

### Roadmap
- Align public route inventory across HTML, `sitemap.xml`, `site.webmanifest`, and QA scripts.
- Consider static product pages or pre-rendering for stronger product SEO.
- Clarify or harden checkout behavior for a production use case.
- Add regression checks for manifest, sitemap, and route consistency.
- Expand operational documentation around build, deploy, and QA.

### License
No `LICENSE` file was detected in the repository.
