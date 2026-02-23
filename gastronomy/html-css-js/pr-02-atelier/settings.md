# settings.md

## npm scripts (source: `package.json`)

### `build:css`
- script name: `build:css`
- command: `postcss css/style.css -o css/style.min.css --no-map`
- what it does: Buduje i minifikuje arkusz główny do `css/style.min.css`.
- when to use it: Po zmianach w CSS, przed release/deploy.

### `build:js`
- script name: `build:js`
- command: `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- what it does: Bundluje i minifikuje JS entrypoint do `js/script.min.js`.
- when to use it: Po zmianach w JS, przed release/deploy.

### `build`
- script name: `build`
- command: `npm run build:css && npm run build:js`
- what it does: Uruchamia pełny build frontendu (CSS + JS).
- when to use it: Standardowy krok przygotowania artefaktów produkcyjnych.

### `images:build`
- script name: `images:build`
- command: `node scripts/images/build-images.js`
- what it does: Generuje/aktualizuje zoptymalizowane warianty obrazów.
- when to use it: Po dodaniu nowych grafik lub zmianie źródeł obrazów.

### `dev:server`
- script name: `dev:server`
- command: `http-server -p 5173 -c-1`
- what it does: Uruchamia lokalny serwer statyczny na porcie `5173` bez cache.
- when to use it: Lokalny development, test ręczny stron i nawigacji.

### `lint`
- script name: `lint`
- command: `eslint "js/**/*.js"`
- what it does: Lintuje kod JavaScript według reguł ESLint.
- when to use it: Przed commitem/PR i w quality gate.

### `validate:html`
- script name: `validate:html`
- command: `html-validate "*.html"`
- what it does: Waliduje pliki HTML w katalogu głównym.
- when to use it: Po każdej zmianie struktury HTML.

### `check:links`
- script name: `check:links`
- command: `linkinator http://127.0.0.1:5173/ http://127.0.0.1:5173/about.html http://127.0.0.1:5173/menu.html http://127.0.0.1:5173/gallery.html http://127.0.0.1:5173/cookies.html http://127.0.0.1:5173/polityka-prywatnosci.html http://127.0.0.1:5173/regulamin.html http://127.0.0.1:5173/offline.html http://127.0.0.1:5173/thank-you.html http://127.0.0.1:5173/404.html --recurse --check-fragments --silent --concurrency 4 --timeout 10000 --retry --skip "^https://"`
- what it does: Crawluje lokalny serwis i sprawdza linki/fragmenty, z pominięciem zewnętrznych `https://`.
- when to use it: Po zmianach linków, anchorów, nawigacji i stopki/headera.

### `check:a11y`
- script name: `check:a11y`
- command: `pa11y-ci`
- what it does: Uruchamia automatyczny audyt dostępności dla skonfigurowanych URL.
- when to use it: Po zmianach UI, kolorystyki, komponentów interaktywnych.

### `check:server`
- script name: `check:server`
- command: `cross-env WAIT_ON_TIMEOUT=60000 WAIT_ON_INTERVAL=250 start-server-and-test dev:server http-get://127.0.0.1:5173 "npm run check:links && npm run check:a11y"`
- what it does: Uruchamia lokalny serwer i wykonuje sekwencyjnie link-check oraz a11y-check po gotowości HTTP.
- when to use it: Gdy potrzebny jest pełny QA na lokalnym serwerze (cross-platform).

### `check`
- script name: `check`
- command: `npm run lint && npm run validate:html && npm run check:server`
- what it does: Uruchamia kompletną bramkę jakości projektu.
- when to use it: Przed merge, release i deploy.
