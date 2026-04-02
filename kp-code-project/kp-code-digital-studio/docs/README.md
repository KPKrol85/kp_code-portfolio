# README

## PL

### Przegląd projektu

`kp-code-digital-studio` to statyczny serwis front-endowy z własnym buildem Node.js oraz obsługą formularza kontaktowego w PHP. Repozytorium zawiera wielostronicowy serwis HTML, modularny CSS, modularny JavaScript, zasoby PWA oraz skrypty build/QA.

### Kluczowe cechy

- Wielostronicowa struktura HTML z oddzielnymi stronami głównymi, usług, projektów, treści prawnych i podstron portfolio.
- Wspólny `header` i `footer` składane podczas builda z `src/partials/`.
- Architektura CSS rozdzielona na `tokens`, `base`, `layout`, `components`, `sections`, `pages` i `utilities`.
- JavaScript modułowy dla motywu, nawigacji mobilnej, smooth scroll, reveal animations, filtrowania projektów, formularza i rejestracji service workera.
- Formularz kontaktowy z progresywnym ulepszeniem po stronie klienta i serwerową obsługą PHP/PHPMailer.
- Build produkcyjny generujący kompletne, ale odchudzone `dist/` jako artefakt deployowy: HTML, runtime assety, runtime PHP, minimalny runtime subset `vendor/`, `.htaccess`, minifikowane assety oraz `sitemap.xml`.
- QA dla wygenerowanego `dist/` sprawdzające strukturę, assembly HTML, lokalne referencje oraz kompletność runtime PHP.

### Tech stack

- HTML5
- CSS z custom properties i self-hosted fontem `Space Grotesk`
- JavaScript ES modules
- Node.js + `esbuild` + `lightningcss` + `fast-glob` + `sharp`
- PHP + PHPMailer dla formularza kontaktowego

### Struktura projektu

```text
assets/              zasoby statyczne, ikony, fonty, obrazy, OG
css/                 warstwy stylów źródłowych
js/                  główne wejście i moduły front-endowe
projects/            podstrony projektów
services/            podstrony usług
scripts/             build, preview, QA i przetwarzanie obrazów
src/partials/        współdzielone partiale header/footer
dist/                wygenerowany output builda
index.html           strona główna źródłowa
service-worker.js    source service worker
robots.txt           source robots
contact.php          strona kontaktu po stronie PHP
contact-submit.php   endpoint wysyłki formularza
composer.json        zależność PHPMailer
package.json         skrypty npm i zależności buildowe
```

### Setup i uruchomienie

Wymagania:

- Node.js `>=18.0.0` (`package.json:37-39`)
- npm
- PHP, jeśli ma działać obsługa formularza
- Composer, jeśli ma być instalowany backend formularza od zera

Instalacja:

```bash
npm install
composer install
```

Najczęstsze komendy:

```bash
npm run build
npm run qa
npm run preview
```

### Build i wdrożenie

- `npm run build` uruchamia `scripts/build-dist.mjs`, który czyści `dist/`, bundluje CSS i JS, składa HTML z partiali, kopiuje tylko runtime assety, kopiuje runtime PHP formularza, `.htaccess`, minimalny runtime subset `vendor/`, `robots.txt`, generuje `sitemap.xml` jako artefakt builda i renderuje finalny `service-worker.js`.
- Build przepisuje referencje z `main.css` / `main.js` na `main.min.css` / `main.min.js` (`scripts/build-utils.mjs:92-98`).
- Konfiguracja formularza używa modelu `ENV first`: najpierw zmiennych środowiskowych PHP (`KP_CODE_SMTP_HOST`, `KP_CODE_SMTP_PORT`, `KP_CODE_SMTP_USERNAME`, `KP_CODE_SMTP_PASSWORD`, `KP_CODE_SMTP_SECURE`, `KP_CODE_MAIL_FROM_EMAIL`, `KP_CODE_MAIL_FROM_NAME`, `KP_CODE_MAIL_RECIPIENT_EMAIL`, `KP_CODE_CONTACT_REDIRECT_PATH`), a opcjonalnie prywatnego fallbacku `contact-mail.config.local.php` wykluczonego z Git.
- Jeśli lokalnie istnieje nieśledzony `contact-mail.config.local.php`, build kopiuje go do `dist/`, dzięki czemu upload samego `dist/` wystarcza także dla runtime formularza.
- `.htaccess` blokuje bezpośredni dostęp do `contact-mail.config.php` i `contact-mail.config.local.php` oraz przepisuje `contact.html` na `contact.php`.
- `dist/` jest docelowym katalogiem wdrożeniowym: po buildzie należy uploadować tylko jego zawartość, bez ręcznego dokładania plików PHP lub zależności.
- Rejestracja service workera działa tylko w secure context (`js/modules/service-worker.js:1-15`).

