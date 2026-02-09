# Axiom Construction — landing page firmy budowlanej (PWA)

Profesjonalny landing page dla fikcyjnej firmy budowlanej, przygotowany jako projekt portfolio z naciskiem na wydajność, dostępność i produkcyjną jakość front-endu.

## Najważniejsze funkcje / highlights

- Responsywny layout i sekcje usług dopasowane do oferty firmy.
- Modularny CSS i JS z osobnymi entrypointami dla DEV i PROD.
- PWA z Service Workerem: precache zasobów, runtime caching HTML, offline fallback.
- Security headers i CSP bez `unsafe-inline`.
- SEO: semantyka, sitemap, robots, oraz structured data (LocalBusiness + FAQPage; bez Review).
- Automatyczne QA (Lighthouse + Pa11y) z raportami w `reports/`.

## Tech stack

- HTML5
- CSS3 (modularna architektura, CSS custom properties, build przez cssnano)
- JavaScript (ES6, vanilla, build przez terser)
- PWA (manifest + Service Worker)
- Narzędzia QA: Lighthouse (LHCI), Pa11y
- Netlify (deploy + headers)

## Lokalny start (install + serve)

1. Instalacja zależności:
   ```bash
   npm install
   ```
2. Uruchomienie lokalnego serwera (port 8080):
   ```bash
   npm run serve
   ```
3. Otwórz w przeglądarce:
   ```
   http://localhost:8080
   ```

## Development vs Production

**DEV entrypoints** (praca lokalna / edycja źródeł):
- `css/main.css`
- `js/main.js`

**PROD assets** (wczytywane przez HTML):
- `dist/style.min.css`
- `dist/script.min.js`

**Build komendy:**
```bash
npm run build:css
npm run build:js
npm run build
```

## PWA / Service Worker

- **Precache**: kluczowe zasoby i shell aplikacji (CSS/JS, favicon, offline.html).
- **Runtime caching HTML**: żądania dokumentów HTML są cachowane po udanym fetchu.
- **Fallback offline**: w przypadku błędu sieci zwracany jest `offline.html`.
- **Cache-first** dla CSS/JS oraz obrazów z aktualizacją w tle.

Service Worker: `sw.js`.

## SEO / Structured data

- Dane strukturalne w `js/structured-data/`.
- Typy: **LocalBusiness (HomeAndConstructionBusiness)** oraz **FAQPage**.
- Brak danych typu **Review** (świadomie pominięte).

## QA (Lighthouse / Pa11y)

1. Uruchom lokalny serwer:
   ```bash
   npm run serve
   ```
2. Odpal QA:
   ```bash
   npm run qa
   ```

Dostępne komendy:
```bash
npm run qa:lighthouse
npm run qa:a11y
```

Raporty zapisują się w:
- `reports/lighthouse/`
- `reports/pa11y/`

## Deploy (Netlify)

1. Build projektu:
   ```bash
   npm run build
   ```
2. Publish directory: repozytorium projektu (root).
3. Netlify wykorzystuje pliki `_headers` i `_redirects` do konfiguracji nagłówków oraz routingu.

## Struktura katalogów

```
pr-02-axiom/
├── assets/               # obrazy, fonty, ikony
├── css/                  # modularny CSS (DEV entry)
├── dist/                 # zminifikowane zasoby (PROD)
├── js/                   # modularny JS (DEV entry)
├── legal/                # podstrony prawne
├── services/             # podstrony usług
├── tools/                # skrypty build/opt
├── reports/              # raporty QA (generowane)
├── _headers              # security headers + CSP
├── _redirects            # reguły routingu
├── sw.js                 # Service Worker
├── manifest.webmanifest  # PWA manifest
├── offline.html          # offline fallback
└── index.html            # strona główna
```

## Autor

Kamil Król — **KP_Code**

---

# Axiom Construction — construction company landing page (PWA)

A professional landing page for a fictional construction company, built as a portfolio project with a focus on performance, accessibility, and production-ready front-end quality.

## Key features / highlights

- Responsive layout and service sections tailored to the company offer.
- Modular CSS and JS with dedicated DEV and PROD entrypoints.
- PWA with Service Worker: asset precache, runtime HTML caching, offline fallback.
- Security headers and CSP without `unsafe-inline`.
- SEO: semantic structure, sitemap, robots, and structured data (LocalBusiness + FAQPage; no Review).
- Automated QA (Lighthouse + Pa11y) with reports in `reports/`.

## Tech stack

- HTML5
- CSS3 (modular architecture, CSS custom properties, built with cssnano)
- JavaScript (ES6, vanilla, built with terser)
- PWA (manifest + Service Worker)
- QA tooling: Lighthouse (LHCI), Pa11y
- Netlify (deploy + headers)

## Local start (install + serve)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local server (port 8080):
   ```bash
   npm run serve
   ```
3. Open in browser:
   ```
   http://localhost:8080
   ```

## Development vs Production

**DEV entrypoints** (local work / source editing):
- `css/main.css`
- `js/main.js`

**PROD assets** (loaded by HTML):
- `dist/style.min.css`
- `dist/script.min.js`

**Build commands:**
```bash
npm run build:css
npm run build:js
npm run build
```

## PWA / Service Worker

- **Precache**: core assets and app shell (CSS/JS, favicon, offline.html).
- **Runtime HTML caching**: HTML documents are cached after a successful fetch.
- **Offline fallback**: `offline.html` is served on network errors.
- **Cache-first** for CSS/JS and images with background update.

Service Worker: `sw.js`.

## SEO / Structured data

- Structured data lives in `js/structured-data/`.
- Types: **LocalBusiness (HomeAndConstructionBusiness)** and **FAQPage**.
- **No Review** schema is included (intentionally omitted).

## QA (Lighthouse / Pa11y)

1. Start a local server:
   ```bash
   npm run serve
   ```
2. Run QA:
   ```bash
   npm run qa
   ```

Available commands:
```bash
npm run qa:lighthouse
npm run qa:a11y
```

Reports are stored in:
- `reports/lighthouse/`
- `reports/pa11y/`

## Deploy (Netlify)

1. Build the project:
   ```bash
   npm run build
   ```
2. Publish directory: project root.
3. Netlify uses `_headers` and `_redirects` to configure headers and routing.

## Directory structure

```
pr-02-axiom/
├── assets/               # images, fonts, icons
├── css/                  # modular CSS (DEV entry)
├── dist/                 # minified assets (PROD)
├── js/                   # modular JS (DEV entry)
├── legal/                # legal subpages
├── services/             # service subpages
├── tools/                # build/opt scripts
├── reports/              # QA reports (generated)
├── _headers              # security headers + CSP
├── _redirects            # routing rules
├── sw.js                 # Service Worker
├── manifest.webmanifest  # PWA manifest
├── offline.html          # offline fallback
└── index.html            # home page
```

## Author

Kamil Król — **KP_Code**
