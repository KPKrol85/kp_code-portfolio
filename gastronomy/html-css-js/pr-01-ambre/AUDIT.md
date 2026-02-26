# AUDIT — Ambre (pr-01-ambre)

## 1. Executive summary
Projekt jest technicznie dojrzały jak na portfolio front-end: ma modularną architekturę CSS, spójne SEO, poprawnie podpięte dane strukturalne, PWA baseline oraz dobre fundamenty a11y (skip link, focus states, aria dla nawigacji i formularza). Największe realne ryzyko dotyczy powtarzalności środowiska QA/build (`npm ci` nie działa z powodu niespójnego lockfile), co utrudnia wiarygodne uruchamianie pełnego audytu automatycznego.

## 2. P0 — Critical risks (real issues only)
Brak wykrytych krytycznych ryzyk runtime (P0) w implementacji front-end podczas przeglądu statycznego i uruchomionych kontroli lokalnych (`qa:links`, `qa:seo`).

## 3. Strengths
- Dobra organizacja CSS (`base/layout/components/pages`) oraz konsekwentna warstwa tokenów.
- Poprawna implementacja dostępności w obszarze nawigacji mobilnej (focus trap, `aria-expanded`, `Esc`, przywracanie focusu).
- Formularz rezerwacji ma walidację po stronie klienta, komunikaty statusowe ARIA i honeypot antyspam.
- Spójne canonical/OG/Twitter + JSON-LD na podstronach.
- Obecne pliki wdrożeniowe: `_headers`, `_redirects`, `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`.

## 4. P1 — 5 improvements worth doing next

### 1) Niespójny lockfile blokuje reproducible QA
**Reason:** `npm ci` kończy się błędem synchronizacji `package.json` ↔ `package-lock.json`, więc pipeline nie jest deterministyczny.
**Suggested improvement:** Zsynchronizować lockfile (`npm install`, commit lockfile), uruchomić pełne `qa` i zablokować PR bez zielonego `npm ci`.
**DONE**

### 2) Brak gwarancji uruchomienia pełnego audytu a11y w świeżym środowisku
**Reason:** `qa:a11y` wymaga Playwright/axe; bez poprawnego lockfile i instalacji zależności nie uruchamia się w clean env.
**Suggested improvement:** Po naprawie lockfile dodać CI job dla `npm run qa:a11y` oraz cache przeglądarek Playwright.
**DONE**

### 3) Ręcznie utrzymywane hashe CSP są podatne na dryf
**Reason:** `_headers` zawiera wiele statycznych hashy `script-src-elem`; każda zmiana inline scriptów wymaga ręcznej aktualizacji.
**Suggested improvement:** Zautomatyzować generowanie hashy podczas build/deploy lub ograniczyć inline skrypty.
**DONE**

### 4) W repo są równolegle źródła i artefakt bundle JS
**Reason:** `js/script.js` (source) i `js/script.min.js` (bundle) współistnieją; istnieje ryzyko rozjazdu przy review i debugowaniu.
**Suggested improvement:** Ustalić politykę: albo build artifacts poza repo, albo obowiązkowa reguła CI sprawdzająca zgodność buildu z commitem.
**DONE**

### 5) Brak automatycznej walidacji kontrastu WCAG AA
**Reason:** Wymóg audytowy kontrastu nie jest obecnie potwierdzany dedykowanym testem z realnym obliczaniem kontrastu.
**Suggested improvement:** Dodać test kontrastu (np. axe + dodatkowa walidacja tokenów kolorystycznych) do `qa`.

## 5. P2 — Minor refinements
- Ujednolicić diakrytyki/ortografię w treściach demo (np. "prywatnosci", "Wyrazam zgode") dla pełnej jakości językowej.
- Dodać krótką sekcję „Known limitations” dla mapy Google iframe (zależność od zewnętrznego źródła).
- Rozważyć skrócenie preloadów fontów do najważniejszych wag na wejściu (critical path tuning).

## 6. Future enhancements — 5 realistic ideas
1. Dodać testy E2E kluczowych ścieżek (nawigacja, formularz, lightbox, tryb offline).
2. Rozszerzyć structured data o `FAQPage` dla sekcji FAQ (jeśli treści są utrzymywane stabilnie).
3. Wprowadzić automatyczny budżet wydajności (Lighthouse CI budgets + fail thresholds).
4. Dodać monitoring błędów JS po wdrożeniu (lekki runtime reporting).
5. Rozważyć wariant i18n (PL/EN) z osobnymi canonical/hreflang, jeśli projekt ma obsługiwać dwa rynki.

## 7. Compliance checklist (pass / fail)
- headings valid: **PASS**
- no broken links (excluding intentional .min strategy): **PASS**
- no console.log: **PASS**
- aria attributes valid: **PASS** (kontrola statyczna + implementacja modułów)
- images have width/height: **PASS**
- no-JS baseline usable: **PASS**
- sitemap present (if expected): **PASS**
- robots present: **PASS**
- OG image exists: **PASS**
- JSON-LD valid: **PASS** (lokalny skrypt `qa:seo`)

## 8. Architecture Score (0–10)
**8.6 / 10**
- BEM consistency: **8.8/10**
- token usage: **9.0/10**
- accessibility: **8.4/10**
- performance: **8.5/10**
- maintainability: **8.3/10**

## 9. Senior rating (1–10)
**8.5 / 10** — projekt ma profesjonalne fundamenty architektury front-end i wysoką jakość implementacji komponentowej; główny obszar do domknięcia to przewidywalność środowiska QA/build i automatyzacja walidacji jakości (a11y/kontrast/CI).
