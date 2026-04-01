# KP_Code Digital Studio

## PL

### Przegląd projektu

Statyczna strona firmowa z własnym procesem builda opartym na Node.js. Repozytorium zawiera wielostronicowy serwis HTML z ręcznie organizowanym CSS i modułowym JavaScriptem, podstrony usług, podstrony projektów, zasoby SEO oraz skrypty do budowy `dist/`.

### Kluczowe funkcje

- Wielostronicowa architektura z głównymi widokami: `index.html`, `about.html`, `services.html`, `projects.html`, `contact.html`, `ecosystem.html`, `case-digital-vault.html` oraz strony prawne.
- Dedykowane podstrony usług w katalogu `services/`.
- Dedykowane podstrony projektów w katalogu `projects/`.
- Przełączanie motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Mobilna nawigacja z obsługą `aria-expanded`, `Escape`, trapem fokusu i zwrotem fokusu.
- Sekcje z reveal-on-scroll, płynne przewijanie anchorów i filtrowanie projektów po kategorii.
- Lokalne fonty `woff2`, obrazy responsywne (`avif`, `webp`, `jpg`) oraz manifest PWA.
- Meta SEO, Open Graph, Twitter Cards, `robots`, `canonical`, `sitemap.xml` i JSON-LD na stronach HTML.

### Stack technologiczny

- HTML5
- CSS podzielony na: `base`, `tokens`, `layout`, `components`, `sections`, `pages`, `utilities`, `projects`
- Vanilla JavaScript ES modules
- Node.js `>=18`
- `esbuild`
- `lightningcss`
- `sharp`
- `fast-glob`

### Struktura projektu

```text
.
|-- assets/           # fonty, ikony, logo, obrazy źródłowe i zoptymalizowane
|-- css/              # warstwy stylów
|-- js/               # entrypoint i moduły funkcjonalne
|-- projects/         # podstrony projektów
|-- services/         # podstrony usług
|-- scripts/          # build, preview, optymalizacja obrazów
|-- seo/              # sitemap i robots
|-- dist/             # wynik buildu
|-- *.html            # główne strony serwisu
`-- package.json
```

### Instalacja i uruchomienie

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Zbuduj wersję produkcyjną:

   ```bash
   npm run build
   ```

3. Uruchom podgląd katalogu `dist/`:

   ```bash
   npm run preview
   ```

4. Alternatywnie zbuduj i od razu uruchom preview:

   ```bash
   npm run build:preview
   ```

### Build i wdrożenie

- Główny build działa przez `scripts/build-dist.mjs`.
- Build generuje CSS i JS, kopiuje HTML, `assets/`, pliki SEO i poprawia ścieżki ikon w manifeście dla `dist/`.
- `scripts/preview-dist.mjs` uruchamia prosty serwer HTTP dla gotowego `dist/`.
- Pliki konfiguracyjne Netlify/Vercel nie zostały wykryte w repozytorium.

### Dostępność

- Wykryto skip-linki i widoczne style fokusu.
- Nawigacja mobilna ma obsługę klawiatury i atrybutów ARIA.
- Strony mają po jednym `h1`.
- Obrazy w sprawdzonych plikach HTML mają `width` i `height`.
- Obsługa `prefers-reduced-motion` jest widoczna w CSS i przy smooth scrollu.
- Formularz kontaktowy ma walidację po stronie klienta, ale nie ma rzeczywistej ścieżki wysyłki bez JS ani z JS.

### SEO

- W repo wykryto `meta description`, `canonical`, `og:image`, `robots` i bloki JSON-LD na wszystkich sprawdzonych stronach HTML.
- W repo jest `seo/sitemap.xml` oraz `seo/robots.txt`; build kopiuje też `robots.txt` i `sitemap.xml` do root `dist/`.
- Nie wszystkie indeksowalne adresy z `canonical` są obecne w aktualnym `seo/sitemap.xml`.

### Wydajność

- Fonty są lokalne i używają `font-display: swap`.
- Karty projektów i część grafik korzystają z `<picture>` oraz formatów `avif` i `webp`.
- W sprawdzonych znacznikach `<img>` obecne są `loading="lazy"`, `decoding="async"` oraz wymiary.
- CSS korzysta z tokenów i warstw plików, co ogranicza przypadkowe duplikowanie stylów.

### Roadmapa

Jawny plik roadmapy nie został wykryty w repozytorium. Z samego audytu wynikają następujące priorytety:

- naprawa dwóch niedziałających linków CTA na stronie głównej
- dodanie realnej obsługi wysyłki formularza kontaktowego
- uzupełnienie sitemap o wszystkie strony kanoniczne oznaczone jako `index, follow`
- korekta etykiet ARIA w kartach usług
- przegląd drobnych niespójności markupu SVG i treści pomocniczych

### Licencja

`MIT` według `package.json`.

---

## EN

### Project overview

Static company website with a custom Node.js build pipeline. The repository contains a multi-page HTML site, layered CSS, modular vanilla JavaScript, service pages, project pages, SEO assets, and scripts for producing `dist/`.

### Key features

- Multi-page structure with core views: `index.html`, `about.html`, `services.html`, `projects.html`, `contact.html`, `ecosystem.html`, `case-digital-vault.html`, plus legal pages.
- Dedicated service detail pages in `services/`.
- Dedicated project detail pages in `projects/`.
- Light/dark theme toggle with preference persisted in `localStorage`.
- Mobile navigation with `aria-expanded`, `Escape` handling, focus trap, and focus return.
- Reveal-on-scroll sections, anchor smooth scrolling, and category-based project filtering.
- Local `woff2` fonts, responsive images (`avif`, `webp`, `jpg`), and a web app manifest.
- SEO metadata, Open Graph, Twitter cards, `robots`, `canonical`, `sitemap.xml`, and JSON-LD across HTML pages.

### Tech stack

- HTML5
- CSS split into `base`, `tokens`, `layout`, `components`, `sections`, `pages`, `utilities`, and `projects`
- Vanilla JavaScript ES modules
- Node.js `>=18`
- `esbuild`
- `lightningcss`
- `sharp`
- `fast-glob`

### Structure overview

```text
.
|-- assets/           # fonts, icons, logo, source and optimized images
|-- css/              # style layers
|-- js/               # entrypoint and feature modules
|-- projects/         # project detail pages
|-- services/         # service detail pages
|-- scripts/          # build, preview, image tooling
|-- seo/              # sitemap and robots
|-- dist/             # build output
|-- *.html            # top-level site pages
`-- package.json
```

