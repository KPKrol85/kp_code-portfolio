# SolidCraft — strona firmy remontowo-budowlanej (demo)

Responsywny serwis demonstracyjny dla firmy remontowo-budowlanej. Projekt pokazuje kompletną stronę ofertową z sekcjami usług, realizacji, opinii, FAQ i formularzem wyceny, z naciskiem na semantykę HTML, dostępność oraz wydajność.

## Live demo

https://construction-project-01.netlify.app

## Funkcjonalności

- Wielosekcyjny landing page (oferta, realizacje, opinie, FAQ, kontakt).
- Podstrony ofertowe (łazienki, malowanie, kafelkowanie, elektryka, hydraulika, remonty).
- Przełączanie motywu (jasny/ciemny).
- Nawigacja z dropdownem i obsługą klawiatury.
- Formularz kontaktowy z walidacją po stronie klienta.
- Cookie banner.
- PWA (manifest + service worker).

## Stack technologiczny

- HTML5
- CSS3 (custom properties, responsywne layouty)
- JavaScript (Vanilla, ES6)
- Netlify (hosting/deployment)

## Struktura projektu

```
construction/html-css-js/pr-01-solidcraft/
├── assets/
│   ├── fonts/
│   ├── img/
│   └── img-src/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   ├── script.min.js
│   └── sw-register.js
├── doc/
│   ├── cookies.html
│   ├── polityka-prywatnosci.html
│   └── regulamin.html
├── oferta/
│   ├── elektryka.html
│   ├── hydraulika.html
│   ├── kafelkowanie.html
│   ├── lazienki.html
│   ├── malowanie.html
│   └── remonty.html
├── index.html
├── manifest.webmanifest
├── sw.js
├── robots.txt
├── sitemap.xml
├── _headers
└── _redirects
```

## Uruchomienie lokalne

Opcja 1: bez serwera
- Otwórz plik `index.html` bezpośrednio w przeglądarce.

Opcja 2: lokalny serwer
- Python:
  ```bash
  python -m http.server 8080
  ```
- Node (live-server):
  ```bash
  npm install
  npm run dev
  ```

## Dostępność

Wdrożone:
- Semantyczne landmarki (header, main, footer).
- Skip link do sekcji głównej.
- Widoczne stany focus i obsługa klawiatury dla nawigacji.
- Opisy pól formularza i podstawowa walidacja.

Jak testować:
- Przejście po stronie tylko klawiaturą (Tab / Shift+Tab / Enter / Esc).
- Audyt Lighthouse (Accessibility).
- Sprawdzenie kontrastu w trybie jasnym/ciemnym.

## Performance i SEO

Wdrożone:
- Obrazy w wielu formatach (AVIF/WEBP/JPG) i `srcset`.
- Lazy loading obrazów poza hero.
- Preload kluczowych fontów.
- Meta title/description + OpenGraph + Twitter Cards.
- Sitemap i robots.txt.
- Structured data (schema.org).

Jak sprawdzić:
- Lighthouse (Performance + SEO).
- WebPageTest lub Chrome DevTools Performance.

## PWA

Wdrożone:
- `manifest.webmanifest` z ikonami i shortcutami.
- Service worker z cache’owaniem zasobów.
- Praca offline dla podstawowych zasobów (shell).

Ograniczenia:
- Strategia cache wymaga przeglądu dla pełnej obsługi podstron i aktualizacji.

## Roadmap

- Dodać realny backend do formularza (np. Netlify Forms / endpoint API).
- Ujednolicić i wersjonować cache w service worker.
- Zmniejszyć zależność od inline script/style w celu zaostrzenia CSP.
- Dodać pełne testy a11y (np. axe) i kontrastów.
- Wprowadzić automatyczny build (npm scripts) w CI.

## Disclaimer

Projekt demonstracyjny. Wszystkie nazwy firm, dane adresowe i treści są fikcyjne i służą wyłącznie celom portfolio.

## Autor

Kamil Król (KP_Code_)

## License

Not specified

---

# SolidCraft — construction & renovation company website (demo)

Responsive demo website for a construction and renovation company. The project delivers a full marketing site with services, testimonials, FAQ, and a contact form, focusing on semantic HTML, accessibility, and performance.

## Live demo

https://construction-project-01.netlify.app

## Features

- Multi-section landing page (services, portfolio/logos, testimonials, FAQ, contact).
- Service subpages (bathrooms, painting, tiling, electrical, plumbing, renovations).
- Light/dark theme switch.
- Keyboard-friendly navigation with dropdown.
- Client-side validated contact form.
- Cookie banner.
- PWA (manifest + service worker).

## Tech stack

- HTML5
- CSS3 (custom properties, responsive layouts)
- JavaScript (Vanilla, ES6)
- Netlify (hosting/deployment)

## Project structure

```
construction/html-css-js/pr-01-solidcraft/
├── assets/
│   ├── fonts/
│   ├── img/
│   └── img-src/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   ├── script.min.js
│   └── sw-register.js
├── doc/
│   ├── cookies.html
│   ├── polityka-prywatnosci.html
│   └── regulamin.html
├── oferta/
│   ├── elektryka.html
│   ├── hydraulika.html
│   ├── kafelkowanie.html
│   ├── lazienki.html
│   ├── malowanie.html
│   └── remonty.html
├── index.html
├── manifest.webmanifest
├── sw.js
├── robots.txt
├── sitemap.xml
├── _headers
└── _redirects
```

## Local setup

Option 1: no local server
- Open `index.html` directly in the browser.

Option 2: local server
- Python:
  ```bash
  python -m http.server 8080
  ```
- Node (live-server):
  ```bash
  npm install
  npm run dev
  ```

## Accessibility

Implemented:
- Semantic landmarks (header, main, footer).
- Skip link to main content.
- Visible focus states and keyboard-friendly navigation.
- Labeled form fields with basic validation.

How to test:
- Navigate using keyboard only (Tab / Shift+Tab / Enter / Esc).
- Lighthouse Accessibility audit.
- Contrast checks in light/dark modes.

## Performance & SEO

Implemented:
- Multi-format responsive images (AVIF/WEBP/JPG) with `srcset`.
- Lazy loading for non-hero images.
- Preload of critical fonts.
- Meta title/description + OpenGraph + Twitter Cards.
- Sitemap and robots.txt.
- Structured data (schema.org).

How to verify:
- Lighthouse (Performance + SEO).
- WebPageTest or Chrome DevTools Performance.

## PWA

Implemented:
- `manifest.webmanifest` with icons and shortcuts.
- Service worker caching core assets.
- Offline support for basic shell assets.

Limitations:
- Cache strategy should be reviewed for full offline coverage and update flow.

## Roadmap

- Add a real contact form backend (e.g., Netlify Forms / API endpoint).
- Unify and version caches in the service worker.
- Remove reliance on inline script/style to tighten CSP.
- Add full a11y testing (e.g., axe) and contrast checks.
- Add automated build steps in CI.

## Disclaimer

Demo project only. Company names, addresses, and content are fictitious and used for portfolio purposes.

## Author

Kamil Król (KP_Code_)

## License

Not specified
