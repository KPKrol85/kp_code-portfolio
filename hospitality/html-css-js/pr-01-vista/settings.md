# Settings / Scripts reference

`package.json` detected in project.

## npm scripts

### 1) `css:build`
- **Command:** `postcss ./css/style.css -o ./css/style.min.css`
- **What it does:** Kompiluje główny CSS przez PostCSS i zapisuje wynik do `css/style.min.css`.
- **When to use:** Przy przygotowaniu produkcyjnej wersji stylów lub przed deployem.

### 2) `css:watch`
- **Command:** `postcss ./css/style.css -o ./css/style.min.css -w`
- **What it does:** Uruchamia watch mode dla CSS i automatycznie przebudowuje plik po zmianach.
- **When to use:** W trakcie developmentu front-endu.

### 3) `build`
- **Command:** `npm run css:build && npm run img:opt`
- **What it does:** Wykonuje pełny build assetów: CSS + optymalizacja obrazów.
- **When to use:** Przed publikacją lub kontrolą jakości finalnych assetów.

### 4) `img:opt`
- **Command:** `node scripts/optimize-images.mjs`
- **What it does:** Uruchamia skrypt optymalizacji obrazów z katalogu źródłowego do katalogu wynikowego.
- **When to use:** Gdy dodano/zmieniono obrazy i trzeba odświeżyć warianty zoptymalizowane.

### 5) `img:clean`
- **Command:** `node scripts/optimize-images.mjs --clean`
- **What it does:** Czyści wygenerowane obrazy wyjściowe.
- **When to use:** Przed pełnym rebuildem obrazów lub przy porządkowaniu artefaktów.

### 6) `img:watch`
- **Command:** `node scripts/optimize-images.mjs --watch`
- **What it does:** Obserwuje zmiany obrazów i wykonuje optymalizację automatycznie.
- **When to use:** Podczas aktywnej pracy nad sekcjami z mediami.

### 7) `test`
- **Command:** `echo "Error: no test specified" && exit 1`
- **What it does:** Placeholder script zwracający błąd.
- **When to use:** Nie używać jako realnego testu; wymaga podmiany na właściwy pipeline testowy.

### 8) `check:links`
- **Command:** `node scripts/check-link-integrity.mjs`
- **What it does:** Sprawdza integralność odnośników w plikach HTML i `sitemap.xml`.
- **When to use:** Po zmianach linków, tras, nazw plików, SEO URL-i.

### 9) `test:a11y`
- **Command:** `npm exec --yes --package=playwright@1.54.2 --package=axe-core@4.10.3 node scripts/a11y-axe.mjs`
- **What it does:** Uruchamia skrypt audytu dostępności oparty o Playwright + axe-core.
- **When to use:** Weryfikacja regresji a11y przed wdrożeniem; wymaga dostępu do npm registry.
