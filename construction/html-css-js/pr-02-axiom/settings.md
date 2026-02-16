# settings.md

## npm scripts (`package.json`)

### `img:build`
- **Command:** `node tools/images/build-images.mjs`
- **What it does:** uruchamia pipeline obrazów i generuje zoptymalizowane warianty (w tym formaty nowoczesne i warianty responsywne).
- **When to use:** po dodaniu/zmianie grafik źródłowych lub zmianie reguł optymalizacji.

### `img:clean`
- **Command:** `node tools/images/build-images.mjs --clean`
- **What it does:** usuwa wygenerowane artefakty pipeline’u obrazów.
- **When to use:** przed pełną regeneracją obrazów lub podczas porządkowania builda.

### `build:css`
- **Command:** `node tools/css/build-css.mjs`
- **What it does:** buduje i minifikuje CSS do `dist/style.min.css`.
- **When to use:** po zmianach w `css/` i przed QA/deployem.

### `min:css`
- **Command:** `npm run build:css`
- **What it does:** alias uruchamiający ten sam proces co `build:css`.
- **When to use:** gdy workflow lub automatyzacja odwołuje się do nazwy `min:css`.

### `build:js`
- **Command:** `node tools/js/build-js.mjs`
- **What it does:** buduje i minifikuje JavaScript do `dist/script.min.js`.
- **When to use:** po zmianach w `js/` i przed publikacją.

### `build:sw`
- **Command:** `node tools/sw/build-sw.mjs`
- **What it does:** generuje finalny `sw.js` na bazie `sw.template.js` i aktualnej rewizji.
- **When to use:** po zmianach logiki cache/offline lub przed release.

### `build`
- **Command:** `npm run build:head && npm run build:css && npm run build:js && npm run build:sw`
- **What it does:** uruchamia pełny build strony: aktualizacja sekcji `<head>`, CSS, JS i service worker.
- **When to use:** główny krok przygotowania artefaktów produkcyjnych.

### `serve`
- **Command:** `http-server -c-1 -p 8080`
- **What it does:** uruchamia lokalny serwer statyczny na porcie `8080` z wyłączonym cache serwera.
- **When to use:** lokalne testy manualne i QA przed deployem.

### `qa:lighthouse`
- **Command:** `mkdir -p reports/lighthouse && lhci collect --url=http://localhost:8080/ --url=http://localhost:8080/services/budowa-domow.html --url=http://localhost:8080/legal/regulamin.html --outputDir=reports/lighthouse`
- **What it does:** zbiera raporty Lighthouse CI dla strony głównej, jednej podstrony usługowej i jednej prawnej.
- **When to use:** cykliczny pomiar jakości (performance/SEO/a11y/best practices).

### `qa:a11y`
- **Command:** `mkdir -p reports/pa11y && pa11y http://localhost:8080/ --reporter json --output reports/pa11y/index.json && pa11y http://localhost:8080/services/budowa-domow.html --reporter json --output reports/pa11y/budowa-domow.json && pa11y http://localhost:8080/legal/regulamin.html --reporter json --output reports/pa11y/regulamin.json`
- **What it does:** uruchamia audyt dostępności Pa11y dla trzech kluczowych URL i zapisuje wyniki JSON.
- **When to use:** po zmianach UI/semantyki formularzy/nawigacji lub przed release.

### `qa`
- **Command:** `npm run qa:lighthouse && npm run qa:a11y`
- **What it does:** uruchamia pełny pakiet QA (Lighthouse + Pa11y).
- **When to use:** końcowy quality gate przed wdrożeniem.

### `build:head`
- **Command:** `node tools/html/build-head.mjs`
- **What it does:** synchronizuje/generuje sekcje `<head>` na podstawie szablonów i metadanych.
- **When to use:** po zmianach SEO metadata, canonical/OG lub szablonów head.

### `qa:links`
- **Command:** `node ../../../scripts/check-links-local.mjs --root "construction/html-css-js/pr-02-axiom"`
- **What it does:** sprawdza lokalne linki, ścieżki plików i odwołania do fragmentów (`#id`) w HTML.
- **When to use:** po zmianach w nawigacji, anchorach, strukturze stron lub assetach.
