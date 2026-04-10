# KP_Code Digital Studio

## PL

### Przegląd projektu

`KP_Code Digital Studio` to wielostronicowy serwis front-endowy oparty na statycznych plikach HTML, CSS i vanilla JavaScript, z produkcyjnym buildem do katalogu `dist/` oraz obsługą formularza kontaktowego w PHP. Repozytorium zawiera publiczne strony główne i wspierające, w tym: stronę główną, podstrony `about`, `services`, `projects`, `contact`, strony usługowe i projektowe, strony prawne oraz strony pomocnicze takie jak `404`, `offline`, `thank-you` i `in-progress`.

Projekt wykorzystuje współdzielone partiale dla nagłówka, stopki i bootstrapu motywu, a build generuje złożone HTML-e, minifikowane zasoby front-endowe, `sitemap.xml` oraz finalny `service-worker.js`.

### Kluczowe funkcje

- Wielostronicowa architektura oparta na statycznych plikach HTML.
- Współdzielone partiale `header`, `footer` i `theme-bootstrap` składane podczas builda.
- Jedno wejście CSS (`css/main.css`) i jedno wejście JS (`js/main.js`) z buildem do plików minifikowanych w `dist/`.
- Przełączanie motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Mobilna nawigacja z obsługą `aria-expanded`, pułapką fokusu i zamykaniem klawiszem `Escape`.
- Animacje reveal z fallbackiem dla `prefers-reduced-motion` i braku `IntersectionObserver`.
- Filtrowanie kart projektów na stronie `projects.html`.
- Formularz kontaktowy z progressive enhancement: walidacja po stronie klienta, wysyłka asynchroniczna oraz serwerowy fallback PHP.
- Ochrona formularza przez honeypot, token czasowy i prosty rate limiting po stronie PHP.
- Web manifest, szablon service workera oraz dedykowana strona `offline.html`.
- Skrypty QA sprawdzające strukturę `dist/`, składanie HTML, lokalne referencje, metadane i runtime PHP.

### Stack technologiczny

**Runtime**

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- PHP
- PHPMailer

**Build i narzędzia**

- Node.js 18+
- npm
- esbuild
- lightningcss
- fast-glob
- sharp
- Prettier
- Composer

### Struktura projektu

```text
.
├─ assets/                  # fonty, ikony, obrazy, OG image, screenshoty
├─ css/                     # tokens, base, layout, components, sections, pages, utilities, projects
├─ js/
│  ├─ main.js               # główny punkt wejścia aplikacji
│  └─ modules/              # theme, navigation, scroll, reveal, forms, project-filter, service-worker
├─ projects/                # podstrony pojedynczych projektów
├─ services/                # podstrony pojedynczych usług
├─ scripts/
│  ├─ build-*.mjs           # build CSS, JS i dist
│  ├─ images/               # build i czyszczenie obrazów
│  └─ qa/                   # kontrole jakości dla outputu dist
├─ src/
│  └─ partials/             # współdzielone partiale HTML
├─ dist/                    # output produkcyjny generowany przez build
├─ vendor/                  # zależności PHP installowane przez Composer
├─ *.html                   # główne strony publiczne i strony pomocnicze
├─ contact.php              # render strony kontaktowej z fallbackiem serwerowym
├─ contact-submit.php       # endpoint formularza
├─ contact-form-support.php # walidacja i logika pomocnicza formularza
├─ service-worker.js        # szablon service workera
├─ robots.txt
├─ .htaccess
├─ package.json
└─ composer.json
```

### Instalacja i konfiguracja

Wymagania:

- Node.js `>=18`
- npm
- PHP
- Composer

Instalacja:

```bash
npm install
composer install
```

Formularz kontaktowy korzysta z konfiguracji odczytywanej z:

- zmiennych środowiskowych `KP_CODE_*`
- opcjonalnego pliku `contact-mail.config.local.php`

Podstawowy loader konfiguracji znajduje się w `contact-mail.config.php`.

