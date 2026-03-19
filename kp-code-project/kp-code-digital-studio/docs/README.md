# KP_Code Digital Studio

## PL

### Przegląd projektu

Repozytorium zawiera statyczny serwis front-end dla `KP_Code Digital Studio`, zbudowany z wielu stron HTML, współdzielonych arkuszy CSS, skryptów Vanilla JS oraz pomocniczych skryptów Node do przetwarzania obrazów. Implementacja jest oparta na plikach źródłowych w katalogach `css/`, `js/`, `services/`, `projects/` i `seo/`.

### Kluczowe funkcje

- Wielostronicowy serwis z podstronami: `about.html`, `services.html`, `projects.html`, `contact.html`, stronami usług, stronami projektów oraz stronami prawnymi.
- Wspólna nawigacja z menu mobilnym, obsługą `Escape`, blokadą fokusu w otwartym menu i linkiem skip-link do treści.
- Przełącznik motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Sekcje ujawniane przy przewijaniu (`IntersectionObserver`) oraz filtrowanie listy projektów po kategoriach.
- Formularz kontaktowy z walidacją po stronie klienta i komunikatami błędów.
- Lokalnie hostowane fonty `Space Grotesk`, system tokenów CSS i rozdzielenie stylów na pliki bazowe, komponentowe i sekcyjne.
- Pliki SEO i PWA: `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, Open Graph i dane strukturalne JSON-LD na stronie głównej.
- Skrypty Node do generowania zoptymalizowanych wariantów obrazów przy użyciu `sharp`.

### Stack technologiczny

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- `sharp`
- `fast-glob`

### Struktura projektu

- `index.html` - strona główna
- `about.html`, `services.html`, `projects.html`, `contact.html` - główne podstrony
- `services/` - podstrony ofert
- `projects/` - podstrony projektów
- `css/` - `tokens.css`, `base.css`, `components.css`, `sections.css`
- `js/` - `theme.js`, `main.js`
- `assets/` - obrazy, ikony, fonty
- `og/` - obrazy Open Graph
- `seo/` - `manifest.webmanifest`, `robots.txt`, `sitemap.xml`
- `scripts/images/` - narzędzia do budowy i czyszczenia wariantów obrazów
- `docs/` - istniejąca dokumentacja repozytorium

### Instalacja i uruchomienie

1. `npm install`
2. Serwis nie definiuje skryptu `dev` ani `start`.
3. Do lokalnego podglądu użyj statycznego serwera HTTP uruchomionego w katalogu projektu.

Uwaga: w repozytorium występują ścieżki root-relative, np. `/assets/...` i `/seo/...`, więc testowanie przez zwykłe `file://` może dawać inne wyniki niż hosting statyczny.

### Build i wdrożenie

- `package.json` zawiera tylko skrypty związane z obrazami.
- Nie wykryto bundlera front-endowego ani skryptu produkcyjnego.
- Nie wykryto plików `_headers`, `_redirects`, konfiguracji Netlify ani Vercel.
- Nie wykryto service workera.
- Wdrożenie wymaga hostingu statycznego serwującego katalog projektu jako root oraz pliki z `seo/`.

### Dostępność

- Wdrożono skip-link, widoczne style fokusu oraz semantyczne elementy `header`, `nav`, `main`, `section`, `article`, `footer`.
- Menu mobilne obsługuje `aria-expanded`, `aria-hidden`, zamykanie klawiszem `Escape` i zwrot fokusu.
- Styl i skrypty reagują na `prefers-reduced-motion`.
- Formularz ma etykiety, komunikaty błędów i `aria-live`.
- Szczegóły braków i ryzyk znajdują się w `AUDIT.md`.

### SEO

- Każda sprawdzona strona HTML zawiera `title`, `meta description`, `canonical`, `og:url`, `og:image` i manifest.
- `index.html` zawiera dane strukturalne JSON-LD dla `Person`, `Organization` i `Service`.
- W repozytorium są obecne `seo/robots.txt` i `seo/sitemap.xml`.
- Zakres sitemap nie pokrywa całego aktualnego zestawu publicznych stron.

### Wydajność