### Setup and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build production output:

   ```bash
   npm run build
   ```

3. Preview the generated `dist/` folder:

   ```bash
   npm run preview
   ```

4. Or build and preview in one step:

   ```bash
   npm run build:preview
   ```

### Build and deployment notes

- The main build entry is `scripts/build-dist.mjs`.
- The build compiles CSS and JS, copies HTML and `assets/`, copies SEO files, and rewrites manifest icon paths inside `dist/`.
- `scripts/preview-dist.mjs` serves the built output through a small local HTTP server.
- No Netlify or Vercel configuration files were detected in the repository.

### Accessibility notes

- Skip links and visible focus styles are present.
- Mobile navigation includes keyboard support and ARIA state handling.
- Each audited page has a single `h1`.
- Audited HTML images include `width` and `height`.
- `prefers-reduced-motion` is handled in CSS and in smooth-scroll logic.
- The contact form provides client-side validation only; there is no real submission path with or without JavaScript.

### SEO notes

- `meta description`, `canonical`, `og:image`, `robots`, and JSON-LD were detected across the audited HTML pages.
- The repository includes `seo/sitemap.xml` and `seo/robots.txt`; the build also writes root-level `robots.txt` and `sitemap.xml` into `dist/`.
- Not every canonical indexable page is currently included in `seo/sitemap.xml`.

### Performance notes

- Fonts are local and use `font-display: swap`.
- Project cards and several other assets use `<picture>` with `avif` and `webp`.
- Audited `<img>` tags include `loading="lazy"`, `decoding="async"`, and explicit dimensions.
- CSS is organized by layer and token usage, which helps limit style sprawl.

### Roadmap

No explicit roadmap file was detected in the repository. Based on the audit, the next practical priorities are:

- fix the two broken homepage CTA links
- add a real submission path for the contact form
- expand the sitemap to cover all canonical indexable pages
- correct ARIA labels in the services overview cards
- clean up minor SVG/markup inconsistencies

### License

`MIT` according to `package.json`.
