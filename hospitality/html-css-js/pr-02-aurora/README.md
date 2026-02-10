# Aurora – dokumentacja projektu / project documentation

## PL

### 1. Przegląd projektu
Aurora to statyczna, wielostronicowa strona front-endowa biura podróży (projekt demonstracyjny). Aplikacja działa bez frameworka i bez etapu bundlowania JavaScript.

**Stos technologiczny (aktualny):**
- HTML5 (wielostronicowy serwis)
- CSS (źródło `css/style.css` + wersja produkcyjna `css/style.min.css`)
- JavaScript ES Modules (`js/script.js` + moduły w `js/features/`)
- PWA (`site.webmanifest`, `service-worker.js`, strona `offline.html`)
- Netlify (hosting + plik `_headers` + formularz kontaktowy z `data-netlify="true"`)

---

### 2. Struktura projektu
Najważniejsze elementy repozytorium:

- `index.html`, `about.html`, `tours.html`, `tour.html`, `gallery.html`, `contact.html`, `offline.html` oraz strony prawne (`cookies.html`, `regulamin.html`, `polityka-prywatnosci.html`)
- `css/style.css` – główny plik źródłowy CSS (wersja developerska)
- `css/style.min.css` – plik CSS używany przez strony HTML i Service Workera (wersja produkcyjna)
- `js/script.js` – główny punkt wejścia JS (ES module)
- `js/features/` – moduły funkcjonalne (nawigacja, formularz, filtry, lightbox, itp.)
- `service-worker.js` – cache statycznych zasobów + strategia network-first dla HTML
- `site.webmanifest` – konfiguracja PWA (ikony, shortcuty, kolory)
- `scripts/check-css-assets.js` – walidacja spójności referencji do CSS w HTML i Service Workerze
- `_headers` / `_redirects` – ustawienia pod deployment Netlify

**Dev vs prod assets (CSS):**
- **Dev source:** `css/style.css` (edytowany ręcznie)
- **Prod asset:** `css/style.min.css` (generowany przez PostCSS)
- HTML-e w aktualnym stanie odwołują się do `css/style.min.css`.

---

### 3. Development
Projekt nie wymaga procesu build do uruchomienia strony jako statycznego frontendu, ale wymaga serwera HTTP (ze względu na moduły JS i Service Workera).

Przykładowe uruchomienie lokalne:

```bash
npm install
python3 -m http.server 8080
```

Następnie otwórz: `http://localhost:8080`

**Co traktujemy jako tryb dev:**
- Edycja plików źródłowych (`*.html`, `css/style.css`, `js/features/*.js`)
- Lokalne testy na serwerze statycznym
- Regeneracja `css/style.min.css` po zmianach w CSS

---

### 4. Build i produkcja
W projekcie istnieje build tylko dla CSS.

Dostępne skrypty npm:

```bash
npm run build:css
```
- Uruchamia PostCSS (`autoprefixer` + `cssnano`)
- Generuje/aktualizuje `css/style.min.css` na podstawie `css/style.css`

```bash
npm run check:css-assets
```
- Sprawdza, czy wszystkie kluczowe strony odwołują się do `css/style.min.css`
- Sprawdza, czy `service-worker.js` cache’uje `/css/style.min.css`
- Wykrywa niepożądane odwołania do `/css/style.css` w Service Workerze

```bash
npm run build
```
- Wykonuje: `build:css` + `check:css-assets`

**Co jest generowane dla produkcji:**
- `css/style.min.css`

Brak skryptu minifikacji JavaScript w aktualnym stanie repozytorium.

---

### 5. PWA i Service Worker
PWA jest aktywowane przez rejestrację `service-worker.js` w `js/script.js`.

**Offline i cache:**
- Wstępnie cache’owane zasoby statyczne obejmują m.in. `/`, `/index.html`, `/css/style.min.css`, `/js/script.js`, `/site.webmanifest`, `/offline.html`
- Dla HTML działa strategia **network-first** z fallbackiem do cache/offline page
- Dla zasobów statycznych działa **cache-first**

**Aktualizacja Service Workera:**
- Po wykryciu nowej wersji pokazywany jest baner „New version available.”
- Użytkownik decyduje, czy odświeżyć stronę (przycisk `Refresh`), co wywołuje `SKIP_WAITING`
- Po przejęciu kontroli przez nowego SW następuje przeładowanie strony

---

### 6. Uwagi dot. dostępności i SEO
**Podejście progressive enhancement:**
- Semantyczny HTML działa bez warstwy JS, a JS rozszerza interakcje (filtry, lightbox, nawigacja, formularz)

**Widoczne elementy a11y w kodzie:**
- Skip link (`.skip-link`)
- Rozbudowane style `:focus-visible`
- Obsługa `prefers-reduced-motion: reduce`
- Atrybuty ARIA w nawigacji i komponentach interaktywnych
- Formularz kontaktowy z etykietami, walidacją i komunikatami `aria-live`

**Podstawy SEO obecne w projekcie:**
- Meta `description` i `robots` na stronach
- `rel="canonical"`
- `sitemap.xml`
- `robots.txt`

---

### 7. Deployment (Netlify)
Projekt jest przygotowany do hostowania jako statyczna strona na Netlify.

Praktyczny przepływ:
1. Zbuduj CSS: `npm run build`
2. Wdróż zawartość katalogu projektu jako static site
3. Netlify zastosuje reguły z `_headers` i `_redirects`