- Na stronie głównej wdrożono obrazy responsywne w `AVIF` i `WebP`.
- Obrazy w HTML mają atrybuty `width` i `height`, a większość niekrytycznych grafik używa `loading="lazy"` i `decoding="async"`.
- Fonty są hostowane lokalnie i używają `font-display: swap`.
- Style są rozbite na cztery osobne pliki ładowane synchronicznie.

### Roadmapa rekomendowana

- Podłączyć rzeczywisty backend lub usługę wysyłki formularza kontaktowego.
- Naprawić `aria-current` na wszystkich podstronach.
- Uzupełnić `sitemap.xml` o wszystkie kanoniczne strony publiczne.
- Zastąpić generyczne linki społecznościowe docelowymi profilami lub usunąć je do czasu publikacji.
- Dodać jawny workflow lokalnego uruchamiania i wdrożenia do repozytorium.

### Licencja

Licencja nie została wykryta w repozytorium.

---

## EN

### Project overview

This repository contains a static front-end website for `KP_Code Digital Studio`, built from multiple HTML pages, shared CSS stylesheets, Vanilla JS modules, and Node-based image utilities. The implementation is driven by source files in `css/`, `js/`, `services/`, `projects/`, and `seo/`.

### Key features

- Multi-page website with `about.html`, `services.html`, `projects.html`, `contact.html`, service detail pages, project detail pages, and legal pages.
- Shared navigation with a mobile menu, `Escape` handling, focus trapping, and a skip link.
- Light/dark theme toggle with persistence in `localStorage`.
- Scroll-reveal sections (`IntersectionObserver`) and category filtering on the projects page.
- Contact form with client-side validation and inline error messaging.
- Locally hosted `Space Grotesk` fonts, CSS token system, and separate base/component/section stylesheets.
- SEO and PWA files: `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, Open Graph metadata, and homepage JSON-LD.
- Node scripts for generating optimized image variants with `sharp`.

### Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- `sharp`
- `fast-glob`

### Structure overview

- `index.html` - homepage
- `about.html`, `services.html`, `projects.html`, `contact.html` - main pages
- `services/` - service detail pages
- `projects/` - project detail pages
- `css/` - `tokens.css`, `base.css`, `components.css`, `sections.css`
- `js/` - `theme.js`, `main.js`
- `assets/` - images, icons, fonts
- `og/` - Open Graph assets
- `seo/` - `manifest.webmanifest`, `robots.txt`, `sitemap.xml`
- `scripts/images/` - image build and cleanup utilities
- `docs/` - existing repository documentation

### Setup and run

1. `npm install`
2. The repository does not define `dev` or `start` scripts.
3. Use any static HTTP server from the project root for local preview.

Note: the project uses root-relative paths such as `/assets/...` and `/seo/...`, so `file://` preview may not match real hosting behavior.

### Build and deployment notes

- `package.json` only defines image-processing scripts.
- No front-end bundler or production build script was detected.
- No `_headers`, `_redirects`, Netlify config, or Vercel config was detected.
- No service worker was detected.
- Deployment requires a static host serving the project root and the `seo/` files.

### Accessibility notes

- The implementation includes a skip link, visible focus styles, and semantic `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- The mobile menu handles `aria-expanded`, `aria-hidden`, `Escape`, and focus return.
- Both CSS and JS respect `prefers-reduced-motion`.
- The contact form includes labels, inline error containers, and live regions.
- Known gaps and risks are documented in `AUDIT.md`.

### SEO notes

- Each reviewed HTML page includes `title`, `meta description`, `canonical`, `og:url`, `og:image`, and manifest metadata.
- `index.html` includes JSON-LD for `Person`, `Organization`, and `Service`.
- `seo/robots.txt` and `seo/sitemap.xml` are present in the repository.
- The current sitemap does not cover the full set of public canonical pages.

### Performance notes

- The homepage uses responsive `AVIF` and `WebP` images.
- HTML images include `width` and `height`, and most non-critical images use `loading="lazy"` and `decoding="async"`.
- Fonts are self-hosted and use `font-display: swap`.
- Styles are split into four synchronous CSS files.

### Recommended roadmap

- Connect the contact form to a real submission backend or service.
- Fix `aria-current` across all non-home pages.
- Expand `sitemap.xml` to include all canonical public pages.
- Replace generic social links with real profiles or remove them until ready.
- Add an explicit local-run and deployment workflow to the repository.

### License

No license file was detected in the repository.