### Development lokalny

Repozytorium nie zawiera watch mode ani osobnego serwera developerskiego dla source files. Lokalny workflow opiera się na buildzie do `dist/` i podglądzie wygenerowanego outputu.

Przydatne komendy:

```bash
npm run format
npm run format:check
npm run build
npm run preview
npm run preview:source
npm run build:preview
npm run qa
```

Dodatkowe komendy dla zasobów graficznych:

```bash
npm run img:build
npm run img:clean
```

### Build produkcyjny

Build produkcyjny generuje katalog `dist/` i obejmuje:

- bundling i minifikację CSS do `dist/css/main.min.css`
- bundling i minifikację JavaScript do `dist/js/main.min.js`
- składanie stron HTML z partiali
- kopiowanie wymaganych assetów runtime
- kopiowanie runtime PHP i zależności `vendor/`
- kopiowanie `robots.txt`
- generowanie `sitemap.xml`
- wygenerowanie finalnego `service-worker.js` z nazwą cache opartą na hashu shell assets

Główna komenda:

```bash
npm run build
```

### Deployment

Repozytorium zawiera jawne artefakty i konfigurację dla deployu outputu `dist/`:

- `.htaccess` z ochroną plików konfiguracyjnych formularza i regułą przepisywania `contact.html` do `contact.php`
- produkcyjny katalog `dist/` zawierający HTML, assety, runtime PHP, `robots.txt`, `sitemap.xml` i minifikowane zasoby
- osobny source preview w `scripts/preview-source.mjs`, który składa shared partials w pamięci podczas pracy na plikach źródłowych
- lokalny serwer preview w `scripts/preview-dist.mjs`, który serwuje wyłącznie zawartość `dist/`

README nie zakłada konkretnej platformy hostingowej poza tym, co wynika bezpośrednio z repozytorium.

### Dostępność

W repozytorium wykryto następujące elementy dostępności:

- `skip-link` do głównej treści
- semantyczne użycie `main`, `nav`, `section`, `article`, `address`, `breadcrumbs`
- `aria-current` w nawigacji współdzielonej
- mobilna nawigacja z `aria-expanded`, `aria-controls`, obsługą klawiatury i zarządzaniem fokusem
- globalne style `:focus-visible`
- obsługa `prefers-reduced-motion` w CSS i JS
- formularz kontaktowy z komunikatami błędów, `aria-invalid`, `aria-describedby`, `aria-live` oraz fallbackiem bez JavaScript

README nie deklaruje formalnej zgodności z konkretnym standardem WCAG.

### SEO

W repozytorium zaimplementowano:

- `title` i `meta description` na publicznych stronach
- `canonical`
- Open Graph
- metadata Twitter
- `robots.txt`
- generowany `sitemap.xml`
- bloki JSON-LD na wybranych stronach
- `og:image:alt`

Metadane są również objęte kontrolą przez skrypty QA.

### Wydajność

W repozytorium widać następujące decyzje implementacyjne związane z wydajnością:

- minifikowany output CSS i JS w buildzie produkcyjnym
- obrazy responsywne z użyciem `picture`, `srcset`, formatów `AVIF` i `WebP`
- `loading="lazy"` i `decoding="async"` dla wielu obrazów i osadzonej mapy
- jawne atrybuty `width` i `height` dla obrazów
- lokalne fonty `woff2` z `font-display: swap`
- lekkie moduły JS ładowane z jednego wejścia ESM
- generowany service worker cache’ujący shell assets oraz stronę `offline.html`

README nie zawiera deklaracji o wynikach Lighthouse ani Core Web Vitals, ponieważ nie są obecne w repozytorium.

### Utrzymanie projektu

Najważniejsze miejsca utrzymaniowe:

