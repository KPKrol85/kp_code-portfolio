# settings.md

## package.json scripts reference

### `img:opt`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=all`
- **What it does:** Uruchamia lokalny optimizer obrazów dla wszystkich wspieranych formatów wejściowych.
- **When to use:** Po dodaniu/aktualizacji assetów graficznych przed commitem lub buildem.

### `img:opt:jpg`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=jpg`
- **What it does:** Optymalizuje tylko pliki JPG/JPEG.
- **When to use:** Gdy zmiany dotyczą wyłącznie materiałów JPEG.

### `img:opt:png`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=png`
- **What it does:** Optymalizuje tylko pliki PNG.
- **When to use:** Gdy zmiany dotyczą wyłącznie materiałów PNG.

### `img:opt:all`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=all`
- **What it does:** Alias pełnej optymalizacji obrazów (tożsamy z `img:opt`).
- **When to use:** Standardowo zamiast ręcznego wskazywania formatów.

### `img:opt:out`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --mode=output --out=tools/image-optimizer/output --only=all`
- **What it does:** Zapisuje wynik optymalizacji do katalogu output zamiast nadpisywać standardowe ścieżki.
- **When to use:** Do testów porównawczych, QA jakości obrazu, eksperymentów.

### `img:opt:dry`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --dry-run --only=all`
- **What it does:** Symuluje optymalizację bez zapisu plików.
- **When to use:** Do szybkiego sprawdzenia planowanych zmian i zakresu operacji.

### `minify:css`
- **Command:** `postcss css/main.css -o css/main.min.css --no-map -u cssnano`
- **What it does:** Minifikuje główny CSS przy użyciu PostCSS + cssnano i zapisuje `main.min.css`.
- **When to use:** Przy przygotowaniu artefaktów produkcyjnych.

### `minify:js`
- **Command:** `terser js/main.js -o js/main.min.js -c -m`
- **What it does:** Minifikuje i mangle’uje entrypoint JavaScript.
- **When to use:** Przy przygotowaniu artefaktów produkcyjnych.

### `build`
- **Command:** `npm run minify:css && npm run minify:js`
- **What it does:** Wykonuje pełny lokalny mini-build (CSS + JS minified).
- **When to use:** Przed publikacją lub testami wydajnościowymi na buildzie.

### `watch:css`
- **Command:** `postcss css/main.css -o css/main.min.css --watch --no-map -u cssnano`
- **What it does:** Obserwuje zmiany w CSS i automatycznie aktualizuje `main.min.css`.
- **When to use:** W trakcie lokalnej pracy nad stylami.

### `qa`
- **Command:** `npm run qa:html && npm run qa:links && npm run qa:js && npm run qa:css`
- **What it does:** Uruchamia pełny zestaw kontroli jakości (HTML, linki, JS, CSS).
- **When to use:** Przed każdym PR i przed release.

### `qa:format`
- **Command:** `npm run format:check`
- **What it does:** Alias checkera formatowania Prettier.
- **When to use:** Gdy pipeline wymaga oddzielnego kroku „format check”.

### `qa:html`
- **Command:** `html-validate --config htmlvalidate.json index.html pages/cart.html pages/checkout.html pages/contact.html pages/cookies.html pages/kolekcje.html pages/nowosci.html pages/polityka-prywatnosci.html pages/product.html pages/promocje.html pages/regulamin.html pages/shop.html`
- **What it does:** Waliduje wskazane pliki HTML zgodnie z konfiguracją `htmlvalidate.json`.
- **When to use:** Po zmianach struktury HTML, atrybutów ARIA, metadata itp.

### `qa:js`
- **Command:** `eslint --max-warnings 0 "js/**/*.js" "tools/**/*.mjs"`
- **What it does:** Lintuje JavaScript i narzędzia buildowe; ostrzeżenia traktowane są jak błąd.
- **When to use:** Po każdej zmianie JS lub narzędzi skryptowych.

### `qa:css`
- **Command:** `stylelint --max-warnings 0 "css/**/*.css"`
- **What it does:** Lintuje style CSS; ostrzeżenia traktowane są jak błąd.
- **When to use:** Po każdej zmianie stylów.

### `format`
- **Command:** `prettier . --write`
- **What it does:** Formatuje wszystkie pliki projektu zgodnie z ustawieniami Prettier.
- **When to use:** Przed commitem lub po większych refaktorach.

### `format:check`
- **Command:** `prettier . --check`
- **What it does:** Sprawdza zgodność formatowania bez modyfikacji plików.
- **When to use:** W CI i przed PR jako szybki quality gate.

### `validate:jsonld`
- **Command:** `node scripts/validate-jsonld.js`
- **What it does:** Waliduje składnię i minimalne oczekiwania JSON-LD w HTML oraz reguły template-specific.
- **When to use:** Po zmianach SEO schema/metadata.

### `qa:links`
- **Command:** `node scripts/validate-internal-links.js`
- **What it does:** Sprawdza lokalne odnośniki `href` między plikami HTML.
- **When to use:** Po zmianach nawigacji, linkowania lub struktury plików.

### `qa:smoke`
- **Command:** `node scripts/qa-smoke-lighthouse.js`
- **What it does:** Uruchamia smoke checki Lighthouse (wg implementacji skryptu).
- **When to use:** Do szybkiej oceny jakości runtime po zmianach wydajności/SEO/A11Y.

### `qa:smoke:enforce`
- **Command:** `node scripts/qa-smoke-lighthouse.js --enforce`
- **What it does:** Uruchamia smoke checki Lighthouse w trybie egzekwowania progów (failing mode).
- **When to use:** W CI lub przed release, gdy metryki mają być obowiązkowym gate’em.
