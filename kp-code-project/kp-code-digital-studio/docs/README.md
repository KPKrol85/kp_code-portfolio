# KP_Code Digital Studio

## PL

### Przegląd projektu

Repozytorium zawiera statyczny, wielostronicowy serwis front-endowy budowany własnym pipeline’em Node.js. Implementacja opiera się na źródłowych plikach HTML, warstwowym CSS, modułowym Vanilla JS, współdzielonych partialach header/footer oraz skryptach do budowy `dist/`, preview, QA i optymalizacji obrazów.

### Kluczowe funkcje

- Wielostronicowa architektura HTML z głównymi stronami root oraz podstronami w `services/` i `projects/`.
- Współdzielone partiale `src/partials/header.html` i `src/partials/footer.html`, składane do pełnych stron podczas builda (`scripts/build-utils.mjs:21-22`, `scripts/build-utils.mjs:146-156`).
- Warstwowa organizacja CSS przez `tokens`, `base`, `layout`, `components`, `sections`, `utilities`, `pages`, `projects` (`css/main.css:1-13`).
- Modułowy JS z inicjalizacją motywu, nawigacji mobilnej, smooth scrolla, reveal-on-scroll, formularza kontaktowego i filtrowania projektów (`js/main.js:1-24`).
- Przełącznik motywu light/dark z zapisem preferencji w `localStorage` (`js/modules/theme.js:5-69`).
- Mobilna nawigacja z `aria-expanded`, `aria-hidden`, obsługą `Escape`, trapem fokusu i zwrotem fokusu (`js/modules/navigation.js:7-164`).
- Prosty lokalny layer QA sprawdzający strukturę `dist`, montaż partiali i lokalne referencje (`package.json:13`, `scripts/qa/run-qa.mjs:1-25`).
- Lokalne fonty `woff2`, zoptymalizowane warianty obrazów `avif` / `webp` / `jpg`, manifest i zasoby SEO.

### Stack technologiczny

- HTML5
- CSS
- Vanilla JavaScript ES Modules
- Node.js `>=18.0.0`
- `esbuild`
- `lightningcss`
- `fast-glob`
- `sharp`

### Struktura projektu

```text
.
|-- assets/           # fonty, ikony, logo, obrazy źródłowe i zoptymalizowane
|-- css/              # warstwy stylów
|-- docs/             # dokumentacja techniczna
|-- js/               # entrypoint i moduły funkcjonalne
|-- projects/         # podstrony projektów
|-- scripts/          # build, preview, QA, obrazy
|   |-- images/
|   `-- qa/
|-- seo/              # robots i sitemap źródłowe
|-- services/         # podstrony usług
|-- src/partials/     # współdzielony header i footer
|-- *.html            # strony root
|-- image.config.json # konfiguracja pipeline’u obrazów
`-- package.json
```

### Instalacja i uruchomienie

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Zbuduj `dist/`:

   ```bash
   npm run build
   ```

3. Uruchom lokalny preview gotowego buildu:

   ```bash
   npm run preview
   ```

4. Uruchom build i preview jednym poleceniem:

   ```bash
   npm run build:preview
   ```

5. Uruchom build z dodatkową walidacją QA:

   ```bash
   npm run qa
   ```

### Build i wdrożenie

- Główne wejście builda to `scripts/build-dist.mjs:1-18`.
- Build:
  - usuwa poprzedni `dist/`,
  - buduje CSS i JS,
  - składa HTML z partiali,
  - kopiuje `assets/` i pliki SEO,
  - poprawia ścieżki ikon w wygenerowanym manifeście (`scripts/build-utils.mjs:146-203`).
- Preview działa przez własny serwer HTTP dla `dist/` (`scripts/preview-dist.mjs:1-130`).
- Pliki `_headers`, `_redirects`, `netlify.toml`, `vercel.json` nie zostały wykryte w projekcie.
- Service worker nie został wykryty w projekcie.

### Dostępność