- `css/main.css` definiuje kolejność warstw stylów
- `js/main.js` inicjalizuje wszystkie moduły front-endowe
- `src/partials/` zawiera współdzielony shell HTML
- `scripts/build-utils.mjs` zawiera główną logikę budowania, przepisywania assetów, generowania sitemap i service workera
- `scripts/qa/` zawiera automatyczne kontrole jakości dla outputu `dist/`
- `contact-form-support.php`, `contact.php` i `contact-submit.php` zawierają pełną logikę formularza kontaktowego

W pracy nad projektem źródłem zmian powinny pozostawać source files. `dist/` jest katalogiem wynikowym generowanym przez build.

### Roadmap

- Dodać source-level QA dla placeholder links i innych nieprodukcyjnych odnośników w plikach HTML.
- Rozszerzyć automatyczne sprawdzanie obrazów o walidację `srcset` względem realnie istniejących assetów.
- Uzupełnić repozytorium o krótką dokumentację środowiska PHP i konfiguracji formularza kontaktowego.
- Rozważyć dodanie trybu watch lub lekkiego local dev servera dla source files, jeśli workflow projektu będzie rozwijany dalej.

### Licencja

Repozytorium deklaruje licencję `MIT` w `package.json`.

## EN

### Project Overview

`KP_Code Digital Studio` is a multi-page front-end website built with static HTML, CSS, and vanilla JavaScript, with a production build pipeline targeting `dist/` and a PHP-based contact form flow. The repository includes public-facing primary and supporting pages, including the homepage, `about`, `services`, `projects`, `contact`, service and project detail pages, legal pages, and utility pages such as `404`, `offline`, `thank-you`, and `in-progress`.

The project uses shared partials for the header, footer, and theme bootstrap, and the build process generates assembled HTML, minified front-end assets, `sitemap.xml`, and the final `service-worker.js`.

### Key Features

- Multi-page architecture based on static HTML files.
- Shared `header`, `footer`, and `theme-bootstrap` partials assembled during the build.
- Single CSS entry (`css/main.css`) and single JS entry (`js/main.js`) compiled to minified files in `dist/`.
- Light/dark theme switching with preference stored in `localStorage`.
- Mobile navigation with `aria-expanded`, focus trapping, and `Escape` key handling.
- Reveal animations with fallback for `prefers-reduced-motion` and missing `IntersectionObserver`.
- Project card filtering on `projects.html`.
- Contact form progressive enhancement: client-side validation, async submission, and PHP server fallback.
- Contact form protection through a honeypot field, timing token, and simple PHP rate limiting.
- Web manifest, service worker template, and dedicated `offline.html` page.
- QA scripts for `dist/` structure, HTML assembly, local references, metadata, and PHP runtime checks.

### Tech Stack

**Runtime**

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- PHP
- PHPMailer

**Build and Tooling**

- Node.js 18+
- npm
- esbuild
- lightningcss
- fast-glob
- sharp
- Prettier
- Composer

### Project Structure

```text
.
├─ assets/                  # fonts, icons, images, OG image, screenshots
├─ css/                     # tokens, base, layout, components, sections, pages, utilities, projects
├─ js/
│  ├─ main.js               # main application entry point
│  └─ modules/              # theme, navigation, scroll, reveal, forms, project-filter, service-worker
├─ projects/                # project detail pages
├─ services/                # service detail pages
├─ scripts/
│  ├─ build-*.mjs           # CSS, JS, and dist build scripts
│  ├─ images/               # image build and cleanup scripts
│  └─ qa/                   # quality checks for dist output
├─ src/
│  └─ partials/             # shared HTML partials
├─ dist/                    # production output generated by the build
├─ vendor/                  # PHP dependencies installed by Composer
├─ *.html                   # main public pages and utility pages
├─ contact.php              # contact page rendering with server-side fallback
├─ contact-submit.php       # form endpoint
├─ contact-form-support.php # validation and contact-form support logic
├─ service-worker.js        # service worker template
├─ robots.txt
├─ .htaccess
├─ package.json
└─ composer.json
```

### Setup and Installation

Requirements:

- Node.js `>=18`
- npm
- PHP
- Composer

Installation:

```bash
npm install
composer install
```

