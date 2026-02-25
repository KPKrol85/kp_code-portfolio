# settings.md

## package.json scripts

Strategia projektu:
- Lokalny development działa na nie-minifikowanych assetach (`css/style.css`, `js/script.js`).
- Assety `.min` są generowane na etapie build/deploy i nie są wymagane do codziennej pracy developerskiej.

### `build:css`
- command: `postcss css/style.css -o css/style.min.css --no-map`
- what it does: kompiluje i minifikuje główny arkusz CSS do `css/style.min.css`.
- when to use: przed publikacją lub przy przygotowaniu artefaktów produkcyjnych.

### `build:js`
- command: `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- what it does: bundluje moduły JS i tworzy zminifikowany plik `js/script.min.js`.
- when to use: przed wdrożeniem produkcyjnym.

### `build`
- command: `npm run build:css && npm run build:js`
- what it does: uruchamia pełny build assetów CSS i JS.
- when to use: standardowo przed deploymentem.

### `images:build`
- command: `node scripts/images/build-images.js`
- what it does: generuje zoptymalizowane warianty obrazów na podstawie skryptu image pipeline.
- when to use: po dodaniu/aktualizacji obrazów źródłowych.

### `dev:server`
- command: `http-server -p 5173 -c-1`
- what it does: uruchamia lokalny serwer statyczny na porcie `5173` z wyłączonym cache.
- when to use: podczas developmentu i lokalnych testów.

### `lint`
- command: `eslint "js/**/*.js"`
- what it does: sprawdza jakość i zgodność kodu JavaScript z regułami lint.
- when to use: przed commitem/PR oraz w CI.

### `validate:html`
- command: `html-validate "*.html"`
- what it does: waliduje pliki HTML w katalogu głównym projektu.
- when to use: po zmianach markup i przed release.

### `check:links`
- command: `npm run check:links:dev`
- what it does: alias na developerski wariant link-checka ignorujący referencje do `.min.css/.min.js`.
- when to use: dla kompatybilności ze starszymi workflow lub ręcznie, gdy potrzebny jest szybki skrót.

### `check:links:dev`
- command: `linkinator http://127.0.0.1:5173/ http://127.0.0.1:5173/about.html http://127.0.0.1:5173/menu.html http://127.0.0.1:5173/gallery.html http://127.0.0.1:5173/cookies.html http://127.0.0.1:5173/polityka-prywatnosci.html http://127.0.0.1:5173/regulamin.html http://127.0.0.1:5173/offline.html http://127.0.0.1:5173/thank-you.html http://127.0.0.1:5173/404.html --recurse --check-fragments --silent --concurrency 4 --timeout 10000 --retry --skip "^https://|\\.min\\.(css|js)(\\?.*)?$"`
- what it does: sprawdza linki i fragmenty na lokalnym serwerze oraz pomija wyłącznie referencje do assetów `.min` (strategia dev).
- when to use: codziennie w development, gdy projekt działa na nie-minifikowanych plikach.

### `check:links:prod`
- command: `linkinator http://127.0.0.1:5173/ http://127.0.0.1:5173/about.html http://127.0.0.1:5173/menu.html http://127.0.0.1:5173/gallery.html http://127.0.0.1:5173/cookies.html http://127.0.0.1:5173/polityka-prywatnosci.html http://127.0.0.1:5173/regulamin.html http://127.0.0.1:5173/offline.html http://127.0.0.1:5173/thank-you.html http://127.0.0.1:5173/404.html --recurse --check-fragments --silent --concurrency 4 --timeout 10000 --retry --skip "^https://"`
- what it does: sprawdza linki i fragmenty bez ignorowania `.min.css/.min.js`.
- when to use: przed release/na CI po wygenerowaniu artefaktów build (`npm run build`).

### `check:a11y`
- command: `pa11y-ci`
- what it does: uruchamia automatyczny test dostępności WCAG2AA na listę URL z `.pa11yci`.
- when to use: po zmianach UI/CSS/HTML oraz przed publikacją.

### `check:server`
- command: `cross-env WAIT_ON_TIMEOUT=60000 WAIT_ON_INTERVAL=250 start-server-and-test dev:server http-get://127.0.0.1:5173 "npm run check:links:dev && npm run check:a11y"`
- what it does: uruchamia serwer i wykonuje sekwencję testów linków (wariant dev-safe) oraz dostępności.
- when to use: jako lokalny preflight quality gate w codziennej pracy.

### `check:server:prod`
- command: `cross-env WAIT_ON_TIMEOUT=60000 WAIT_ON_INTERVAL=250 start-server-and-test "npm run build && npm run dev:server" http-get://127.0.0.1:5173 "npm run check:links:prod"`
- what it does: buduje assety produkcyjne, uruchamia serwer i wykonuje ścisły link-check wariantu produkcyjnego.
- when to use: przed wdrożeniem lub w pipeline release, gdy trzeba zweryfikować linki razem z `.min` assetami.

### `check`
- command: `npm run lint && npm run validate:html && npm run check:server`
- what it does: uruchamia pełny pakiet kontroli jakości (JS lint, HTML validate, linki, accessibility).
- when to use: przed merge/release.
