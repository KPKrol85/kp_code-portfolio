# KP_Code Digital Studio

## PL

### Przegląd projektu

`KP_Code Digital Studio` to wielostronicowy serwis front-endowy oparty na statycznych plikach HTML, CSS i vanilla JavaScript. Repozytorium zawiera strony publiczne i pomocnicze, w tym stronę główną, podstrony `about`, `services`, `projects`, `contact`, podstrony usług i projektów, strony prawne oraz widoki `404`, `offline`, `thank-you` i `in-progress`.

Projekt korzysta ze współdzielonych partiali HTML dla nagłówka, stopki i wczesnej inicjalizacji motywu. Proces builda składa strony źródłowe, generuje zminifikowane zasoby CSS/JS, kopiuje wymagane assety, przygotowuje runtime PHP formularza kontaktowego, generuje `sitemap.xml` i finalny `service-worker.js`.

### Kluczowe funkcje

- Wielostronicowa struktura HTML z podstronami usług i projektów.
- Współdzielone partiale `header`, `footer` i `theme-bootstrap`.
- Jedno wejście CSS (`css/main.css`) i jedno wejście JS (`js/main.js`).
- Przełączanie motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Mobilna nawigacja z obsługą `aria-expanded`, `aria-controls`, klawisza `Escape` i zarządzaniem fokusem.
- Animacje reveal z obsługą `prefers-reduced-motion` i fallbackiem przy braku `IntersectionObserver`.
- Filtrowanie kart projektów na stronie `projects.html`.
- Formularz kontaktowy z walidacją po stronie klienta, wysyłką przez `fetch` i fallbackiem serwerowym PHP.
- Serwerowa obsługa formularza przez PHPMailer, walidację, token czasowy, honeypot i prosty rate limit.
- Web manifest, szablon service workera i dedykowana strona `offline.html`.
- Skrypty QA dla outputu `dist/`, składania HTML, lokalnych referencji, metadanych i runtime PHP.

### Stack technologiczny

**Runtime**

- HTML5
- CSS3
- Vanilla JavaScript jako ES modules
- PHP
- PHPMailer

**Build i narzędzia**

- Node.js `>=18`
- npm
- Composer
- esbuild
- lightningcss
- fast-glob
- sharp
- Prettier z `@prettier/plugin-php`

### Struktura projektu

```text
.
├─ assets/                  # fonty, ikony, obrazy, dokumenty, OG image i screenshoty
├─ css/                     # tokens, base, layout, components, sections, utilities, pages, projects
├─ js/
│  ├─ main.js               # główny punkt wejścia modułów front-endowych
│  └─ modules/              # theme, navigation, scroll, reveal, forms, project-filter, service-worker
├─ projects/                # podstrony pojedynczych projektów
├─ services/                # podstrony pojedynczych usług
├─ scripts/
│  ├─ build-*.mjs           # build CSS, JS i dist
│  ├─ images/               # przetwarzanie obrazów przez sharp
│  └─ qa/                   # kontrole jakości outputu
├─ src/partials/            # współdzielone partiale HTML
├─ dist/                    # output produkcyjny generowany przez build
├─ vendor/                  # zależności PHP z Composer
├─ contact.php              # render strony kontaktowej z fallbackiem serwerowym
├─ contact-submit.php       # endpoint formularza kontaktowego
├─ contact-form-support.php # walidacja i logika pomocnicza formularza
├─ contact-mail.config.php  # loader konfiguracji formularza
├─ service-worker.js        # szablon service workera
├─ image.config.json        # konfiguracja generowania obrazów
├─ package.json
└─ composer.json
```

### Instalacja i konfiguracja

Wymagania wynikające z repozytorium:

- Node.js `>=18`
- npm
- PHP
- Composer

Instalacja zależności:

```bash
npm install
composer install
```

Formularz kontaktowy odczytuje konfigurację SMTP i odbiorcy z:

- zmiennych środowiskowych `KP_CODE_*`
- opcjonalnego pliku `contact-mail.config.local.php`

Przykładowa konfiguracja znajduje się w `contact-mail.config.example.php`.

### Development lokalny

Podgląd źródeł z partialami składanymi w pamięci:

```bash
npm run preview:source
```

Podgląd outputu produkcyjnego wymaga wcześniejszego builda:

```bash
npm run build
npm run preview
```

Skrócona komenda build + preview:

```bash
npm run build:preview
```

Formatowanie i kontrola jakości:

```bash
npm run format
npm run format:check
npm run qa
```

Przetwarzanie obrazów:

```bash
npm run img:build
npm run img:clean
```

### Build produkcyjny

Główna komenda:

```bash
npm run build
```

Build produkcyjny:

- czyści i odtwarza katalog `dist/`
- bundluje i minifikuje CSS do `dist/css/main.min.css`
- bundluje i minifikuje JavaScript do `dist/js/main.min.js`
- składa HTML z partiali i przepina referencje na zminifikowane assety
- kopiuje assety runtime z wyłączeniem katalogu źródłowego obrazów
- kopiuje pliki PHP formularza, `.htaccess` i zależności PHPMailer wymagane w runtime
- kopiuje `robots.txt`
- generuje `sitemap.xml` na podstawie indeksowalnych stron z canonical URL
- generuje finalny `service-worker.js` z nazwą cache opartą na hashu shell assets

