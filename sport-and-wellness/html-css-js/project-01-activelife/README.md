# ActiveLife – Luxury Sports & Wellness Resort

Profesjonalny, jednoplikowy landing page zaprojektowany w stylu premium (Apple-like) z wysokim naciskiem na dostępność, wydajność i PWA.

## Start

```bash
cd active-life
npm install
npm run dev
```

## Skrypty

- `npm run dev` – lekki serwer statyczny.
- `npm run build:css` – bundlowanie i minifikacja CSS (`style.css` → `style.min.css`).
- `npm run build:js` – minifikacja JS do `js/bundle.min.js`.
- `npm run images` – optymalizacja obrazów w `assets/img`.

## Struktura

```
active-life/
  assets/
    fonts/
    icons/
    img/
  css/
  js/
  index.html
  offline.html
  404.html
  manifest.webmanifest
  service-worker.js
  robots.txt
  sitemap.xml
  _redirects
```

## A11y

- Skip link do treści głównej.
- Widoczne focus states.
- W pełni klawiaturowe menu mobilne (focus trap + ESC).
- Semantyczne landmarki i opisy.

## PWA

Zawiera manifest oraz service worker z cache dla app shell i offline fallback.

## Notatka o fontach

Projekt zakłada lokalne fonty w formacie `.woff2`. Dodaj je do `assets/fonts/` i uzupełnij `@font-face` w `css/base.css` (np. Inter / Manrope).
