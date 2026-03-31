# Volt Garage

## PL

### Przegląd projektu
Volt Garage to showcase-only front-end dla sklepu z akcesoriami motoryzacyjnymi. Repozytorium prezentuje statyczny, wielostronicowy serwis zbudowany w HTML, CSS i Vanilla JS, z lokalnym katalogiem produktów, koszykiem opartym o `localStorage`, podstawą PWA oraz pipeline'em budującym pakiet `dist/`.

Projekt symuluje realistyczną implementację komercyjnej strony e-commerce, ale nie zawiera backendu zamówień, SSR ani serwerowego checkoutu. Ten zakres jest zgodny z obecną implementacją i dokumentacją w kodzie źródłowym.

### Kluczowe funkcje
- Wielostronicowa struktura serwisu: strona główna, sklep, produkt, kolekcje, nowości, promocje, kontakt, koszyk, checkout, strony prawne, `404`, `offline`, `thank-you`.
- Dynamiczne renderowanie list produktów i strony produktu z [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json).
- Filtrowanie, sortowanie i wyszukiwanie katalogu na stronie sklepu.
- Koszyk zapisany lokalnie w przeglądarce.
- Przełączanie motywu `light` / `dark` z preloadem ustawianym przed załadowaniem CSS.
- PWA baseline: [site.webmanifest](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/site.webmanifest), Service Worker, ekran offline, prompt instalacji i komunikaty o aktualizacji.
- JSON-LD dla strony głównej oraz dynamiczne wstrzykiwanie breadcrumbs, `ItemList` i `Product`.
- Build `dist/` z rozwijaniem partiali HTML i podmianą assetów na zminifikowane bundle'e.

### Stack technologiczny
- HTML5
- CSS z partialami i tokenami projektowymi
- Vanilla JavaScript (ES modules)
- Node.js `>=18`
- PostCSS (`postcss-import`, `cssnano`)
- esbuild
- html-validate, ESLint, Stylelint, Prettier

### Struktura projektu
- [index.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/index.html), [404.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/404.html), [offline.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/offline.html), [thank-you.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/thank-you.html): główne entry pointy.
- [pages/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/pages): podstrony funkcjonalne i prawne.
- [src/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/src/partials): partiale nagłówka i stopki rozwijane podczas buildu `dist/`.
- [css/main.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.css) + [css/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/partials): warstwa stylów.
- [js/main.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.js) + [js/features/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/features) + [js/ui/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/ui): bootstrap aplikacji, logika domenowa i moduły UI.
- [scripts/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/scripts): build, preview i skrypty QA.
- [dist/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/dist): generowany pakiet deploymentowy.

### Setup i uruchomienie
Instalacja zależności:

```bash
npm install
```

Lokalny build i podgląd:

```bash
npm run build
npm run preview
```

Pełny pakiet QA:

```bash
npm run qa
```

Przydatne pojedyncze komendy:

```bash
npm run qa:html
npm run qa:js
npm run qa:css
npm run qa:links
npm run validate:jsonld
```

### Build i deployment
- `build:css` tworzy [css/main.min.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.min.css).
- `build:js` tworzy [js/main.min.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.min.js).
- `build:dist` składa finalne HTML z partiali i podmienia odwołania do assetów na zminifikowane odpowiedniki.
- Hosting statyczny jest wspierany przez [\_headers](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_headers), [\_redirects](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_redirects), [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt) i [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml).

### Dostępność
- W nagłówku działa skip link do `#main`.
- Styl `:focus-visible` i tryb klawiaturowy są widoczne w warstwie CSS/JS.
- Nawigacja mobilna i dropdowny używają natywnych przycisków oraz atrybutów `aria-expanded`.
- Modal projektu ma focus trap i zamykanie klawiszem `Escape`.
- Animacje respektują `prefers-reduced-motion`.
- No-JS baseline jest częściowo zachowany, ale strona produktu i część zachowań checkoutu nadal zależą od JavaScript.

### SEO
- Główne strony mają `title`, `meta description`, canonical i Open Graph.
- Strona główna zawiera statyczne JSON-LD typu `OnlineStore` i `WebSite`.
- Breadcrumbs, `ItemList` i `Product` JSON-LD są wstrzykiwane tam, gdzie logika jest oparta o dane produktowe.
- Repozytorium zawiera aktualne [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml), [site.webmanifest](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/site.webmanifest), [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt) i asset OG.

### Wydajność
- Obrazy używają `picture`, AVIF/WebP, `loading`, `decoding` i jawnych wymiarów.
- Fonty są ładowane z `font-display: swap`.
- Motyw jest rozstrzygany przed załadowaniem CSS, co ogranicza flash motywu.
- Service Worker jest rejestrowany warunkowo i zapewnia offline fallback.
- Pakiet `dist/` korzysta ze zminifikowanych bundle'i CSS i JS.

