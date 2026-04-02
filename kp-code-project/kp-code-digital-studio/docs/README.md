# KP_Code Digital Studio

## PL

### Przegląd projektu

Repozytorium zawiera wielostronicowy serwis front-endowy budowany własnym pipeline'em Node.js. Warstwa źródłowa składa się z plików HTML, warstwowego CSS, modułowego JavaScriptu, współdzielonych partiali `header` i `footer`, zasobów SEO oraz endpointu formularza kontaktowego w PHP.

### Kluczowe funkcje

- Wielostronicowa struktura HTML z głównymi stronami w katalogu root oraz podstronami w `services/` i `projects/`.
- Składanie współdzielonych partiali podczas builda (`scripts/build-utils.mjs:20-22`, `scripts/build-utils.mjs:140-167`).
- Warstwowa architektura CSS: `tokens`, `base`, `layout`, `components`, `sections`, `utilities`, `pages`, `projects` (`css/main.css:1-11`).
- Modułowy JS inicjalizujący motyw, nawigację, scroll, reveal, formularz kontaktowy i filtrowanie projektów (`js/main.js:1-22`).
- Formularz kontaktowy z progressive enhancement: klasyczny `POST` do PHP oraz asynchroniczne wysyłanie po stronie JS (`contact.html:186-193`, `js/modules/forms.js:21-23`, `js/modules/forms.js:258-330`, `contact-submit.php:1-102`).
- QA buildowe dla `dist/`, składania HTML i lokalnych referencji (`scripts/qa/run-qa.mjs:1-21`).

### Stack technologiczny

- HTML5
- CSS
- Vanilla JavaScript ES modules
- PHP dla obsługi formularza
- Node.js `>=18`
- `esbuild`
- `lightningcss`
- `fast-glob`
- `sharp`

### Struktura projektu

```text
.
|-- assets/         # fonty, ikony, logo, obrazy źródłowe i zoptymalizowane
|-- css/            # warstwy stylów
|-- docs/           # istniejąca dokumentacja pomocnicza
|-- js/             # entrypoint i moduły funkcjonalne
|-- projects/       # podstrony projektów
|-- scripts/        # build, preview, QA, przetwarzanie obrazów
|-- services/       # podstrony usług
|-- src/partials/   # współdzielony header i footer
|-- *.html          # strony główne
|-- contact*.php    # obsługa formularza kontaktowego
|-- robots.txt      # źródłowy plik robots
|-- sitemap.xml     # źródłowa mapa witryny
`-- package.json
```

### Setup i uruchomienie

```bash
npm install
npm run build
npm run preview
```

Do pełnej walidacji buildu:

```bash
npm run qa
```

### Build i wdrożenie

- Build produkcyjny uruchamia `scripts/build-dist.mjs`, który czyści `dist/`, bundluje CSS/JS, składa HTML, kopiuje zasoby i pliki SEO oraz poprawia manifest w `dist/` (`scripts/build-dist.mjs:1-18`, `scripts/build-utils.mjs:34-61`, `scripts/build-utils.mjs:164-200`).
- Publiczny inwentarz HTML jest wyznaczany przez globy `*.html`, `services/**/*.html`, `projects/**/*.html` (`scripts/build-utils.mjs:24`, `scripts/build-utils.mjs:64-69`).
- Pliki `_headers`, `_redirects`, `netlify.toml` i `vercel.json` nie zostały wykryte w projekcie.
- Service worker nie został wykryty w projekcie.

### Dostępność

- Każda audytowana strona ma skip link do `#main` (`index.html:66`, `contact.html:67`, `services.html:67`).
- Widoczny fokus jest zdefiniowany globalnie przez `:focus-visible` (`css/base.css:127-131`).
- Nawigacja mobilna obsługuje `aria-expanded`, `aria-hidden`, `Escape`, trap fokusu i zwrot fokusu (`src/partials/header.html:50-57`, `js/modules/navigation.js:22-50`, `js/modules/navigation.js:53-107`).
- Fallback bez JS jest zaimplementowany dla nawigacji i formularza (`css/layout.css:290-309`, `contact.html:186-193`, `contact-submit.php:1-102`).
- Obsługa `prefers-reduced-motion` jest obecna w tokenach i layoutcie (`css/tokens.css:171-189`, `css/layout.css:379-418`).
- Zgodność kontrastu nie może zostać potwierdzona bez analizy stylów obliczonych.

### SEO

- Strony zawierają `meta description`, `canonical`, `robots`, Open Graph i Twitter Cards, np. `index.html:5-40`, `services.html:13-41`, `contact.html:13-41`.
- `robots.txt` i `sitemap.xml` są utrzymywane w katalogu głównym jako źródłowe pliki SEO.
- JSON-LD jest obecny na większości stron i wykryte bloki parsują się poprawnie jako JSON; nie został wykryty w `404.html`, `in-progress.html`, `offline.html` i `thank-you.html`.
- `sitemap.xml` jest utrzymywana w katalogu głównym jako jedyne źródło prawdy dla mapy witryny.

### Wydajność

- Fonty są self-hosted i używają `font-display: swap` (`css/base.css:7-28`).
- Projekt używa zoptymalizowanych wariantów obrazów i pipeline'u opartego o `sharp` (`image.config.json`, `scripts/images/build-images.mjs`).
- Audytowane elementy `<img>` mają jawne `width` i `height`.
- Obrazy i iframe używają `loading="lazy"` tam, gdzie zostało to wdrożone, np. `index.html:307-310`, `about.html:144-147`, `contact.html:275-281`.

