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
  /scripts
```

## UX / A11Y
- Skip link, focus-visible, semantyczne sekcje.
- Menu mobile jako dostępny drawer (ESC zamyka).
- `prefers-reduced-motion` ogranicza animacje.

## PWA / SEO
- `manifest.webmanifest`, `service-worker.js`, `offline.html`, `404.html`.
- `robots.txt`, `sitemap.xml`, `_redirects`.

## Build
```bash
npm install
npm run build:css
npm run build:js
npm run images
```