### Roadmap
- Ograniczyć zależność strony produktu od runtime JS przez pre-render lub statyczne warianty produktowe.
- Jaśniej oznaczyć showcase-only charakter checkoutu w samym flow użytkownika.
- Dodać automatyczne testy spójności dla `sitemap.xml`, `site.webmanifest` i list tras QA.
- Zaostrzyć CSP i ograniczyć zależność od `'unsafe-inline'`.
- Rozszerzyć dokumentację release/QA o checklistę dla buildów i publicznych metadanych.

### Licencja
Brak pliku `LICENSE` w repozytorium.

---

## EN

### Project overview
Volt Garage is a showcase-only front-end for an automotive accessories store. The repository contains a static multi-page site built with HTML, CSS, and Vanilla JS, with a local product catalog, a `localStorage` cart, a PWA baseline, and a build pipeline that assembles a `dist/` package.

The project simulates a realistic commercial e-commerce website, but it does not implement backend ordering, SSR, or server-side checkout. That limitation is consistent with the current codebase and stated project intent.

### Key features
- Multi-page site structure: homepage, shop, product, collections, new arrivals, promotions, contact, cart, checkout, legal pages, `404`, `offline`, and `thank-you`.
- Dynamic product list and product-detail rendering from [data/products.json](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/data/products.json).
- Catalog filtering, sorting, and search on the shop page.
- Browser-local cart persistence.
- `light` / `dark` theme switching with a pre-CSS theme preload snippet.
- PWA baseline: [site.webmanifest](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/site.webmanifest), Service Worker, offline page, install prompt, and update notifications.
- JSON-LD for the homepage plus dynamic breadcrumb, `ItemList`, and `Product` structured data.
- `dist/` build with HTML partial expansion and minified asset rewrites.

### Tech stack
- HTML5
- CSS with partials and design tokens
- Vanilla JavaScript (ES modules)
- Node.js `>=18`
- PostCSS (`postcss-import`, `cssnano`)
- esbuild
- html-validate, ESLint, Stylelint, Prettier

### Structure overview
- [index.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/index.html), [404.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/404.html), [offline.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/offline.html), [thank-you.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/thank-you.html): primary entry points.
- [pages/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/pages): feature and legal subpages.
- [src/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/src/partials): header/footer partials expanded during `dist` build.
- [css/main.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.css) + [css/partials/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/partials): styling layer.
- [js/main.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.js) + [js/features/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/features) + [js/ui/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/ui): bootstrap, feature logic, and UI modules.
- [scripts/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/scripts): build, preview, and QA tooling.
- [dist/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/dist): generated deployment package.

### Setup & run
Install dependencies:

```bash
npm install
```

Build and preview locally:

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
npm run qa:links
npm run validate:jsonld
```

### Build / deployment notes
- `build:css` outputs [css/main.min.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.min.css).
- `build:js` outputs [js/main.min.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.min.js).
- `build:dist` assembles final HTML from partials and rewrites asset references to minified bundles.
- Static hosting is supported through [\_headers](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_headers), [\_redirects](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/_redirects), [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt), and [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml).

### Accessibility notes
- A skip link to `#main` is present in the header.
- `:focus-visible` styling and keyboard mode handling are implemented.
- Mobile navigation and dropdowns use native buttons and `aria-expanded`.
- The project modal includes focus trapping and `Escape` handling.
- Motion respects `prefers-reduced-motion`.
- The no-JS baseline is partly preserved, but the product page and parts of checkout behavior still depend on JavaScript.

### SEO notes
- Main pages include `title`, `meta description`, canonical, and Open Graph metadata.
- The homepage ships static `OnlineStore` and `WebSite` JSON-LD.
- Breadcrumb, `ItemList`, and `Product` JSON-LD are injected where product-driven logic is needed.
- The repository includes current [sitemap.xml](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/sitemap.xml), [site.webmanifest](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/site.webmanifest), [robots.txt](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/robots.txt), and an OG image asset.

### Performance notes
- Images use `picture`, AVIF/WebP, `loading`, `decoding`, and explicit dimensions.
- Fonts use `font-display: swap`.
- Theme resolution runs before CSS loads, reducing theme flash.
- The Service Worker is conditionally registered and provides offline fallback.
- The `dist/` package references minified CSS and JS bundles.

### Roadmap
- Reduce product-page dependence on runtime JS through pre-rendering or static product variants.
- Make the showcase-only checkout behavior clearer within the page flow itself.
- Add automated consistency checks for `sitemap.xml`, `site.webmanifest`, and QA route inventories.
- Harden CSP and reduce reliance on `'unsafe-inline'`.
- Expand release and QA documentation with a repeatable metadata/build checklist.

### License
No `LICENSE` file was detected in the repository.