- Na stronach obecny jest skip link do `#main` (`index.html:51`, `about.html:50`, `contact.html:50`).
- Globalne style fokusu są zdefiniowane przez `:focus-visible` (`css/base.css:102-126`).
- Nawigacja mobilna ma focus management, `Escape` i synchronizację stanów ARIA (`js/modules/navigation.js:17-124`).
- CSS i JS uwzględniają `prefers-reduced-motion` (`css/tokens.css:169-183`, `css\layout.css:379-417`, `js/modules/scroll.js:17-30`, `js/modules/reveal.js:47-51`).
- Fallback no-JS dla nawigacji jest widoczny w `html:not(.js) .nav__links` i ukryciu toggla (`css/layout.css:290-308`).
- Formularz kontaktowy ma walidację klienta, ale nie ma rzeczywistej ścieżki wysyłki i nie zapewnia użytecznego fallbacku bez JS (`contact.html:138-160`, `js/modules/forms.js:161-191`).
- Zgodność kontrastu nie może zostać potwierdzona bez analizy stylów obliczonych.

### SEO

- W źródłowych stronach HTML wykryto `meta description`, `canonical`, `robots`, `og:url`, `og:image` oraz Twitter Cards (`index.html:9-29`, `services.html:9-29`, `projects/ambre.html:8-27`).
- Na większości stron HTML obecny jest JSON-LD; podczas audytu wykryte bloki parsowały się jako poprawny JSON.
- Strona tymczasowa `in-progress.html` jest oznaczona jako `noindex, follow` (`in-progress.html:9`).
- Repo zawiera `seo/sitemap.xml` i `seo/robots.txt`; build generuje też root-level `robots.txt` i `sitemap.xml` w `dist/` (`scripts/build-utils.mjs:177-185`).
- Nie wszystkie kanoniczne strony oznaczone jako `index, follow` są obecne w aktualnym `seo/sitemap.xml`.

### Wydajność

- Fonty są hostowane lokalnie i używają `font-display: swap` (`css/base.css:7-23`).
- Źródłowe obrazy są budowane do wariantów szerokości i formatów przez `sharp` (`image.config.json:1-15`, `scripts/images/build-images.mjs:1-192`).
- W repo widoczne są `<picture>`, `srcset`, `loading="lazy"` i jawne `width` / `height` w audytowanych obrazach (`about.html:97-109`, `projects.html:108-122`, `index.html:227-233`).
- CSS i JS są bundlowane dopiero na etapie builda; minifikacja nie zanieczyszcza warstwy source.
- Dedykowany service worker nie został wykryty w projekcie.

### Roadmapa

Jawny plik roadmapy nie został wykryty w projekcie. Najbardziej uzasadnione następne kroki wynikające ze stanu repo to:

- dodanie rzeczywistej obsługi wysyłki formularza kontaktowego
- uzupełnienie sitemap o wszystkie kanoniczne strony indeksowalne
- korekta etykiet ARIA w kartach usług na `services.html`
- ujednolicenie źródła prawdy dla `robots.txt` i ścieżki do sitemap
- sformatowanie zwięzłych, jednowierszowych plików HTML w `projects/` dla lepszej utrzymywalności

### Licencja

Licencja `MIT` według `package.json`.

---

## EN

### Project Overview

This repository contains a static multi-page front-end website built with a custom Node.js pipeline. The implementation uses source HTML files, layered CSS, modular vanilla JS, shared header/footer partials, and scripts for generating `dist/`, previewing output, running QA, and optimizing images.

### Key Features

- Multi-page HTML structure with top-level pages and nested pages in `services/` and `projects/`.
- Shared partials in `src/partials/header.html` and `src/partials/footer.html`, assembled into final pages at build time (`scripts/build-utils.mjs:21-22`, `scripts/build-utils.mjs:146-156`).
- Layered CSS architecture across `tokens`, `base`, `layout`, `components`, `sections`, `utilities`, `pages`, and `projects` (`css/main.css:1-13`).
- Modular JavaScript for theme handling, mobile navigation, smooth scrolling, reveal-on-scroll, contact form logic, and project filtering (`js/main.js:1-24`).
- Light/dark theme toggle with `localStorage` persistence (`js/modules/theme.js:5-69`).
- Mobile navigation with `aria-expanded`, `aria-hidden`, `Escape` handling, focus trap, and focus return (`js/modules/navigation.js:7-164`).
- Lightweight QA layer for `dist` structure, partial assembly integrity, and local reference validation (`package.json:13`, `scripts/qa/run-qa.mjs:1-25`).
- Local `woff2` fonts, optimized `avif` / `webp` / `jpg` image outputs, manifest, and SEO assets.

