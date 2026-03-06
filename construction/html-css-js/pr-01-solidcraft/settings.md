# npm scripts — opis

`package.json` został wykryty w projekcie.

## img:build
- **command:** `node tools/images/build-images.mjs`
- **what it does:** Buduje zoptymalizowane warianty obrazów (pipeline obrazków).
- **when to use:** Po dodaniu/zmianie grafik źródłowych lub przed publikacją.

## img:clean
- **command:** `node tools/images/build-images.mjs --clean`
- **what it does:** Czyści wygenerowane artefakty pipeline’u obrazów.
- **when to use:** Gdy chcesz odtworzyć obrazki od zera lub usunąć stare warianty.

## build:css
- **command:** `node tools/css/build-css.mjs`
- **what it does:** Buduje finalny CSS do dystrybucji.
- **when to use:** Po zmianach w plikach CSS przed testami/deployem.

## min:css
- **command:** `npm run build:css`
- **what it does:** Alias do `build:css`.
- **when to use:** Gdy workflow używa nazwy `min:css`.

## build:js
- **command:** `node tools/js/build-js.mjs`
- **what it does:** Buduje/minifikuje finalny bundle JavaScript.
- **when to use:** Po zmianach JS przed publikacją.

## build:sw
- **command:** `node tools/sw/build-sw.mjs`
- **what it does:** Generuje finalny service worker na podstawie szablonu/konfiguracji.
- **when to use:** Po zmianach PWA/cache listy lub przed release.

## build
- **command:** `npm run build:clean && npm run build:head && npm run build:css && npm run build:js && npm run build:sw && npm run build:dist`
- **what it does:** Uruchamia pełny, czysty build i pakuje kompletny output deploy do `dist/`.
- **when to use:** Standardowy build przed wdrożeniem.

## serve
- **command:** `http-server -c-1 -p 8080`
- **what it does:** Uruchamia lokalny serwer HTTP bez cache (`-c-1`) na porcie 8080.
- **when to use:** Lokalny podgląd i testy manualne.

## serve:dist
- **command:** `http-server dist -c-1 -p 8080`
- **what it does:** Uruchamia podgląd produkcyjnego outputu z folderu `dist/` (dokładnie to, co publikujesz).
- **when to use:** Weryfikacja buildu przed deployem na Netlify.

## qa:lighthouse
- **command:** `mkdir -p reports/lighthouse && lhci collect --url=http://localhost:8080/ --url=http://localhost:8080/services/budowa-domow.html --url=http://localhost:8080/legal/regulamin.html --outputDir=reports/lighthouse`
- **what it does:** Zbiera raporty Lighthouse dla wybranych URL.
- **when to use:** Audyt wydajności/SEO/best practices/a11y.

## qa:a11y
- **command:** `mkdir -p reports/pa11y && pa11y http://localhost:8080/ --reporter json --output reports/pa11y/index.json && pa11y http://localhost:8080/services/budowa-domow.html --reporter json --output reports/pa11y/budowa-domow.json && pa11y http://localhost:8080/legal/regulamin.html --reporter json --output reports/pa11y/regulamin.json`
- **what it does:** Uruchamia pa11y dla kluczowych stron i zapisuje wyniki JSON.
- **when to use:** Kontrola dostępności przed release.

## qa
- **command:** `npm run qa:lighthouse && npm run qa:a11y`
- **what it does:** Pełny zestaw QA (Lighthouse + pa11y).
- **when to use:** Kompleksowy quality gate.

## build:head
- **command:** `node tools/html/build-head.mjs`
- **what it does:** Buduje/aktualizuje sekcje `<head>` stron na bazie tooling.
- **when to use:** Po zmianach SEO/meta/canonical/OG lub template head.

## qa:links
- **command:** `node ../../../scripts/check-links-local.mjs --root "construction/html-css-js/pr-02-axiom"`
- **what it does:** Sprawdza lokalne linki, zasoby i odwołania fragmentów `#id`.
- **when to use:** Po zmianach w linkowaniu, strukturze stron lub assetach.