### Co zawiera `dist/`

- Publiczne strony HTML: `index.html`, `about.html`, `services.html`, `projects.html`, `contact.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `404.html`, `offline.html`, `in-progress.html`, `thank-you.html`, `ecosystem.html`, `case-digital-vault.html`, a także podstrony w `services/` i `projects/`.
- Zasoby front-endowe: `css/main.min.css`, `js/main.min.js`, runtime subset `assets/` bez `assets/img/img_src/`, `robots.txt`, `service-worker.js`, `sitemap.xml`.
- Runtime PHP formularza: `contact.php`, `contact-submit.php`, `contact-form-support.php`, `contact-mail.config.php`, opcjonalnie `contact-mail.config.local.php`, `.htaccess`, `src/partials/` oraz tylko runtime subset `vendor/` potrzebny Composer autoload i PHPMailer.
- Build celowo nie kopiuje do `dist/` plików development-only, w tym `docs/`, `scripts/`, `package*.json`, `composer*.json`, `image.config.json`, `.gitignore`, `contact-mail.config.example.php`, `assets/img/img_src/` oraz nieruntime plików PHPMailera.

### Dostępność

- Każda audytowana strona ma skip link do `#main`.
- Mobilna nawigacja używa `aria-expanded`, `aria-controls`, `aria-hidden`, obsługi `Escape`, zwrotu fokusu i pułapki fokusu (`src/partials/header.html:15-58`, `js/modules/navigation.js:22-150`).
- Globalny styl fokusu jest zdefiniowany przez `:focus-visible` (`css/base.css:129-131`).
- Obsługa `prefers-reduced-motion` jest obecna w tokenach i helperach reveal (`css/tokens.css:171-189`, `css/utilities.css:112-120`).
- Formularz kontaktowy ma działanie bez JavaScript dzięki `action="./contact-submit.php"` i `method="post"`, a JS dodaje walidację i submit asynchroniczny (`contact.html:186-193`, `js/modules/forms.js`).
- Zgodność kontrastu nie może zostać potwierdzona bez analizy computed styles.
- Wdrożenie produkcyjne wymaga ustawienia sekretów SMTP w środowisku serwera albo w prywatnym `contact-mail.config.local.php`, który nie powinien trafiać do repozytorium.

### SEO

- Strony źródłowe zawierają `meta description`, `canonical`, `robots`, Open Graph i Twitter Cards.
- `robots.txt` istnieje w katalogu głównym i wskazuje na `https://www.kp-code.pl/sitemap.xml` (`robots.txt:1-3`).
- `sitemap.xml` nie jest utrzymywany jako source file w katalogu głównym repozytorium; to świadoma decyzja projektowa. Mapa witryny jest generowana wyłącznie podczas builda i istnieje jako artefakt outputu w `dist/` (`scripts/build-utils.mjs:308-317`).
- JSON-LD jest obecny na głównych stronach contentowych, ale nie został wykryty na części stron pomocniczych, m.in. `404.html`, `offline.html`, `in-progress.html` i `thank-you.html`.
- Obraz OG istnieje w repozytorium: `assets/og/og-img.png`.

### Wydajność