### Tech Stack

- HTML5
- CSS
- Vanilla JavaScript ES Modules
- Node.js `>=18.0.0`
- `esbuild`
- `lightningcss`
- `fast-glob`
- `sharp`

### Structure Overview

```text
.
|-- assets/           # fonts, icons, logo, source and optimized images
|-- css/              # style layers
|-- docs/             # technical documentation
|-- js/               # entrypoint and feature modules
|-- projects/         # project detail pages
|-- scripts/          # build, preview, QA, image tooling
|   |-- images/
|   `-- qa/
|-- seo/              # source robots and sitemap
|-- services/         # service detail pages
|-- src/partials/     # shared header and footer
|-- *.html            # root pages
|-- image.config.json # image pipeline configuration
`-- package.json
```

### Setup and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build `dist/`:

   ```bash
   npm run build
   ```

3. Preview the generated build locally:

   ```bash
   npm run preview
   ```

4. Build and preview in one step:

   ```bash
   npm run build:preview
   ```

5. Run build plus QA validation:

   ```bash
   npm run qa
   ```

### Build and Deployment Notes

- The main build entry is `scripts/build-dist.mjs:1-18`.
- The build:
  - removes the previous `dist/`,
  - builds CSS and JS,
  - assembles HTML from partials,
  - copies `assets/` and SEO files,
  - rewrites icon paths in the generated manifest (`scripts/build-utils.mjs:146-203`).
- Preview is served through a custom local HTTP server for `dist/` (`scripts/preview-dist.mjs:1-130`).
- `_headers`, `_redirects`, `netlify.toml`, and `vercel.json` were not detected in the project.
- A service worker was not detected in the project.

### Accessibility Notes

- Skip links to `#main` are present across pages (`index.html:51`, `about.html:50`, `contact.html:50`).
- Global focus visibility is defined through `:focus-visible` (`css/base.css:102-126`).
- Mobile navigation includes focus management, `Escape`, and ARIA state synchronization (`js/modules/navigation.js:17-124`).
- Both CSS and JS respect `prefers-reduced-motion` (`css/tokens.css:169-183`, `css/layout.css:379-417`, `js/modules/scroll.js:17-30`, `js/modules/reveal.js:47-51`).
- A no-JS navigation fallback exists through `html:not(.js) .nav__links` and hidden toggle behavior (`css/layout.css:290-308`).
- The contact form provides client-side validation only and does not expose a real submission path or useful no-JS fallback (`contact.html:138-160`, `js/modules/forms.js:161-191`).
- Contrast compliance cannot be verified without computed style analysis.

### SEO Notes

- Source HTML pages include `meta description`, `canonical`, `robots`, `og:url`, `og:image`, and Twitter card metadata (`index.html:9-29`, `services.html:9-29`, `projects/ambre.html:8-27`).
- JSON-LD is present on most HTML pages; during the audit, detected blocks parsed as valid JSON.
- The temporary `in-progress.html` page is marked `noindex, follow` (`in-progress.html:9`).
- The repository includes `seo/sitemap.xml` and `seo/robots.txt`; the build also emits root-level `robots.txt` and `sitemap.xml` in `dist/` (`scripts/build-utils.mjs:177-185`).
- Not every canonical `index, follow` page is currently included in `seo/sitemap.xml`.

### Performance Notes

- Fonts are self-hosted and use `font-display: swap` (`css/base.css:7-23`).
- Source images are transformed into width and format variants through `sharp` (`image.config.json:1-15`, `scripts/images/build-images.mjs:1-192`).
- Audited images use `<picture>`, `srcset`, `loading="lazy"`, and explicit `width` / `height` (`about.html:97-109`, `projects.html:108-122`, `index.html:227-233`).
- CSS and JS are bundled at build time; minified artifacts stay out of the source layer.
- A dedicated service worker was not detected in the project.

### Roadmap

No explicit roadmap file was detected in the repository. The most justified next steps based on the current codebase are:

- add a real submission path for the contact form
- expand the sitemap to include all canonical indexable pages
- fix copied ARIA labels in the service overview cards
- unify the source of truth for `robots.txt` and sitemap location
- reformat the compressed single-line HTML files in `projects/` for better maintainability

### License

`MIT` according to `package.json`.
