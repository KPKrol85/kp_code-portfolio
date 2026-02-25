# npm scripts — settings

## `css:build`
- **Command:** `postcss ./css/style.css -o ./css/style.min.css`
- **What it does:** Buduje zminifikowany plik CSS na podstawie entry `css/style.css` i importowanych modułów.
- **When to use:** Przed deployem lub po zmianach w stylach.

## `css:watch`
- **Command:** `postcss ./css/style.css -o ./css/style.min.css -w`
- **What it does:** Uruchamia obserwację zmian i przebudowuje CSS automatycznie.
- **When to use:** Podczas lokalnej pracy nad warstwą CSS.

## `build`
- **Command:** `npm run css:build && npm run img:opt`
- **What it does:** Wykonuje pełny lokalny build front-endu: CSS + optymalizacja obrazów.
- **When to use:** Przed publikacją oraz do szybkiej weryfikacji kompletności artefaktów.

## `img:opt`
- **Command:** `node scripts/optimize-images.mjs`
- **What it does:** Przetwarza obrazy z `assets/img/src/` do `assets/img/optimized/` (WebP/AVIF), z pominięciem plików aktualnych.
- **When to use:** Po dodaniu lub aktualizacji obrazów źródłowych.

## `img:clean`
- **Command:** `node scripts/optimize-images.mjs --clean`
- **What it does:** Usuwa wygenerowane obrazy z `assets/img/optimized/`.
- **When to use:** Gdy trzeba przebudować zestaw optymalizacji od zera.

## `img:watch`
- **Command:** `node scripts/optimize-images.mjs --watch`
- **What it does:** Nasłuchuje zmian w `assets/img/src/` i automatycznie regeneruje warianty output.
- **When to use:** W trakcie intensywnej pracy nad materiałami graficznymi.

## `test`
- **Command:** `echo "Error: no test specified" && exit 1`
- **What it does:** Placeholder script zwracający błąd.
- **When to use:** Aktualnie nie służy do testów; wymaga zastąpienia realnym zestawem testowym.
