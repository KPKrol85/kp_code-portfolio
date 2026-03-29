# Settings

## PL

### Przegląd
- Workflow jest `source-first`: development pracuje na `css/main.css` i `js/main.js`.
- Produkcja generuje `css/main.min.css` i `js/main.min.js`.
- Finalna paczka wdrożeniowa powstaje w `dist/`.
- Źródłowe HTML pozostają na assetach nieminizowanych; HTML w `dist/` używa tylko assetów produkcyjnych.

### Źródła prawdy
- Skrypty npm: `package.json`
- Pakowanie deployowe: `scripts/build-dist.js`
- Wymagane środowisko: `Node.js >= 18`

### Główne komendy
- `npm run build:css`
  Generuje `css/main.min.css` z `css/main.css`.
- `npm run build:js`
  Bundluje i minifikuje `js/main.js` do `js/main.min.js`.
- `npm run build:assets`
  Uruchamia build CSS i JS.
- `npm run build:dist`
  Czyści `dist/`, kopiuje tylko pliki potrzebne w runtime i przepisuje HTML na assety `.min`.
- `npm run build`
  Pełny build produkcyjny: assety + paczka `dist/`.

### QA
- `npm run qa`
  Główny quality gate: HTML, JSON-LD, linki, JS, CSS.
- `npm run format:html-tight`
  Formatuje wszystkie pliki HTML przez Prettiera, a następnie usuwa zbędne puste linie w sekcji `<head>`. Używaj tej komendy zamiast samego `Format Document`, jeśli chcesz zachować zwarty układ nagłówka HTML.
- `npm run qa:html`
  Waliduje `index.html`, `404.html`, `offline.html` i główne pliki w `pages/`.
- `npm run validate:jsonld`
  Sprawdza JSON-LD i reguły template-specific.
- `npm run qa:links`
  Sprawdza linki wewnętrzne HTML.
- `npm run qa:js`
  Lintuje źródłowy JS, `scripts/**/*.js` i `tools/**/*.mjs`, z wykluczeniem `.min.js`.
- `npm run qa:css`
  Lintuje źródłowy CSS, z wykluczeniem `.min.css`.
- `npm run qa:smoke`
  Lighthouse smoke w trybie raportowym.
- `npm run qa:smoke:enforce`
  Lighthouse smoke z egzekwowaniem progów.

### Zachowanie `dist`
- `dist/` jest czyszczony przy każdym pakowaniu.
- Do `dist/` trafiają:
  `index.html`, `404.html`, `offline.html`, `pages/`, `assets/`, `data/`, `site.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `humans.txt`, `css/main.min.css`, `js/main.min.js`.
- Do `dist/` nie trafiają źródłowe `css/main.css` i `js/main.js`.
- Skrypt pakujący dodatkowo sprawdza, że HTML w `dist/` nie odwołuje się już do `main.css` ani `main.js`.

### Ważne uwagi
- Projekt nie ma dedykowanego skryptu `dev`.
- Build JS używa `esbuild`, bo aplikacja działa na modułach ES.
- Build CSS rozwiązuje `@import` przed minifikacją.
- `dist/` jest jedynym artefaktem deployowym.
- `npm run qa` jest poprawnie podłączony, ale może failować na realnych błędach źródła.
- Aktualnie zweryfikowany caveat: `qa:html` zgłasza regułę `tel-non-breaking` dla numeru telefonu w `pages/contact.html`, jeśli zapis numeru nie używa twardych spacji.

---

## EN

### Overview
- The workflow is `source-first`: development uses `css/main.css` and `js/main.js`.
- Production generates `css/main.min.css` and `js/main.min.js`.
- The final deploy package is built into `dist/`.
- Source HTML stays on non-minified assets; HTML inside `dist/` is rewritten to production assets only.

### Source of truth
- npm scripts: `package.json`
- Deploy packaging: `scripts/build-dist.js`
- Required runtime: `Node.js >= 18`

### Main commands
- `npm run build:css`
  Generates `css/main.min.css` from `css/main.css`.
- `npm run build:js`
  Bundles and minifies `js/main.js` into `js/main.min.js`.
- `npm run build:assets`
  Runs both CSS and JS production builds.
- `npm run build:dist`
  Cleans `dist/`, copies runtime-required files only, and rewrites HTML to `.min` assets.
- `npm run build`
  Full production build: assets plus final `dist/` package.

### QA
- `npm run qa`
  Main quality gate: HTML, JSON-LD, links, JS, CSS.
- `npm run qa:html`
  Validates `index.html`, `404.html`, `offline.html`, and the main files in `pages/`.
- `npm run validate:jsonld`
  Validates JSON-LD and template-specific rules.
- `npm run qa:links`
  Validates internal HTML links.
- `npm run qa:js`
  Lints source JS, `scripts/**/*.js`, and `tools/**/*.mjs`, excluding `.min.js`.
- `npm run qa:css`
  Lints source CSS, excluding `.min.css`.
- `npm run qa:smoke`
  Runs Lighthouse smoke checks in report mode.
- `npm run qa:smoke:enforce`
  Runs Lighthouse smoke checks with enforced thresholds.

### `dist` behavior
- `dist/` is cleaned on every packaging run.
- `dist/` includes:
  `index.html`, `404.html`, `offline.html`, `pages/`, `assets/`, `data/`, `site.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `humans.txt`, `css/main.min.css`, `js/main.min.js`.
- Source `css/main.css` and `js/main.js` are not copied into `dist/`.
- The packaging script also verifies that HTML inside `dist/` no longer references `main.css` or `main.js`.

### Important notes
- The project currently has no dedicated `dev` script.
- `npm run format:html-tight`
  Formats all HTML files with Prettier and then removes extra blank lines inside the `<head>` section. Use this instead of plain `Format Document` when you want compact HTML head spacing in this project.
- The JS build uses `esbuild` because the app runs on ES modules.
- The CSS build resolves `@import` before minification.
- `dist/` is the only deploy-ready artifact.
- `npm run qa` is wired correctly, but it can still fail on real source issues.
- Current verified caveat: `qa:html` reports the `tel-non-breaking` rule on the contact-page phone number if the visible number format does not use non-breaking spaces.