- Font jest self-hosted i używa `font-display: swap` (`css/base.css:7-28`).
- Obrazy contentowe korzystają z wariantów AVIF/WebP/JPG oraz `width` / `height` / `loading="lazy"` tam, gdzie wdrożono `picture`.
- Build tworzy minifikowane assety CSS/JS do `dist/`.
- Service worker dostarcza prosty offline shell, ale jego source cache list zależy od plików buildowych (`service-worker.js:1-9`).

### Roadmap

- Wynieść bootstrap motywu z duplikowanego inline script do współdzielonego mechanizmu source.
- Ujednolicić manifest source tak, aby nie wymagał poprawiania ikon dopiero w `dist/`.
- Rozszerzyć QA o walidację metadanych SEO i structured data.
- Uporządkować obsługę sekretów formularza poza repozytorium.
- Domknąć spójność structured data i metadanych Open Graph na wszystkich publicznych stronach.

### Licencja

MIT (`package.json:36`)

## EN

### Project overview

`kp-code-digital-studio` is a static front-end website with a custom Node.js build pipeline and a PHP contact form handler. The repository contains a multi-page HTML site, modular CSS, modular JavaScript, PWA assets, and build/QA scripts.

### Key features

- Multi-page HTML structure for main pages, service pages, project pages, legal pages, and portfolio details.
- Shared `header` and `footer` assembled during build from `src/partials/`.
- CSS architecture split into `tokens`, `base`, `layout`, `components`, `sections`, `pages`, and `utilities`.
- Modular JavaScript for theme handling, mobile navigation, smooth scrolling, reveal animations, project filtering, form enhancement, and service worker registration.
- Contact form with progressive enhancement on the client and PHP/PHPMailer handling on the server.
- Production build that generates complete but trimmed `dist/` as the deploy artifact: HTML, runtime assets, PHP runtime, a minimal runtime `vendor/` subset, `.htaccess`, minified assets, and `sitemap.xml`.
- QA checks for generated `dist/` structure, HTML assembly, local references, and PHP runtime completeness.

### Tech stack

- HTML5
- CSS with custom properties and self-hosted `Space Grotesk`
- JavaScript ES modules
- Node.js + `esbuild` + `lightningcss` + `fast-glob` + `sharp`
- PHP + PHPMailer for the contact form

### Structure overview

```text
assets/              static assets, icons, fonts, images, OG
css/                 source style layers
js/                  main entry and front-end modules
projects/            project detail pages
services/            service detail pages
scripts/             build, preview, QA, and image processing
src/partials/        shared header/footer partials
dist/                generated build output
index.html           source home page
service-worker.js    source service worker
robots.txt           source robots file
contact.php          PHP contact page
contact-submit.php   form submission endpoint
composer.json        PHPMailer dependency
package.json         npm scripts and build dependencies
```

### Setup and run

Requirements:

- Node.js `>=18.0.0`
- npm
- PHP if form handling must work
- Composer if the form backend is installed from scratch

Install:

```bash
npm install
composer install
```

Common commands:

```bash
npm run build
npm run qa
npm run preview
```

### Build and deployment notes

- `npm run build` runs `scripts/build-dist.mjs`, which clears `dist/`, bundles CSS and JS, assembles HTML from partials, copies only runtime assets, copies the PHP form runtime, `.htaccess`, a minimal runtime `vendor/` subset, `robots.txt`, generates `sitemap.xml` as a build artifact, and renders the final `service-worker.js`.
- The build rewrites `main.css` / `main.js` references to `main.min.css` / `main.min.js` (`scripts/build-utils.mjs:92-98`).
- The contact form configuration now uses an `ENV first` pattern: PHP environment variables (`KP_CODE_SMTP_HOST`, `KP_CODE_SMTP_PORT`, `KP_CODE_SMTP_USERNAME`, `KP_CODE_SMTP_PASSWORD`, `KP_CODE_SMTP_SECURE`, `KP_CODE_MAIL_FROM_EMAIL`, `KP_CODE_MAIL_FROM_NAME`, `KP_CODE_MAIL_RECIPIENT_EMAIL`, `KP_CODE_CONTACT_REDIRECT_PATH`) take precedence, with an optional private `contact-mail.config.local.php` fallback excluded from Git.
- If a local untracked `contact-mail.config.local.php` exists, the build copies it into `dist/` so deploying `dist/` alone remains sufficient for the form runtime.
- `.htaccess` denies direct access to both `contact-mail.config.php` and `contact-mail.config.local.php`, and rewrites `contact.html` to `contact.php`.
- `dist/` is the deployment directory; after the build, only its contents should be uploaded to the server.
- Service worker registration is gated behind secure context checks (`js/modules/service-worker.js:1-15`).

