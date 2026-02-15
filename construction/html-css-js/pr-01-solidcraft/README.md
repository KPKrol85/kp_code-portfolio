# SolidCraft — Portfolio Front-End

## Wersja polska

### Przegląd projektu
SolidCraft to statyczny serwis portfolio firmy remontowo-budowlanej oparty o HTML, CSS i JavaScript. Projekt zawiera stronę główną, podstrony usługowe, strony dokumentów, stronę 404, stronę offline oraz stronę potwierdzenia wysłania formularza.

### Kluczowe funkcje (potwierdzone w kodzie)
- Strona główna z sekcjami: hero, oferta, realizacje, opinie, FAQ i kontakt.
- Podstrony usług: łazienki, malowanie, kafelkowanie, elektryka, hydraulika, remonty.
- Formularz kontaktowy Netlify (`netlify`, `netlify-honeypot`) z natywną walidacją HTML oraz walidacją JS.
- Przełączanie motywu jasny/ciemny z inicjalizacją motywu przed renderem (`theme-init.js`).
- Komponenty dostępności: skip link, focus styles, `aria-expanded` dla menu, obsługa klawiatury w menu/dropdown.
- PWA: `manifest.webmanifest`, `sw.js`, rejestracja SW przez `js/sw-register.js`.
- SEO i dane strukturalne: canonical, OpenGraph/Twitter, inline JSON-LD, `robots.txt`, `sitemap.xml`.

### Tech stack
- HTML5
- CSS3 (tokeny design systemu, BEM, warstwa layout/components/utilities)
- Vanilla JavaScript
- Node.js tooling: PostCSS, cssnano, terser, sharp, live-server, prettier
- Konfiguracja deploy: Netlify (`netlify.toml`, `_headers`, `_redirects`)

### Struktura projektu (skrót)
- `index.html` — strona główna.
- `oferta/*.html` — podstrony usługowe.
- `doc/*.html` — dokumenty prawne.
- `thank-you/index.html`, `404.html`, `offline.html` — strony systemowe.
- `css/style.css`, `css/style.min.css` — style.
- `js/script.js`, `js/theme-init.js`, `js/sw-register.js` — logika UI i PWA.
- `sw.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml` — warstwa SEO/PWA.

### Setup i uruchomienie
```bash
npm install
npm run dev
```

### Build i deployment
```bash
npm run build
```
Build tworzy katalog `dist`, kopiuje projekt i podmienia referencje HTML na pliki zminifikowane (`style.min.css`, `script.min.js`, `theme-init.min.js`).

### Accessibility notes
- Zaimplementowane: skip link, focus-visible, obsługa `prefers-reduced-motion`, aria dla menu i dropdownów, fallback mapy przez `noscript`.
- Ograniczenie wykryte w audycie: przy szerokości mobilnej i wyłączonym JS menu główne pozostaje ukryte (`display: none`), co obniża użyteczność nawigacji.

### SEO notes
- Canonical i `og:url` są spójne na analizowanych stronach.
- JSON-LD jest osadzony inline i składniowo poprawny.
- `robots.txt` i `sitemap.xml` są obecne i wskazują domenę produkcyjną Netlify.

### Performance notes
- Obrazy mają warianty AVIF/WebP/JPG oraz `loading="lazy"` poza krytycznymi zasobami.
- Fonty WOFF2 są preloadowane, a `font-display: swap` ustawione.
- Service Worker używa cache (network-first dla HTML, cache-first dla assetów), ale rejestracja SW wymaga korekty ścieżki, by działała stabilnie na podstronach.

### Roadmapa
1. Naprawić rejestrację Service Workera na wszystkich ścieżkach.
2. Dodać fallback no-JS dla mobilnej nawigacji.
3. Zautomatyzować test linków/anchorów i walidację JSON-LD w CI.
4. Dodać `noindex` dla strony 404.
5. Ograniczyć ręczne utrzymywanie plików minifikowanych przez pełny pipeline release.

### Licencja
MIT (`package.json`).

---

## English version

### Project overview
SolidCraft is a static portfolio website for a construction/renovation company built with HTML, CSS, and JavaScript. The project includes a homepage, service subpages, legal pages, a 404 page, an offline page, and a thank-you page for form submission.

### Key features (confirmed in code)
- Homepage sections: hero, services, projects, testimonials, FAQ, contact.
- Service pages: bathrooms, painting, tiling, electrical, plumbing, renovations.
- Netlify contact form (`netlify`, `netlify-honeypot`) with native HTML validation and JS validation.
- Light/dark theme switching with pre-render theme init (`theme-init.js`).
- Accessibility features: skip link, visible focus, `aria-expanded` menu states, keyboard interactions.
- PWA layer: `manifest.webmanifest`, `sw.js`, SW registration via `js/sw-register.js`.
- SEO and structured data: canonical, OpenGraph/Twitter tags, inline JSON-LD, `robots.txt`, `sitemap.xml`.

### Tech stack
- HTML5
- CSS3 (design tokens, BEM, layout/components/utilities separation)
- Vanilla JavaScript
- Node.js tooling: PostCSS, cssnano, terser, sharp, live-server, prettier
- Deploy config: Netlify (`netlify.toml`, `_headers`, `_redirects`)

### Project structure (short)
- `index.html` — homepage.
- `oferta/*.html` — service subpages.
- `doc/*.html` — legal pages.
- `thank-you/index.html`, `404.html`, `offline.html` — system pages.
- `css/style.css`, `css/style.min.css` — styles.
- `js/script.js`, `js/theme-init.js`, `js/sw-register.js` — UI and PWA logic.
- `sw.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml` — SEO/PWA layer.

### Setup & run
```bash
npm install
npm run dev
```

### Build & deployment notes
```bash
npm run build
```
The build creates `dist`, copies project files, and rewrites HTML references to minified assets (`style.min.css`, `script.min.js`, `theme-init.min.js`).

### Accessibility notes
- Implemented: skip link, focus-visible, `prefers-reduced-motion`, ARIA menu/dropdown states, `noscript` map fallback.
- Known limitation from audit: on mobile width with JavaScript disabled, the main navigation remains hidden (`display: none`), reducing navigation usability.

### SEO notes
- Canonical and `og:url` are aligned across reviewed pages.
- JSON-LD is embedded inline and syntactically valid.
- `robots.txt` and `sitemap.xml` are present and point to the production Netlify domain.

### Performance notes
- Images use AVIF/WebP/JPG variants and `loading="lazy"` outside critical resources.
- WOFF2 fonts are preloaded and `font-display: swap` is configured.
- Service Worker caching strategy is present (network-first for HTML, cache-first for static assets), but SW registration path should be corrected for stable subpage behavior.

### Roadmap
1. Fix Service Worker registration path across all routes.
2. Add no-JS fallback for mobile navigation.
3. Automate link/anchor checks and JSON-LD validation in CI.
4. Add `noindex` for the 404 page.
5. Reduce manual minified file maintenance via a full release pipeline.

### License
MIT (`package.json`).
