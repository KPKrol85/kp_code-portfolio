# Axiom Construction — dokumentacja projektu

## Wersja polska

### Przegląd projektu
Axiom Construction to wielostronicowy serwis firmowy (HTML/CSS/JS) dla firmy budowlano-remontowej. Projekt zawiera stronę główną, podstrony usług, podstrony prawne, formularz kontaktowy Netlify oraz konfigurację PWA (manifest + service worker).

### Kluczowe funkcje
- Strona główna z sekcjami: hero, o nas, usługi, galeria, FAQ, kontakt.
- Podstrony usług: budowa domów, remonty mieszkań, wykończenia wnętrz, adaptacje poddaszy, instalacje sanitarne, instalacje elektryczne.
- Podstrony prawne: regulamin, polityka prywatności, polityka cookies, certyfikaty, kariera.
- Formularz kontaktowy z walidacją klienta, honeypotem, reCAPTCHA Netlify i trybem fallback.
- Tryb jasny/ciemny z zapisem preferencji.
- Lightbox galerii i mobilne menu z obsługą klawiatury.
- SEO: canonicale, OpenGraph, Twitter cards, JSON-LD, robots.txt i sitemap.xml.
- PWA: manifest.webmanifest, offline page oraz service worker.

### Tech stack
- HTML5
- CSS (modułowy podział: tokens/base/layout/components/sections)
- Vanilla JavaScript (modułowy podział: core/components/sections/utils)
- Narzędzia Node.js (build CSS/JS/SW, obrazki, QA links/lighthouse/pa11y)

### Struktura projektu (skrót)
- `index.html` — strona główna.
- `services/*.html` — podstrony usług.
- `legal/*.html` — podstrony prawne.
- `css/main.css` + moduły `css/tokens`, `css/base`, `css/layout`, `css/components`, `css/sections`.
- `js/main.js` + moduły `js/core`, `js/components`, `js/sections`, `js/utils`.
- `manifest.webmanifest`, `sw.js`, `offline.html`.
- `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`.

### Setup i uruchomienie
1. Zainstaluj zależności:
   - `npm install`
2. Uruchom lokalny serwer:
   - `npm run serve`
3. (Opcjonalnie) uruchom build assetów:
   - `npm run build`

### Notatki build/deployment
- Projekt ma gotowe skrypty do budowy CSS/JS/SW oraz head metadata.
- Konfiguracja deploymentu opiera się o pliki `_headers` i `_redirects` (Netlify).
- Strategia minifikacji (`dist/style.min.css`, `dist/script.min.js`) jest częścią pipeline’u build.

### Notatki dostępności
- Dostępny skip link do `<main>`.
- Widoczne style `:focus-visible` i ARIA dla kluczowych kontrolek nawigacji.
- FAQ oparte o natywne `<details>/<summary>`.
- Formularz zawiera etykiety, statusy live region i komunikaty błędów.
- Występuje fallback bez JavaScript dla formularza (POST + strona sukcesu).

### Notatki SEO
- Meta description, canonical, OpenGraph i Twitter Cards obecne na stronach.
- JSON-LD osadzone inline (m.in. LocalBusiness/WebSite/Breadcrumb/FAQ).
- robots.txt i sitemap.xml obecne.

### Notatki wydajności
- Obrazy responsywne (`<picture>`, AVIF/WebP/JPG fallback).
- W większości obrazów ustawione `width`/`height`, `loading="lazy"`, `decoding="async"`.
- Fonty preload + `font-display: swap`.
- Skrypt główny ładowany z `defer`.

### Roadmapa
- Spójność danych kontaktowych na wszystkich CTA usług.
- Korekta skrótu PWA „Oferta” (`/#oferta` → istniejący identyfikator sekcji).
- Ujednolicenie polityki redukcji ruchu dla wszystkich animacji/przejść.
- Rozszerzenie automatycznych testów QA (np. regularne uruchamianie pa11y/lighthouse).
- Dalsze porządkowanie współdzielonych fragmentów HTML pod kątem utrzymania.

### Licencja
MIT (zgodnie z `package.json`).

---

## English version

### Project overview
Axiom Construction is a multi-page company website (HTML/CSS/JS) for a construction and renovation business. The project includes a homepage, service subpages, legal subpages, a Netlify contact form, and PWA configuration (manifest + service worker).

### Key features
- Homepage sections: hero, about, services, gallery, FAQ, contact.
- Service pages: home construction, apartment renovations, interior finishing, attic adaptations, sanitary installations, electrical installations.
- Legal pages: terms, privacy policy, cookies policy, certificates, careers.
- Contact form with client-side validation, honeypot, Netlify reCAPTCHA, and fallback mode.
- Light/dark theme with persisted preference.
- Gallery lightbox and keyboard-capable mobile navigation.
- SEO: canonical tags, OpenGraph, Twitter cards, JSON-LD, robots.txt, sitemap.xml.
- PWA: manifest.webmanifest, offline page, and service worker.

### Tech stack
- HTML5
- CSS (modular split: tokens/base/layout/components/sections)
- Vanilla JavaScript (modular split: core/components/sections/utils)
- Node.js tooling (CSS/JS/SW build, image tasks, QA links/lighthouse/pa11y)

### Structure overview (short)
- `index.html` — homepage.
- `services/*.html` — service pages.
- `legal/*.html` — legal pages.
- `css/main.css` + modules in `css/tokens`, `css/base`, `css/layout`, `css/components`, `css/sections`.
- `js/main.js` + modules in `js/core`, `js/components`, `js/sections`, `js/utils`.
- `manifest.webmanifest`, `sw.js`, `offline.html`.
- `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`.

### Setup & run
1. Install dependencies:
   - `npm install`
2. Start local server:
   - `npm run serve`
3. (Optional) run full asset build:
   - `npm run build`

### Build/deployment notes
- The project has dedicated scripts for CSS/JS/SW and head metadata generation.
- Deployment configuration is handled via `_headers` and `_redirects` (Netlify).
- Minified asset strategy (`dist/style.min.css`, `dist/script.min.js`) is part of the build pipeline.

### Accessibility notes
- Skip link to `<main>` is implemented.
- Visible `:focus-visible` styles and ARIA states for key navigation controls.
- FAQ uses native `<details>/<summary>`.
- Form includes labels, live regions, and validation feedback.
- No-JS form fallback is present (POST + success page).

### SEO notes
- Meta description, canonical, OpenGraph, and Twitter Cards are implemented.
- Inline JSON-LD is present (including LocalBusiness/WebSite/Breadcrumb/FAQ).
- robots.txt and sitemap.xml are included.

### Performance notes
- Responsive images (`<picture>`, AVIF/WebP/JPG fallback).
- Most images include `width`/`height`, `loading="lazy"`, and `decoding="async"`.
- Font preloads + `font-display: swap`.
- Main script is loaded with `defer`.

### Roadmap
- Normalize contact data across all service-page CTAs.
- Fix PWA shortcut target for “Oferta” (`/#oferta` → existing section id).
- Expand reduced-motion coverage across all animations/transitions.
- Extend repeatable QA runs (pa11y/lighthouse in routine workflow).
- Further reduce duplicated HTML fragments for long-term maintainability.

### License
MIT (as declared in `package.json`).