### Roadmapa

Na podstawie aktualnego repo najbliższe uzasadnione kroki to:

- uzupełnienie `sitemap.xml` o pełny zestaw stron kanonicznych
- poprawa zduplikowanych etykiet `aria-label` w kartach usług
- usunięcie zależności od buildowego przepisywania ikon manifestu
- rozszerzenie QA o sprawdzenia metadanych i JSON-LD

### Licencja

`MIT` według `package.json`.

## EN

### Project Overview

This repository contains a multi-page front-end website built with a custom Node.js pipeline. The source layer includes HTML files, layered CSS, modular JavaScript, shared `header` and `footer` partials, SEO assets, and a PHP-backed contact form endpoint.

### Key Features

- Multi-page HTML structure with root-level pages and detail pages in `services/` and `projects/`.
- Shared partial assembly during build (`scripts/build-utils.mjs:20-22`, `scripts/build-utils.mjs:140-167`).
- Layered CSS architecture across `tokens`, `base`, `layout`, `components`, `sections`, `utilities`, `pages`, and `projects` (`css/main.css:1-11`).
- Modular JS entrypoint for theme, navigation, scroll, reveal, contact form handling, and project filtering (`js/main.js:1-22`).
- Progressive-enhanced contact form: regular `POST` fallback plus async submission in JS (`contact.html:186-193`, `js/modules/forms.js:21-23`, `js/modules/forms.js:258-330`, `contact-submit.php:1-102`).
- Build QA for `dist/`, HTML assembly, and local references (`scripts/qa/run-qa.mjs:1-21`).

### Tech Stack

- HTML5
- CSS
- Vanilla JavaScript ES modules
- PHP for contact form delivery
- Node.js `>=18`
- `esbuild`
- `lightningcss`
- `fast-glob`
- `sharp`

### Structure Overview

```text
.
|-- assets/         # fonts, icons, logo, source and optimized images
|-- css/            # style layers
|-- docs/           # existing supporting documentation
|-- js/             # entrypoint and feature modules
|-- projects/       # project detail pages
|-- scripts/        # build, preview, QA, image tooling
|-- services/       # service detail pages
|-- src/partials/   # shared header and footer
|-- *.html          # top-level pages
|-- contact*.php    # contact form handling
|-- robots.txt      # source robots file
|-- sitemap.xml     # source sitemap
`-- package.json
```

### Setup and Run

```bash
npm install
npm run build
npm run preview
```

For full build validation:

```bash
npm run qa
```

### Build and Deployment Notes

- Production build runs through `scripts/build-dist.mjs`, which clears `dist/`, bundles CSS/JS, assembles HTML, copies assets and SEO files, and rewrites the manifest in `dist/` (`scripts/build-dist.mjs:1-18`, `scripts/build-utils.mjs:34-61`, `scripts/build-utils.mjs:164-200`).
- Public HTML inventory is defined by `*.html`, `services/**/*.html`, and `projects/**/*.html` (`scripts/build-utils.mjs:24`, `scripts/build-utils.mjs:64-69`).
- `_headers`, `_redirects`, `netlify.toml`, and `vercel.json` were not detected in the project.
- A service worker was not detected in the project.

### Accessibility Notes

- Each audited page includes a skip link to `#main` (`index.html:66`, `contact.html:67`, `services.html:67`).
- Visible focus is defined globally via `:focus-visible` (`css/base.css:127-131`).
- Mobile navigation implements `aria-expanded`, `aria-hidden`, `Escape`, focus trapping, and focus return (`src/partials/header.html:50-57`, `js/modules/navigation.js:22-50`, `js/modules/navigation.js:53-107`).
- No-JS fallback exists for both navigation and form submission (`css/layout.css:290-309`, `contact.html:186-193`, `contact-submit.php:1-102`).
- `prefers-reduced-motion` handling exists in both tokens and layout (`css/tokens.css:171-189`, `css/layout.css:379-418`).
- Contrast compliance cannot be verified without computed style analysis.

### SEO Notes

- Pages include `meta description`, `canonical`, `robots`, Open Graph, and Twitter Card metadata, for example `index.html:5-40`, `services.html:13-41`, and `contact.html:13-41`.
- `robots.txt` and `sitemap.xml` are maintained in the project root as the source SEO files.
- JSON-LD is present on most pages and detected blocks parse as valid JSON; it was not detected in `404.html`, `in-progress.html`, `offline.html`, or `thank-you.html`.
- `sitemap.xml` is maintained in the project root as the single source of truth for sitemap content.

### Performance Notes

- Fonts are self-hosted and use `font-display: swap` (`css/base.css:7-28`).
- The project uses optimized image variants and a `sharp`-based image pipeline (`image.config.json`, `scripts/images/build-images.mjs`).
- Audited `<img>` elements include explicit `width` and `height`.
- Images and the contact map iframe use `loading="lazy"` where implemented, for example `index.html:307-310`, `about.html:144-147`, and `contact.html:275-281`.

### Roadmap

Based on the current repository, the next justified steps are:

- complete `sitemap.xml` for the full canonical page set
- fix duplicated `aria-label` values in service jump links
- remove dependence on build-time manifest icon rewriting
- extend QA to include metadata and JSON-LD checks

### License

`MIT` according to `package.json`.
