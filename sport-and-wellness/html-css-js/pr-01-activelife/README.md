# ActiveLife – Luxury Sports & Wellness Resort

Profesjonalny landing page zaprojektowany w stylu premium (Apple-like), z naciskiem na dostępność, wydajność i PWA.

## Development

1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom lokalny serwer developerski:

```bash
npm run dev
```

`dev` serwuje statycznie projekt pod `http://localhost:3000` (wbudowany `python3 -m http.server`) i nie wykonuje buildu automatycznie.

## Production / Preview

Jedyny produkcyjny entrypoint to `index.html`, który ładuje **wyłącznie** zbudowane artefakty:

- `css/style.min.css`
- `js/app.min.js`

### Build

```bash
npm run build
```

Co robi build:

1. `npm run clean` — czyści poprzednie artefakty (`css/style.min.css`, `js/app.min.js`, `js/.app.bundle.js`),
2. `npm run build:css` — generuje zminifikowany CSS,
3. `npm run build:js` — generuje zminifikowany bundle JS.

### Preview

```bash
npm run preview
```

`preview` celowo uruchamia `build` przed startem serwera (`http://localhost:4173`, również `python3 -m http.server`), żeby lokalny podgląd zawsze testował dokładnie te same, świeżo wygenerowane artefakty, które idą na deploy.

## Skrypty

- `npm run dev` – lokalny serwer statyczny (tryb developerski).
- `npm run clean` – usuwa artefakty build.
- `npm run build:css` – minifikacja CSS (`css/style.css` → `css/style.min.css`).
- `npm run build:js` – bundlowanie i minifikacja JS (`js/modules/*` + `js/main.js` → `js/app.min.js`).
- `npm run build` – pełny build produkcyjny (clean + CSS + JS).
- `npm run preview` – build + lokalny preview artefaktów produkcyjnych.
- `npm run images` – optymalizacja obrazów w `assets/img`.

## Quality guardrails (lint / format / smoke tests)

### Linting

```bash
npm run lint
```

- `npm run lint:js` — ESLint dla JavaScript (ES modules + browser).
- `npm run lint:css` — Stylelint dla CSS (`css/**/*.css`, z pominięciem artefaktów build).

### Formatowanie

```bash
npm run format
npm run format:check
```

Prettier obejmuje pliki: `js`, `css`, `html`, `json`, `md`.

### Smoke testy E2E (Playwright)

```bash
npm run test:smoke
# alias
npm test
```

Zakres smoke testów:

1. menu mobilne (open -> podstawowy focus trap -> close -> focus return),
2. filtry harmonogramu aktualizują wyniki,
3. minimalny scenariusz offline/network-fail po pierwszej wizycie.

> Uwaga: test offline opiera się na ponownym załadowaniu strony po pierwszym, online wejściu. W środowiskach CI/browser może to zależeć od dostępności cache/service worker.

### Lokalny flow CI

```bash
npm run ci
```

Uruchamia kolejno: `lint` + `test:smoke`.

## Struktura

```text
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

Projekt zakłada lokalne fonty w formacie `.woff2`. Dodaj je do `assets/fonts/` i uzupełnij `@font-face` w `css/base.css`.
