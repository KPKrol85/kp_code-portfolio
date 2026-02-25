# settings.md

## package.json scripts

### `build:css`
- command: `postcss css/style.css -o css/style.min.css --no-map`
- what it does: kompiluje i minifikuje główny arkusz CSS do `css/style.min.css`.
- when to use: przed publikacją lub gdy zmieniasz style i chcesz odświeżyć plik produkcyjny.

### `build:js`
- command: `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- what it does: bundluje moduły JS i tworzy zminifikowany bundle `js/script.min.js`.
- when to use: przed deployem lub po zmianach w kodzie JavaScript.

### `build`
- command: `npm run build:css && npm run build:js`
- what it does: uruchamia pełny build assets (CSS + JS).
- when to use: standardowo przed wdrożeniem produkcyjnym.

### `images:build`
- command: `node scripts/images/build-images.js`
- what it does: generuje zoptymalizowane warianty obrazów (na podstawie skryptu w `scripts/images/`).
- when to use: po dodaniu nowych obrazów źródłowych lub zmianie pipeline obrazów.

### `dev:server`
- command: `http-server -p 5173 -c-1`
- what it does: uruchamia lokalny serwer statyczny na porcie `5173` z wyłączonym cache.
- when to use: do lokalnego testowania stron i uruchamiania testów link/a11y.

### `lint`
- command: `eslint "js/**/*.js"`
- what it does: sprawdza jakość i spójność kodu JavaScript.
- when to use: przed commitem/PR i w CI.

### `validate:html`
- command: `html-validate "*.html"`
- what it does: waliduje pliki HTML w katalogu głównym projektu.
- when to use: po zmianach w markup i przed releasem.

### `check:links`
- command: `linkinator http://127.0.0.1:5173/ http://127.0.0.1:5173/about.html http://127.0.0.1:5173/menu.html http://127.0.0.1:5173/gallery.html http://127.0.0.1:5173/cookies.html http://127.0.0.1:5173/polityka-prywatnosci.html http://127.0.0.1:5173/regulamin.html http://127.0.0.1:5173/offline.html http://127.0.0.1:5173/thank-you.html http://127.0.0.1:5173/404.html --recurse --check-fragments --silent --concurrency 4 --timeout 10000 --retry --skip "^https://"`
- what it does: sprawdza linki i fragmenty (`#id`) na lokalnym serwerze dla kluczowych podstron.
- when to use: po zmianach w nawigacji, anchorach, ścieżkach assetów i linkach wewnętrznych.

### `check:a11y`
- command: `pa11y-ci`
- what it does: uruchamia testy dostępności WCAG2AA dla listy URL z `.pa11yci`.
- when to use: po zmianach UI/CSS/HTML oraz przed wdrożeniem.

### `check:server`
- command: `cross-env WAIT_ON_TIMEOUT=60000 WAIT_ON_INTERVAL=250 start-server-and-test dev:server http-get://127.0.0.1:5173 "npm run check:links && npm run check:a11y"`
- what it does: uruchamia serwer, czeka aż będzie dostępny, a następnie wykonuje test linków i a11y.
- when to use: lokalny preflight jakościowy przed merge/release.

### `check`
- command: `npm run lint && npm run validate:html && npm run check:server`
- what it does: pełny zestaw kontroli jakości (lint + walidacja HTML + linki + accessibility).
- when to use: główny quality gate przed publikacją.