Uwagi:
- Formularz kontaktowy korzysta z atrybutu `data-netlify="true"`
- PWA korzysta z `service-worker.js` i `site.webmanifest`; po deployu warto wykonać smoke test offline

---

### 8. Checklist release’u
Przed publikacją:
- [ ] `npm install`
- [ ] `npm run build`
- [ ] Potwierdź obecność `css/style.min.css`
- [ ] Otwórz kluczowe strony i sprawdź brak błędów stylów/JS
- [ ] Sprawdź formularz kontaktowy (render + walidacja)
- [ ] Wykonaj szybki test offline (po wcześniejszym załadowaniu strony online)
- [ ] Zweryfikuj `robots.txt` i `sitemap.xml`

---

## EN

### 1. Project overview
Aurora is a static multi-page frontend website for a travel agency (demo project). It runs without a framework and without a JavaScript bundling step.

**Current tech stack:**
- HTML5 (multi-page website)
- CSS (`css/style.css` source + `css/style.min.css` production file)
- JavaScript ES Modules (`js/script.js` + modules in `js/features/`)
- PWA (`site.webmanifest`, `service-worker.js`, `offline.html`)
- Netlify (hosting + `_headers` + contact form with `data-netlify="true"`)

---

### 2. Project structure
Key repository elements:

- `index.html`, `about.html`, `tours.html`, `tour.html`, `gallery.html`, `contact.html`, `offline.html`, and legal pages (`cookies.html`, `regulamin.html`, `polityka-prywatnosci.html`)
- `css/style.css` – main CSS source file (development)
- `css/style.min.css` – CSS file used by HTML pages and Service Worker (production)
- `js/script.js` – main JS entry point (ES module)
- `js/features/` – feature modules (navigation, form, filters, lightbox, etc.)
- `service-worker.js` – static asset caching + network-first strategy for HTML
- `site.webmanifest` – PWA settings (icons, shortcuts, theme colors)
- `scripts/check-css-assets.js` – consistency check for CSS references in HTML and Service Worker
- `_headers` / `_redirects` – Netlify deployment settings

**Dev vs prod assets (CSS):**
- **Dev source:** `css/style.css` (manually edited)
- **Prod asset:** `css/style.min.css` (generated by PostCSS)
- Current HTML pages reference `css/style.min.css`.

---

### 3. Development
The project does not require a build step to run as a static frontend, but it does require an HTTP server (because of JS modules and Service Worker behavior).

Example local run:

```bash
npm install
python3 -m http.server 8080
```

Then open: `http://localhost:8080`

**What is considered dev mode:**
- Editing source files (`*.html`, `css/style.css`, `js/features/*.js`)
- Local testing on a static server
- Regenerating `css/style.min.css` after CSS changes

---

### 4. Build & production
This project currently has a build pipeline only for CSS.

Available npm scripts:

```bash
npm run build:css
```
- Runs PostCSS (`autoprefixer` + `cssnano`)
- Generates/updates `css/style.min.css` from `css/style.css`

```bash
npm run check:css-assets
```
- Verifies key pages reference `css/style.min.css`
- Verifies `service-worker.js` caches `/css/style.min.css`
- Detects legacy `/css/style.css` references in Service Worker

```bash
npm run build
```
- Runs: `build:css` + `check:css-assets`

**Production-generated output:**
- `css/style.min.css`

There is no JavaScript minification script in the current repository state.

---

### 5. PWA & Service Worker
PWA support is enabled by registering `service-worker.js` in `js/script.js`.

**Offline and caching behavior:**
- Precached static assets include `/`, `/index.html`, `/css/style.min.css`, `/js/script.js`, `/site.webmanifest`, `/offline.html`
- HTML requests use a **network-first** strategy with cache/offline fallback
- Static assets use **cache-first**

**Service Worker update flow:**
- When a new version is detected, a “New version available.” banner is shown
- The user decides whether to refresh (`Refresh` button), which triggers `SKIP_WAITING`
- After controller change, the page reloads

---

### 6. Accessibility & SEO notes
**Progressive enhancement approach:**
- Semantic HTML works without JavaScript, while JS enhances interactivity (filters, lightbox, navigation, form behavior)

**Implemented a11y elements visible in code:**
- Skip link (`.skip-link`)
- Extensive `:focus-visible` styling
- `prefers-reduced-motion: reduce` support
- ARIA attributes in navigation and interactive UI
- Contact form with labels, validation, and `aria-live` feedback

**SEO basics present in the project:**
- `description` and `robots` meta tags
- `rel="canonical"`
- `sitemap.xml`
- `robots.txt`

---

### 7. Deployment (Netlify)
The project is prepared for static-site hosting on Netlify.

Practical deployment flow:
1. Build CSS: `npm run build`
2. Deploy the project directory as a static site
3. Netlify applies rules from `_headers` and `_redirects`

Notes:
- The contact form uses `data-netlify="true"`
- PWA uses `service-worker.js` and `site.webmanifest`; run an offline smoke test after deployment

---

### 8. Release checklist
Before deployment:
- [ ] `npm install`
- [ ] `npm run build`
- [ ] Confirm `css/style.min.css` exists
- [ ] Open key pages and verify no CSS/JS regressions
- [ ] Check contact form rendering + validation
- [ ] Run a quick offline smoke test (after loading the site online)
- [ ] Verify `robots.txt` and `sitemap.xml`
