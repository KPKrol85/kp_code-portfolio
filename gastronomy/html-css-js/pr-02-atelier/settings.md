# settings.md

## npm scripts (`package.json`)

### `build:css`
- script name: `build:css`
- command: `postcss css/style.css -o css/style.min.css --no-map`
- what it does: Buduje i minifikuje CSS do `css/style.min.css`.
- when to use it: Po zmianach w CSS przed testami wydajności lub wdrożeniem.

### `build:js`
- script name: `build:js`
- command: `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- what it does: Bundluje i minifikuje JS do `js/script.min.js`.
- when to use it: Po zmianach w `js/` przed wdrożeniem.

### `build`
- script name: `build`
- command: `npm run build:css && npm run build:js`
- what it does: Uruchamia pełny build CSS + JS.
- when to use it: Standardowy krok release.

### `images:build`
- script name: `images:build`
- command: `node scripts/images/build-images.js`
- what it does: Generuje zoptymalizowane warianty obrazów.
- when to use it: Po dodaniu/zmianie obrazów źródłowych.

### `dev:server`
- script name: `dev:server`
- command: `http-server -p 5173 -c-1`
- what it does: Uruchamia lokalny serwer statyczny na porcie 5173 bez cache.
- when to use it: Do lokalnych testów UI i linków.

### `lint`
- script name: `lint`
- command: `eslint "js/**/*.js"`
- what it does: Sprawdza jakość i reguły kodu JavaScript.
- when to use it: Przed commitem i przed PR.

### `validate:html`
- script name: `validate:html`
- command: `html-validate "*.html"`
- what it does: Waliduje semantykę i reguły HTML dla plików w root.
- when to use it: Po zmianach w HTML i przed wdrożeniem.

### `check:links`
- script name: `check:links`
- command: `linkinator http://127.0.0.1:5173 ... --recurse --check-fragments --silent --concurrency 4 --timeout 10000 --retry 1 --skip '^https?://(?!127\.0\.0\.1:5173)'`
- what it does: Crawluje linki i fragmenty `#id` dla lokalnego środowiska.
- when to use it: Po zmianach linków, nawigacji lub routingów.

### `check:a11y`
- script name: `check:a11y`
- command: `pa11y-ci`
- what it does: Uruchamia automatyczne testy dostępności według `.pa11yci`.
- when to use it: Po zmianach UI/interakcji oraz przed publikacją.

### `check:server`
- script name: `check:server`
- command: `WAIT_ON_TIMEOUT=60000 WAIT_ON_INTERVAL=250 start-server-and-test dev:server http-get://127.0.0.1:5173 "npm run check:links && npm run check:a11y"`
- what it does: Uruchamia serwer i wykonuje link-check oraz a11y-check po osiągnięciu gotowości.
- when to use it: W pipeline quality (głównie środowiska zgodne z UNIX env syntax).

### `check`
- script name: `check`
- command: `npm run lint && npm run validate:html && npm run check:server`
- what it does: Uruchamia pełen pakiet quality checks.
- when to use it: Przed merge/deploy.
