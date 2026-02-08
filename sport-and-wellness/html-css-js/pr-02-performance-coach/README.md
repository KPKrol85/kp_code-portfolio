# Alex Novak — Human Performance Coach

Portfolio online zaprojektowane w estetyce editorial / brutal minimal / sport science. Strona ma budować markę osobistą i pokazywać data‑driven podejście do treningu.

## Koncepcja
- **Editorial headline + data blocks** — mocna typografia i techniczne akcenty.
- **Asymetryczne siatki** — layouty łamią klasyczne „gym” sekcje.
- **Jeden akcent kolorystyczny** — limonkowy sygnał dla CTA i danych.
- **Minimalne animacje** — tylko subtelny reveal i scroll‑type.

## Architektura
```
/performance-coach
  /assets
    /icons
  /css
    tokens.css
    base.css
    layout.css
    components.css
    sections.css
    style.css
    style.min.css
  /js
    /modules
    main.js
    precache-manifest.js
  /scripts
```

## UX / A11Y
- Skip link, focus-visible, semantyczne sekcje.
- Menu mobile jako dostępny drawer (ESC zamyka).
- `prefers-reduced-motion` ogranicza animacje.

## PWA / SEO
- `manifest.webmanifest`, `service-worker.js`, `offline.html`, `404.html`.
- `robots.txt`, `sitemap.xml`, `_redirects`.
- Lista pre-cache jest generowana automatycznie przez `scripts/generate-precache.mjs` (HTML + JS graph + CSS + kluczowe assety PWA).

## Build
```bash
npm install
npm run build
npm run build:js
npm run images
```

`npm run build` wykonuje:
1. minifikację `css/style.css` → `css/style.min.css`,
2. generację `js/precache-manifest.js` dla Service Workera.

Przed deployem uruchom `npm run build`, żeby SW miał aktualną listę assetów offline.

## Test offline (DevTools)
1. Otwórz **Application → Service Workers** i opcjonalnie zaznacz **Update on reload**.
2. Przejdź do **Network** i ustaw tryb **Offline**.
3. Odśwież `index.html`, `privacy.html` i `404.html`.
4. Przejdź po sekcjach strony i sprawdź konsolę — importy ES modules (`js/modules/*.js`) powinny ładować się z cache bez błędów.
5. Wejdź na niecache’owany URL (np. `/performance-coach/some-missing-page`) i potwierdź fallback do `offline.html`.