### Deployment

Repozytorium zawiera konfigurację i artefakty dla publikacji outputu `dist/`:

- `.htaccess` blokuje bezpośredni dostęp do plików konfiguracji formularza i przepisuje `contact.html` na `contact.php`
- `dist/` zawiera złożone HTML-e, assety, runtime PHP, `robots.txt`, `sitemap.xml`, zminifikowany CSS/JS i finalny service worker
- `scripts/preview-dist.mjs` serwuje wyłącznie katalog `dist/`

Repozytorium nie wskazuje jednej konkretnej platformy hostingowej.

### Dostępność

W kodzie widoczne są następujące elementy dostępności:

- link `skip-link` do głównej treści
- semantyczne struktury HTML, w tym `main`, `nav`, `section`, `article`, `address` i breadcrumbs
- `aria-current` w nawigacji współdzielonej
- nawigacja mobilna z `aria-expanded`, `aria-controls`, obsługą klawiatury i zarządzaniem fokusem
- globalne style `:focus-visible`
- obsługa `prefers-reduced-motion` w CSS i JS
- formularz kontaktowy z `aria-invalid`, `aria-describedby`, komunikatami błędów, podsumowaniem błędów i komunikatami statusu

README nie deklaruje formalnej zgodności z konkretnym poziomem WCAG.

### SEO

Repozytorium zawiera:

- tytuły i `meta description` na stronach publicznych
- canonical URL
- Open Graph metadata
- Twitter metadata
- `robots.txt`
- generowany `sitemap.xml`
- bloki JSON-LD na wybranych stronach
- `og:image:alt`
- skrypt QA sprawdzający wybrane wymagania metadanych

### Wydajność

W repozytorium widoczne są następujące mechanizmy związane z wydajnością:

- minifikacja CSS i JS w buildzie produkcyjnym
- obrazy responsywne z `picture`, `srcset`, AVIF i WebP
- pipeline generowania obrazów przez sharp z konfiguracją szerokości, formatów i jakości w `image.config.json`
- `loading="lazy"` i `decoding="async"` w wybranych obrazach
- jawne atrybuty `width` i `height` dla obrazów
- lokalne fonty `woff2`
- modułowy JavaScript ładowany z jednego punktu wejścia ESM
- wygenerowany service worker cache’ujący `offline.html`, `main.min.css` i `main.min.js`

Repozytorium nie zawiera wyników pomiarów Lighthouse ani Core Web Vitals.

### Utrzymanie projektu

- `css/main.css` definiuje kolejność importu warstw CSS.
- `js/main.js` inicjalizuje moduły front-endowe.
- `src/partials/` zawiera współdzielony shell HTML.
- `scripts/build-utils.mjs` zawiera główną logikę builda, składania HTML, generowania sitemap i service workera.
- `scripts/qa/` zawiera automatyczne kontrole jakości dla outputu i wybranych aspektów source HTML.
- `contact-form-support.php`, `contact.php` i `contact-submit.php` zawierają logikę formularza kontaktowego.
- `dist/` jest katalogiem wynikowym generowanym przez build; zmiany źródłowe powinny być wykonywane poza `dist/`.

### Licencja

Repozytorium deklaruje licencję `UNLICENSED` w `package.json`.

## EN

### Project Overview

`KP_Code Digital Studio` is a multi-page front-end website built with static HTML, CSS, and vanilla JavaScript. The repository contains public and utility pages, including the homepage, `about`, `services`, `projects`, `contact`, service and project detail pages, legal pages, and the `404`, `offline`, `thank-you`, and `in-progress` views.

The project uses shared HTML partials for the header, footer, and early theme initialization. The build process assembles source pages, generates minified CSS/JS assets, copies required assets, prepares the PHP contact-form runtime, generates `sitemap.xml`, and creates the final `service-worker.js`.

### Key Features

- Multi-page HTML structure with service and project detail pages.
- Shared `header`, `footer`, and `theme-bootstrap` partials.
- Single CSS entry (`css/main.css`) and single JS entry (`js/main.js`).
- Light/dark theme switching with preference stored in `localStorage`.
- Mobile navigation with `aria-expanded`, `aria-controls`, `Escape` key handling, and focus management.
- Reveal animations with `prefers-reduced-motion` handling and fallback for missing `IntersectionObserver`.
- Project card filtering on `projects.html`.
- Contact form with client-side validation, `fetch` submission, and PHP server fallback.
- Server-side contact handling with PHPMailer, validation, timing token, honeypot, and simple rate limiting.
- Web manifest, service worker template, and dedicated `offline.html` page.
- QA scripts for `dist/` output, HTML assembly, local references, metadata, and PHP runtime checks.

### Tech Stack

**Runtime**

- HTML5
- CSS3
- Vanilla JavaScript as ES modules
- PHP
- PHPMailer

**Build and Tooling**