The contact form reads configuration from:

- `KP_CODE_*` environment variables
- the optional `contact-mail.config.local.php` file

The base configuration loader is defined in `contact-mail.config.php`.

### Local Development

The repository does not include a watch mode or a dedicated development server for source files. The local workflow is based on building into `dist/` and previewing the generated output.

Useful commands:

```bash
npm run format
npm run format:check
npm run build
npm run preview
npm run preview:source
npm run build:preview
npm run qa
```

Additional image commands:

```bash
npm run img:build
npm run img:clean
```

### Production Build

The production build generates the `dist/` directory and includes:

- CSS bundling and minification into `dist/css/main.min.css`
- JavaScript bundling and minification into `dist/js/main.min.js`
- HTML page assembly from shared partials
- copying required runtime assets
- copying PHP runtime files and `vendor/` dependencies
- copying `robots.txt`
- generating `sitemap.xml`
- generating the final `service-worker.js` with a cache name derived from shell asset hashes

Main command:

```bash
npm run build
```

### Deployment

The repository contains explicit artifacts and configuration for deploying the `dist/` output:

- `.htaccess` with contact-form config protection and a rewrite rule from `contact.html` to `contact.php`
- a production `dist/` directory containing HTML, assets, PHP runtime files, `robots.txt`, `sitemap.xml`, and minified front-end assets
- a dedicated source preview in `scripts/preview-source.mjs` that assembles shared partials in memory for source-file work
- a local preview server in `scripts/preview-dist.mjs` that serves only the `dist/` output

This README does not assume a specific hosting platform beyond what is directly evidenced in the repository.

### Accessibility

The following accessibility-related implementation is visible in the repository:

- a `skip-link` to main content
- semantic use of `main`, `nav`, `section`, `article`, `address`, and breadcrumbs
- `aria-current` in shared navigation
- mobile navigation with `aria-expanded`, `aria-controls`, keyboard handling, and focus management
- global `:focus-visible` styling
- `prefers-reduced-motion` handling in both CSS and JavaScript
- a contact form with error messaging, `aria-invalid`, `aria-describedby`, `aria-live`, and a no-JS fallback path

This README does not claim formal compliance with any specific WCAG level.

### SEO

The repository implements:

- `title` and `meta description` on public pages
- `canonical`
- Open Graph metadata
- Twitter metadata
- `robots.txt`
- generated `sitemap.xml`
- JSON-LD blocks on selected pages
- `og:image:alt`

Metadata is also covered by the QA scripts.

### Performance

The repository includes the following explicit performance-related implementation:

- minified CSS and JS output in the production build
- responsive images using `picture`, `srcset`, `AVIF`, and `WebP`
- `loading="lazy"` and `decoding="async"` on multiple images and the embedded map
- explicit image `width` and `height` attributes
- local `woff2` fonts with `font-display: swap`
- lightweight JavaScript modules loaded from a single ESM entry
- a generated service worker that caches shell assets and `offline.html`

This README does not include Lighthouse or Core Web Vitals claims because no measured results are present in the repository.

### Project Maintenance

Main maintenance points:

- `css/main.css` defines the style-layer import order
- `js/main.js` initializes all front-end modules
- `src/partials/` contains the shared HTML shell
- `scripts/build-utils.mjs` contains the core build logic, asset rewriting, sitemap generation, and service worker generation
- `scripts/qa/` contains automated quality checks for the `dist/` output
- `contact-form-support.php`, `contact.php`, and `contact-submit.php` contain the full contact-form logic

Source files should remain the primary editing surface. `dist/` is a generated output directory produced by the build.

### Roadmap

- Add source-level QA for placeholder links and other non-production references in HTML files.
- Extend automated image checks to validate `srcset` entries against actual generated assets.
- Add short repository documentation for the PHP environment and contact-form configuration.
- Consider adding a watch mode or lightweight local dev server for source files if the workflow expands further.

### License

The repository declares the `MIT` license in `package.json`.
