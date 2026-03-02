# 1. Executive Summary

Projekt ma architekturę statycznego serwisu wielostronicowego z modularnym CSS (`css/style.css` + `css/modules/*`), modułowym JS (`js/script.js` + `js/modules/*`) oraz konfiguracją pod Netlify i PWA (`netlify.toml`, `_headers`, `manifest.webmanifest`, `sw.js`). Implementacja pokazuje dobrą dyscyplinę semantyki, a11y i SEO w warstwie HTML, ale zawiera jeden krytyczny problem wdrożeniowy: konfiguracja Netlify wskazuje katalog publikacji `dist`, którego standardowy pipeline deploy (`npm run build`) nie tworzy.

# 2. P0 — Critical Risks

## P0.1 — Niespójny pipeline deploy na Netlify (brak generowania katalogu `dist`)

- **Impact:** realne ryzyko nieudanych lub pustych wdrożeń produkcyjnych (Netlify publikuje z `dist`, ale komenda build go nie tworzy).
- **Evidence:** `netlify.toml` ustawia `publish = "dist"` i `command = "npm run build"`, podczas gdy w `package.json` skrypt `build` uruchamia tylko `build:css` i `build:js`; dopiero osobny skrypt `build:dist` tworzy `dist`.
- **Fix:** ujednolicić pipeline deploy: np. zmienić `netlify.toml` na `command = "npm run build && npm run build:dist"` (lub zmienić `build` tak, aby obejmował `build:dist`).
- **Effort:** S

# 3. Strengths

- Spójna warstwa SEO: canonical, OpenGraph, Twitter Card i JSON-LD na stronie głównej oraz podstronach oferty.
- Dobra baza a11y: skip link, semantyczne sekcje, etykietowanie formularza i stany fokusowe w CSS.
- Responsywna strategia obrazów (`picture`, AVIF/WEBP/JPG, `srcset`, `sizes`, `loading="lazy"`, wymiary obrazów) ogranicza koszt transferu.
- Rozsądna separacja odpowiedzialności w JS: podział na moduły (`nav`, `forms`, `map-consent`, `cookie-banner`, `lightbox`) oraz warunkowa inicjalizacja.
- Obecne zabezpieczenia i konfiguracja platformowa (`_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, SW + manifest) świadczą o myśleniu produkcyjnym.

# 4. P1 — Exactly 5 Improvements Worth Doing Next

## P1.1 — Ujednolicić ścieżkę assetów runtime vs service worker

- **Reason:** HTML ładuje runtime `css/style.css` i `js/script.js`, natomiast pre-cache SW zawiera `css/style.min.css` i `js/script.min.js`; to utrudnia przewidywalność cache/offline.
- **Suggested improvement:** dopasować listę `ASSETS` w `sw.js` do faktycznie używanych zasobów runtime albo wdrożyć jednolitą politykę „dist-only” dla produkcji.

## P1.2 — Ograniczyć duplikację head/header/footer między podstronami

- **Reason:** znaczne powielanie bloków SEO, nawigacji i stopki w `index.html`, `oferta/*.html`, `doc/*.html`, `404.html` zwiększa koszt utrzymania i ryzyko dryfu treści.
- **Suggested improvement:** wprowadzić generowanie z partiali (np. etap build z szablonami) lub centralny generator stron statycznych.

## P1.3 — Doprecyzować SEO social identity (placeholderowe profile social)

- **Reason:** w JSON-LD i linkach społecznościowych używane są adresy generyczne (`facebook.com`, `instagram.com`, `x.com`, `canva.com`), co osłabia sygnał encji marki.
- **Suggested improvement:** podmienić na rzeczywiste profile marki albo usunąć z danych strukturalnych, jeśli profile nie istnieją.

## P1.4 — Urealnić walidację a11y w CI/CD (obecnie zależna od lokalnych zależności)

- **Reason:** skrypt `qa:a11y` istnieje, ale bez lokalnego Playwright kończy się błędem, więc kontrola jakości a11y nie jest gwarantowana.
- **Suggested improvement:** dołączyć instalację zależności QA do pipeline CI i traktować `npm run check:predeploy` jako bramkę przed publikacją.

## P1.5 — Zmniejszyć ryzyko dryfu między `sitemap.xml` a realnym drzewem stron

- **Reason:** sitemap jest obecny, ale utrzymanie ręczne i zmiany stron mogą prowadzić do rozjazdu (w repo jest skrypt generatora, lecz nie jest spięty z głównym `build`).
- **Suggested improvement:** włączyć `build:sitemap` do domyślnego procesu build/deploy i egzekwować to w CI.

# 5. P2 — Minor Refinements (optional)

- Dodać krótką dokumentację „single source of truth” dla trybu dev vs produkcja (które pliki są runtime, które build artifacts).
- Rozważyć ograniczenie części preloadów do krytycznych zasobów dla pierwszego widoku po pomiarze Web Vitals.
- Ujednolicić daty `lastmod` przez automatyzację (np. z git log) zamiast wartości statycznych.

# 6. Future Enhancements — Exactly 5 Ideas

1. Dodać automatyczne testy regresji wizualnej kluczowych widoków (home + 6 podstron oferty).
2. Wprowadzić lekki system komponentów statycznych (partials/layouts) dla head/header/footer.
3. Rozszerzyć strategię SW o jawne versioning/hash i politykę aktualizacji cache po deploy.
4. Uruchomić cykliczny audyt Lighthouse CI (a11y/perf/SEO/best-practices) jako quality gate.
5. Dodać test integracyjny walidujący kompletność metadanych SEO (canonical, OG, JSON-LD, robots, sitemap).

# 7. Compliance Checklist (pass / fail)

- headings structure valid — **pass**
- no broken links (excluding .min strategy) — **pass**
- no console.log — **fail**
- aria attributes valid — **pass**
- images have width/height — **pass**
- no-JS baseline usable — **pass**
- robots.txt present (if expected) — **pass**
- sitemap.xml present (if expected) — **pass**
- OpenGraph image present — **pass**
- JSON-LD valid (if present) — **pass**

# 8. Architecture Score (1–10)

- structural consistency — **7/10**
- accessibility maturity — **8/10**
- performance discipline — **8/10**
- SEO correctness — **8/10**
- maintainability — **6/10**

**Wynik łączny: 7.4/10**

# 9. Senior Rating (1–10)

**7/10**

Projekt jest technicznie dojrzały jak na statyczny front-end i ma mocną bazę jakościową (SEO, a11y, modularny CSS/JS). Największy problem jest operacyjny: obecny kontrakt build/deploy nie gwarantuje poprawnego publikowania z `dist`. Po ujednoliceniu pipeline’u i redukcji duplikacji HTML architektura będzie wyraźnie łatwiejsza w utrzymaniu i skalowaniu.