- Node.js `>=18`
- npm
- Composer
- esbuild
- lightningcss
- fast-glob
- sharp
- Prettier with `@prettier/plugin-php`

### Project Structure

```text
.
├─ assets/                  # fonts, icons, images, docs, OG image, and screenshots
├─ css/                     # tokens, base, layout, components, sections, utilities, pages, projects
├─ js/
│  ├─ main.js               # main entry point for front-end modules
│  └─ modules/              # theme, navigation, scroll, reveal, forms, project-filter, service-worker
├─ projects/                # project detail pages
├─ services/                # service detail pages
├─ scripts/
│  ├─ build-*.mjs           # CSS, JS, and dist build scripts
│  ├─ images/               # image processing through sharp
│  └─ qa/                   # output quality checks
├─ src/partials/            # shared HTML partials
├─ dist/                    # production output generated by the build
├─ vendor/                  # PHP dependencies from Composer
├─ contact.php              # contact page rendering with server-side fallback
├─ contact-submit.php       # contact form endpoint
├─ contact-form-support.php # contact-form validation and support logic
├─ contact-mail.config.php  # contact-form configuration loader
├─ service-worker.js        # service worker template
├─ image.config.json        # image generation configuration
├─ package.json
└─ composer.json
```

### Setup and Installation

Repository requirements:

- Node.js `>=18`
- npm
- PHP
- Composer

Install dependencies:

```bash
npm install
composer install
```

The contact form reads SMTP and recipient configuration from:

- `KP_CODE_*` environment variables
- the optional `contact-mail.config.local.php` file

An example configuration is available in `contact-mail.config.example.php`.

### Local Development

Preview source files with partials assembled in memory:

```bash
npm run preview:source
```

Previewing production output requires a build first:

```bash
npm run build
npm run preview
```

Shortcut for build + preview:

```bash
npm run build:preview
```

Formatting and quality checks:

```bash
npm run format
npm run format:check
npm run qa
```

Image processing:

```bash
npm run img:build
npm run img:clean
```

### Production Build

Main command:

```bash
npm run build
```

The production build:

- cleans and recreates the `dist/` directory
- bundles and minifies CSS to `dist/css/main.min.css`
- bundles and minifies JavaScript to `dist/js/main.min.js`
- assembles HTML from partials and rewrites references to minified assets
- copies runtime assets while excluding the source image directory
- copies contact-form PHP files, `.htaccess`, and PHPMailer runtime dependencies
- copies `robots.txt`
- generates `sitemap.xml` from indexable pages with canonical URLs
- generates the final `service-worker.js` with a cache name based on shell asset hashes

### Deployment

The repository contains configuration and artifacts for publishing the `dist/` output:

- `.htaccess` blocks direct access to contact-form configuration files and rewrites `contact.html` to `contact.php`
- `dist/` contains assembled HTML, assets, PHP runtime files, `robots.txt`, `sitemap.xml`, minified CSS/JS, and the final service worker
- `scripts/preview-dist.mjs` serves only the `dist/` directory

The repository does not identify a single specific hosting platform.

### Accessibility

The codebase includes the following accessibility-related implementation:

- `skip-link` to main content
- semantic HTML structures including `main`, `nav`, `section`, `article`, `address`, and breadcrumbs
- `aria-current` in shared navigation
- mobile navigation with `aria-expanded`, `aria-controls`, keyboard handling, and focus management
- global `:focus-visible` styles
- `prefers-reduced-motion` handling in CSS and JavaScript
- contact form with `aria-invalid`, `aria-describedby`, error messages, error summary, and status messages

This README does not claim formal compliance with a specific WCAG level.

### SEO

The repository includes:

- page titles and `meta description` on public pages
- canonical URLs
- Open Graph metadata
- Twitter metadata
- `robots.txt`
- generated `sitemap.xml`
- JSON-LD blocks on selected pages
- `og:image:alt`
- a QA script covering selected metadata requirements

### Performance

The repository includes the following performance-related mechanisms:

- CSS and JS minification in the production build
- responsive images with `picture`, `srcset`, AVIF, and WebP
- image generation pipeline through sharp with width, format, and quality configuration in `image.config.json`
- `loading="lazy"` and `decoding="async"` on selected images
- explicit image `width` and `height` attributes
- local `woff2` fonts
- modular JavaScript loaded from a single ESM entry point
- generated service worker caching `offline.html`, `main.min.css`, and `main.min.js`

The repository does not include Lighthouse or Core Web Vitals measurement results.

### Project Maintenance

- `css/main.css` defines the CSS import order.
- `js/main.js` initializes front-end modules.
- `src/partials/` contains the shared HTML shell.
- `scripts/build-utils.mjs` contains the core build, HTML assembly, sitemap generation, and service worker logic.
- `scripts/qa/` contains automated checks for output and selected source HTML concerns.
- `contact-form-support.php`, `contact.php`, and `contact-submit.php` contain the contact-form logic.
- `dist/` is generated build output; source changes should be made outside `dist/`.

### License

The repository declares the `UNLICENSED` license in `package.json`.
