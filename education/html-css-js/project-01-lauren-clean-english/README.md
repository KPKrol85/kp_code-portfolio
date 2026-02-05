# Lauren – Clean English

Profesjonalna, jednoekranowa strona typu portfolio/landing dla nauczycielki języka angielskiego. Projekt łączy styl edukacyjny inspirowany Khan Academy z nowoczesnym UX i wysoką dostępnością.

## Funkcje JS
- Reveal on scroll (IntersectionObserver).
- Sticky header z efektem blur i shrink.
- Mobile nav (drawer) z trapem focusu, zamknięciem ESC i obsługą ARIA.
- Scrollspy dla aktywnej sekcji w nawigacji.
- FAQ accordion z obsługą klawiatury.
- Filtrowanie materiałów w sekcji Resources/Shop.
- Progress tracker demo z przełączaniem stanu.
- Prosty przełącznik języka (PL/EN) i motywu (light/dark).
- Rejestracja Service Worker (PWA).

## Architektura plików
```
/english-lessons
  index.html
  offline.html
  404.html
  robots.txt
  sitemap.xml
  _redirects
  manifest.webmanifest
  service-worker.js
  /assets
    /img
    /fonts
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
    main.js
    /modules
      reveal.js
      headerShrink.js
      mobileNav.js
      scrollSpy.js
      accordion.js
      resourcesFilter.js
      progressTracker.js
      langToggle.js
  package.json
```

## Build scripts
- `npm run dev` – lokalny serwer statyczny.
- `npm run build:css` – PostCSS + cssnano (generuje `css/style.min.css`).
- `npm run build:js` – Terser (generuje `js/main.min.js`).
- `npm run images` – optymalizacja obrazów (webp/avif).
- `npm run lint:js` – ESLint.
- `npm run format` – Prettier.

## A11y checklist (WCAG AA+)
- Skip link do treści.
- Semantyczne sekcje i poprawna hierarchia nagłówków.
- Wyraźne focus states (`:focus-visible`).
- Dostępne komponenty interaktywne (menu mobilne, accordion, filtry).
- Obsługa klawiatury (Tab/Shift+Tab/ESC).
- `prefers-reduced-motion` dla animacji.
- Kontrast zgodny z AA.

## PWA
- Manifest i ikony w `/assets/icons/`.
- Service worker z cache app shell i offline fallback (`offline.html`).
- `robots.txt`, `sitemap.xml`, `_redirects`.

## Uwagi
Typografia opiera się na fontach systemowych ustawionych w `css/base.css`.
