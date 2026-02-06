# Vista — Hotels & Travel (Clean Rebuild)

Profesjonalna, dostępna i responsywna wersja projektu „Vista — Hotels & Travel” w czystym HTML/CSS/JS. Projekt zawiera tryby Light/Dark/Auto, progresywne ulepszenia (PWA), lekkie animacje oraz konfigurację Netlify (nagłówki bezpieczeństwa, przekierowania).

## Struktura

tourism-and-hotels/
- index.html
- rooms.html
- offers.html
- gallery.html
- contact.html
- legal.html
- offline.html
- site.webmanifest
- sitemap.xml
 - robots.txt
 - /css/style.css
 - /js/script.js
 - /js/features/{nav.js,theme.js,reveal.js,lightbox.js,form.js,tabs.js}
 - /assets/
   - /img/
    - /hero/ (placeholdery do podmiany)
    - /rooms/ (placeholdery do podmiany)
    - /offers/ (placeholdery do podmiany)
    - /gallery/ (placeholdery do podmiany)
    - /ui/ (ikony, favicons – docelowo PNG/SVG)
    - placeholders.txt
- /pwa/service-worker.js
- /netlify/_headers
- /netlify/_redirects

## Rozwój

- Pliki statyczne – czysty HTML/CSS/JS, brak bundlera.
- Skrypty ładują się jako `type="module"` + `defer`.
- Jedyny plik CSS: `css/style.css`.
- Entry JS: `js/script.js` (importuje moduły z `js/features`).

## Obrazy (placeholdery → podmiana)

W projekcie użyte są placeholdery (data URI lub puste foldery). Aby podmienić obrazy na produkcyjne, dodaj pliki do folderów i uaktualnij ścieżki/sources w `<picture>`:

Zalecane nazewnictwo i rozmiary (przykłady; dopasuj do realnych kadrów):

- Hero: `assets/img/hero/hero-01-{480,720,960,1280,1600,2000}.{avif,webp,jpg}`
- Rooms: `assets/img/rooms/room-0{1..8}-{480,720,960,1280}.{avif,webp,jpg}`
- Offers: `assets/img/offers/offer-0{1..6}-{480,720,960}.{avif,webp,jpg}`
- Gallery: `assets/img/gallery/gallery-0{1..12}-{480,720,960,1280}.{avif,webp,jpg}`
- UI/Ikony: `assets/img/ui/icon-192.png`, `assets/img/ui/icon-512.png`, favicons (PNG/SVG).

W HTML zadbaj o:

- LCP (hero) – `<picture>` z AVIF/WebP/JPG, `fetchpriority="high"`, jawne `width`/`height`.
- Pozostałe obrazy – `loading="lazy"`, `decoding="async"`, jawne wymiary i sensowne opisy `alt`.

## Tryb kolorów (Light/Dark/Auto)

- Przycisk w nagłówku przełącza cykl: Jasny → Ciemny → Auto.
- Preferencja zapisywana w `localStorage` (`th_pref`).
- `Auto` synchronizuje się z `prefers-color-scheme`.

## Dostępność (A11y)

- Skip link, poprawne role/aria, widoczny focus, kontrasty AA.
- Semantyka: header/nav/main/section/article/figure/figcaption/footer.
- Nawigacja mobilna z aria-controls/expanded i trapowaniem fokusu.
- Galeria zawiera dostępny lightbox (`role="dialog"`, obsługa klawiatury, Esc, overlay).

## PWA

- `site.webmanifest` (tymczasowe ikony jako data URI – zalecana podmiana na PNG 192/512).
- `pwa/service-worker.js`:
  - cache-first dla statyków (CSS/JS/manifest)
  - network-first dla HTML
  - fallback `offline.html`

## Netlify

- `_headers` – nagłówki bezpieczeństwa (CSP, nosniff, referrer-policy, permissions-policy).
- `_redirects` – uproszczenie ścieżek do `index.html` (200 SPA fallback).

## Uruchomienie lokalne

To statyczny projekt – wystarczy dowolny serwer plików (np. `npx http-server .`).

## Kryteria odbioru – stan

- [x] Struktura katalogów i plików utworzona.
- [x] CSS/JS w jednym entry, moduły JS w `/features`.
- [x] Podstrony ukończone i spięte.
- [x] Tryb Light/Dark/Auto z pamięcią pref.
- [x] LCP hero; reszta lazy; minimalny CLS (wymiary mediów).
- [x] A11y i RWD (320–1440+).
- [x] PWA (SW + offline fallback). Ikony – podmień na PNG.
- [x] Netlify + SEO pliki (`sitemap.xml`, `robots.txt`).
