# settings.md

## npm scripts

### `build:css`

- Command: `node ./scripts/build-css.mjs`
- What it does: bundluje źródłowe style z `css/main.css` do produkcyjnego `dist/css/main.min.css` przez `lightningcss`.
- When to use it: gdy chcesz odświeżyć tylko CSS bez pełnego builda.

### `build:js`

- Command: `node ./scripts/build-js.mjs`
- What it does: bundluje `js/main.js` i moduły zależne do `dist/js/main.min.js` przez `esbuild`.
- When to use it: gdy zmiany dotyczą tylko JavaScriptu.

### `build:dist`

- Command: `node ./scripts/build-dist.mjs`
- What it does: czyści `dist/`, buduje CSS i JS, składa HTML z partiali, kopiuje tylko runtime assety, runtime PHP formularza, `.htaccess`, minimalny runtime subset `vendor/`, `robots.txt`, renderuje finalny service worker i generuje `sitemap.xml` jako artefakt outputu `dist/`.
- When to use it: przed lokalnym preview, QA albo wdrożeniem.

### `build`

- Command: `npm run build:dist`
- What it does: alias do pełnego builda produkcyjnego, który tworzy kompletne `dist/` jako katalog deployowy dla frontendu i runtime PHP.
- When to use it: jako domyślna komenda budowania projektu.

### `format`

- Command: `prettier . --write`
- What it does: formatuje repozytorium zgodnie z konfiguracją Prettier.
- When to use it: po zmianach w kodzie lub dokumentacji, gdy chcesz zapisać automatyczne formatowanie.

### `format:check`

- Command: `prettier . --check`
- What it does: sprawdza, czy pliki są zgodne z regułami Prettier bez modyfikowania ich.
- When to use it: w lokalnej kontroli jakości albo przed commitem/CI.

### `qa`

- Command: `npm run build && node ./scripts/qa/run-qa.mjs`
- What it does: wykonuje pełny build, a następnie sprawdza strukturę `dist/`, assembly HTML, lokalne referencje, kompletność runtime PHP i brak znanych nieruntime plików w artefakcie.
- When to use it: przed publikacją lub po większych zmianach w HTML/build/deploy flow.

## dist/

- `dist/` jest docelowym artefaktem wdrożeniowym.
- Po `npm run build` uploadujesz tylko zawartość `dist/`.
- `dist/` zawiera:
  - publiczne strony HTML z root oraz podkatalogów `services/` i `projects/`
  - `css/main.min.css` i `js/main.min.js`
  - runtime subset katalogu `assets/`, bez `assets/img/img_src/`
  - `robots.txt`, `service-worker.js`, `sitemap.xml`
  - runtime PHP formularza: `contact.php`, `contact-submit.php`, `contact-form-support.php`, `contact-mail.config.php`
  - opcjonalnie `contact-mail.config.local.php`, jeśli istnieje lokalnie podczas builda
  - `.htaccess`, `src/partials/`, `vendor/autoload.php`, `vendor/composer/`, `vendor/phpmailer/phpmailer/src/`
- `dist/` nie powinien zawierać plików development-only, `contact-mail.config.example.php`, `assets/img/img_src/` ani nieruntime plików PHPMailera.

### `preview`

- Command: `node ./scripts/preview-dist.mjs`
- What it does: uruchamia prosty lokalny serwer HTTP dla zbudowanego katalogu `dist/`.
- When to use it: po `npm run build`, gdy chcesz sprawdzić wynik builda lokalnie.

### `build:preview`

- Command: `npm run build && npm run preview`
- What it does: buduje projekt i od razu wystawia lokalny preview `dist/`.
- When to use it: gdy potrzebujesz szybkiego sprawdzenia wersji produkcyjnej jednym poleceniem.

### `img:build`

- Command: `node ./scripts/images/build-images.mjs`
- What it does: generuje zoptymalizowane warianty obrazów na podstawie konfiguracji i źródeł wejściowych.
- When to use it: po dodaniu nowych obrazów źródłowych albo zmianie strategii optymalizacji.

### `img:clean`

- Command: `node ./scripts/images/clean-images.mjs`
- What it does: czyści wygenerowane outputy obrazów.
- When to use it: gdy trzeba przebudować obrazy od zera lub usunąć stare warianty.

## package.json

`package.json` detected in project: [package.json](C:/Users/KPKro/MY%20FILES/active-work/kp-code-digital-studio/package.json)
