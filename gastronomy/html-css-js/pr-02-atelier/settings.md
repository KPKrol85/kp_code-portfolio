# settings.md

## npm scripts (na podstawie `package.json`)

### `build:css`
- **script name:** `build:css`
- **command:** `postcss css/style.css -o css/style.min.css --no-map`
- **what it does:** Łączy importy CSS przez PostCSS i tworzy zminifikowany plik `css/style.min.css`.
- **when to use it:** Po każdej zmianie warstwy CSS przed publikacją lub testem wydajności produkcyjnej.

### `build:js`
- **script name:** `build:js`
- **command:** `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- **what it does:** Bundluje moduły JavaScript i generuje zminifikowany plik `js/script.min.js`.
- **when to use it:** Po zmianach w katalogu `js/` przed release.

### `build`
- **script name:** `build`
- **command:** `npm run build:css && npm run build:js`
- **what it does:** Uruchamia pełny build front-endu (CSS + JS).
- **when to use it:** Standardowy krok walidacyjny przed wdrożeniem.

### `images:build`
- **script name:** `images:build`
- **command:** `node scripts/images/build-images.js`
- **what it does:** Generuje zoptymalizowane warianty obrazów (pipeline oparty o `sharp` i `fast-glob`).
- **when to use it:** Po dodaniu nowych obrazów źródłowych lub aktualizacji istniejących.

### `dev:server`
- **script name:** `dev:server`
- **command:** `http-server -p 5173 -c-1`
- **what it does:** Uruchamia lokalny serwer statyczny na porcie `5173` z wyłączonym cache.
- **when to use it:** Do ręcznych testów UI/UX i szybkiej walidacji stron.