### What `dist/` contains

- Public HTML pages: `index.html`, `about.html`, `services.html`, `projects.html`, `contact.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `404.html`, `offline.html`, `in-progress.html`, `thank-you.html`, `ecosystem.html`, `case-digital-vault.html`, plus nested pages in `services/` and `projects/`.
- Front-end assets: `css/main.min.css`, `js/main.min.js`, the runtime subset of `assets/` without `assets/img/img_src/`, `robots.txt`, `service-worker.js`, `sitemap.xml`.
- PHP form runtime: `contact.php`, `contact-submit.php`, `contact-form-support.php`, `contact-mail.config.php`, optional `contact-mail.config.local.php`, `.htaccess`, `src/partials/`, and only the runtime subset of `vendor/` needed by Composer autoload and PHPMailer.
- The build intentionally excludes development-only files from `dist/`, including `docs/`, `scripts/`, `package*.json`, `composer*.json`, `image.config.json`, `.gitignore`, `contact-mail.config.example.php`, `assets/img/img_src/`, and non-runtime PHPMailer docs/examples/tests/metadata files.

### Accessibility notes

- Every audited page includes a skip link to `#main`.
- Mobile navigation uses `aria-expanded`, `aria-controls`, `aria-hidden`, `Escape` handling, focus return, and focus trapping (`src/partials/header.html:15-58`, `js/modules/navigation.js:22-150`).
- Global focus styling is defined through `:focus-visible` (`css/base.css:129-131`).
- `prefers-reduced-motion` handling exists in tokens and reveal helpers (`css/tokens.css:171-189`, `css/utilities.css:112-120`).
- The contact form keeps a no-JS baseline through `action="./contact-submit.php"` and `method="post"`, while JavaScript adds validation and async submission (`contact.html:186-193`, `js/modules/forms.js`).
- Contrast compliance cannot be verified without computed style analysis.
- Production deployment requires SMTP secrets to be provided through server environment variables or a private `contact-mail.config.local.php` file that is not committed.

### SEO notes

- Source pages include `meta description`, `canonical`, `robots`, Open Graph, and Twitter Card metadata.
- `robots.txt` exists at project root and points to `https://www.kp-code.pl/sitemap.xml` (`robots.txt:1-3`).
- `sitemap.xml` is not maintained as a source file in the repository root by design. The sitemap is generated only during the build and exists as a build output artifact in `dist/` (`scripts/build-utils.mjs:308-317`).
- JSON-LD exists on major content pages, but was not detected on some utility pages such as `404.html`, `offline.html`, `in-progress.html`, and `thank-you.html`.
- The OG image file exists in the repository at `assets/og/og-img.png`.

### Performance notes

- The font is self-hosted and uses `font-display: swap` (`css/base.css:7-28`).
- Content images use AVIF/WebP/JPG variants plus explicit `width` / `height` and `loading="lazy"` where implemented.
- The build outputs minified CSS and JS for `dist/`.
- The service worker provides a simple offline shell, but its source cache list depends on build artifacts (`service-worker.js:1-9`).

### Roadmap

- Move the theme bootstrap out of duplicated inline scripts into a shared source mechanism.
- Make source manifest paths self-consistent so they do not rely on post-build icon rewriting.
- Extend QA to validate SEO metadata and structured data consistency.
- Move form secrets out of the repository.
- Complete structured data and Open Graph metadata consistency across all public pages.

### License

MIT (`package.json:36`)
