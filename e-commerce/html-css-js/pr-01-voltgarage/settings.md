# settings.md

## package.json scripts reference

### `img:opt`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=all`
- **What it does:** Uruchamia optymalizację obrazów dla wszystkich obsługiwanych źródeł wejściowych.
- **When to use:** Gdy dodajesz lub aktualizujesz assety graficzne i chcesz odświeżyć ich warianty zoptymalizowane.

### `img:opt:jpg`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=jpg`
- **What it does:** Przetwarza wyłącznie obrazy JPG/JPEG.
- **When to use:** Gdy zmiany dotyczą tylko plików JPEG.

### `img:opt:png`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=png`
- **What it does:** Przetwarza wyłącznie obrazy PNG.
- **When to use:** Gdy zmiany dotyczą tylko plików PNG.

### `img:opt:all`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --only=all`
- **What it does:** Alias pełnej optymalizacji obrazów, funkcjonalnie taki sam jak `img:opt`.
- **When to use:** Jako standardowa komenda do pełnego przebiegu optymalizacji.

### `img:opt:out`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --mode=output --out=tools/image-optimizer/output --only=all`
- **What it does:** Zapisuje wynik działania do katalogu `tools/image-optimizer/output` zamiast aktualizować standardowe ścieżki projektu.
- **When to use:** Do porównań jakości, testów lub pracy eksperymentalnej bez nadpisywania głównych assetów.

### `img:opt:dry`
- **Command:** `node tools/image-optimizer/optimize-images.mjs --dry-run --only=all`
- **What it does:** Symuluje przebieg optymalizacji bez zapisu plików.
- **When to use:** Gdy chcesz najpierw sprawdzić zakres planowanych zmian.

### `minify:css`
- **Command:** `postcss css/main.css -o css/main.min.css --no-map -u cssnano`
- **What it does:** Minifikuje główny arkusz CSS i zapisuje wynik do `css/main.min.css`.
- **When to use:** Przed przygotowaniem artefaktów produkcyjnych lub po zmianach w źródłowym CSS.

### `minify:js`
- **Command:** `terser js/main.js -o js/main.min.js -c -m`
- **What it does:** Minifikuje entrypoint JavaScript i zapisuje wynik do `js/main.min.js`.
- **When to use:** Przed przygotowaniem artefaktów produkcyjnych lub po zmianach w źródłowym JS.

### `build`
- **Command:** `npm run minify:css && npm run minify:js`
- **What it does:** Uruchamia oba kroki minifikacji i tworzy produkcyjne pliki `.min.css` oraz `.min.js`.
- **When to use:** Gdy potrzebujesz lokalnego mini-builda przed wdrożeniem lub testem.

### `watch:css`
- **Command:** `postcss css/main.css -o css/main.min.css --watch --no-map -u cssnano`
- **What it does:** Nasłuchuje zmian w CSS i na bieżąco aktualizuje `css/main.min.css`.
- **When to use:** Podczas pracy nad stylami, jeśli chcesz stale utrzymywać wersję minified.

### `qa`
- **Command:** `npm run qa:html && npm run qa:links && npm run qa:js && npm run qa:css`
- **What it does:** Uruchamia podstawowy zestaw kontroli jakości: walidację HTML, kontrolę linków, ESLint i Stylelint.
- **When to use:** Przed commitem, PR albo przed ręcznym testem wdrożeniowym.

### `qa:format`
- **Command:** `npm run format:check`
- **What it does:** Alias do sprawdzenia formatowania Prettier bez modyfikacji plików.
- **When to use:** Gdy chcesz uruchomić format-check jako osobny krok QA.

### `qa:html`
- **Command:** `html-validate --config htmlvalidate.json index.html pages/cart.html pages/checkout.html pages/contact.html pages/cookies.html pages/kolekcje.html pages/nowosci.html pages/polityka-prywatnosci.html pages/product.html pages/promocje.html pages/regulamin.html pages/shop.html`
- **What it does:** Waliduje wskazane pliki HTML względem konfiguracji `htmlvalidate.json`.
- **When to use:** Po zmianach w HTML, ARIA, formularzach, strukturze dokumentu lub SEO metadata.

### `qa:js`
- **Command:** `eslint --max-warnings 0 "js/**/*.js" "tools/**/*.mjs"`
- **What it does:** Uruchamia ESLint dla kodu aplikacji i narzędzi, traktując ostrzeżenia jako błędy.
- **When to use:** Po każdej zmianie w JavaScript lub skryptach narzędziowych.

### `qa:css`
- **Command:** `stylelint --max-warnings 0 "css/**/*.css"`
- **What it does:** Uruchamia Stylelint dla wszystkich plików CSS, również w trybie zero warningów.
- **When to use:** Po każdej zmianie w stylach.

### `format`
- **Command:** `prettier . --write`
- **What it does:** Formatuje cały projekt zgodnie z regułami Prettier.
- **When to use:** Po większych zmianach lub przed commitem, jeśli chcesz wyrównać formatowanie.

### `format:check`
- **Command:** `prettier . --check`
- **What it does:** Sprawdza, czy pliki są poprawnie sformatowane, bez ich modyfikowania.
- **When to use:** W CI lub jako szybki gate przed wysłaniem zmian.

### `validate:jsonld`
- **Command:** `node scripts/validate-jsonld.js`
- **What it does:** Waliduje bloki JSON-LD wykryte w stronach HTML i egzekwuje dodatkowe asercje zdefiniowane w skrypcie.
- **When to use:** Po zmianach w structured data, canonicalach lub sekcji `<head>`.

### `qa:links`
- **Command:** `node scripts/validate-internal-links.js`
- **What it does:** Sprawdza poprawność odwołań `href` pomiędzy lokalnymi plikami HTML.
- **When to use:** Po zmianach w nawigacji, linkach albo strukturze katalogów stron.

### `qa:smoke`
- **Command:** `node scripts/qa-smoke-lighthouse.js`
- **What it does:** Uruchamia smoke test Lighthouse w trybie raportowym.
- **When to use:** Gdy chcesz szybko ocenić bazowy stan wydajności, SEO i dostępności po zmianach.

### `qa:smoke:enforce`
- **Command:** `node scripts/qa-smoke-lighthouse.js --enforce`
- **What it does:** Uruchamia ten sam smoke test Lighthouse, ale z egzekwowaniem progów jako warunku zaliczenia.
- **When to use:** Przed releasem albo w CI, gdy wynik ma działać jako quality gate.
