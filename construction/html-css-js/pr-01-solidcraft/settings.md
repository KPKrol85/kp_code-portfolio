# settings.md

## npm scripts (`package.json`)

### `start`
- **Command:** `npm run dev`
- **What it does:** Alias uruchamiający serwer developerski.
- **When to use it:** Gdy chcesz używać standardowego `npm start` jako punktu wejścia lokalnego.

### `dev`
- **Command:** `live-server --port=15500 --open=index.html --quiet`
- **What it does:** Uruchamia lokalny serwer statyczny na porcie `15500` i otwiera `index.html`.
- **When to use it:** Podczas pracy lokalnej nad HTML/CSS/JS.

### `build`
- **Command:** `node scripts/build-dist.js`
- **What it does:** Tworzy katalog `dist`, kopiuje pliki projektu (z wyłączeniem `.git`, `node_modules`, `dist`), minifikuje CSS/JS i aktualizuje referencje HTML na wersje `.min`.
- **When to use it:** Przed deploymentem lub weryfikacją artefaktów produkcyjnych.

### `format`
- **Command:** `prettier -w "**/*.{html,css,js,json,md}"`
- **What it does:** Formatuje pliki projektu in-place.
- **When to use it:** Przed commitem, aby utrzymać spójny styl kodu.

### `format:check`
- **Command:** `prettier -c "**/*.{html,css,js,json,md}"`
- **What it does:** Sprawdza zgodność formatowania bez modyfikacji plików.
- **When to use it:** W CI lub lokalnie jako kontrola jakości przed push/merge.

### `images:build`
- **Command:** `node scripts/images.js build`
- **What it does:** Generuje obrazy wynikowe w `assets/img` na podstawie źródeł z `assets/img-src` (warianty rozmiarów i formatów).
- **When to use it:** Po dodaniu lub zmianie grafik źródłowych.

### `images:clean`
- **Command:** `node scripts/images.js clean`
- **What it does:** Usuwa obrazy wygenerowane przez pipeline `images.js`.
- **When to use it:** Przy czyszczeniu artefaktów i pełnej regeneracji obrazów.
