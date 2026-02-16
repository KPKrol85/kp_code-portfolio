# AUDIT — Axiom Construction (Senior Front-End Review)

## 1. Executive summary
Projekt jest dojrzałym, wielostronicowym wdrożeniem statycznym z modularną architekturą CSS (tokens/base/layout/components/sections), dobrze uporządkowanym SEO oraz solidnym fundamentem dostępności. Struktura BEM + utility jest czytelna, a kod JS jest podzielony na warstwy (`core/components/sections/utils`).

Najważniejsze ryzyko produkcyjne dotyczy rejestracji service workera ścieżką relatywną (`./sw.js`), która na podstronach może kierować do nieistniejącego zasobu (`/services/sw.js`, `/legal/sw.js`). To obniża niezawodność PWA/offline dla wejść bezpośrednio na podstrony.

## 2. P0 — Critical risks

### P0-1: Relatywna rejestracja service workera na podstronach
- **Impact:** użytkownicy wchodzący bezpośrednio na podstrony mogą nie zarejestrować SW, więc nie otrzymają spójnego działania offline/cache i aktualizacji PWA.
- **Evidence:** `js/core/service-worker.js` rejestruje `navigator.serviceWorker.register("./sw.js")`; podstrony ładują runtime JS (`services/*.html`, `legal/*.html`) i wykonują tę samą logikę z bundla `dist/script.min.js`.
- **Fix:** zmienić ścieżkę na absolutną: `navigator.serviceWorker.register("/sw.js", { scope: "/" })` oraz przebudować `dist/script.min.js`.
- **Effort:** **S**

## 3. Strengths
- Warstwowa architektura CSS jest konsekwentna (`css/main.css` importuje: tokens → base → layout → components → sections).
- Design tokens są używane systemowo (kolory, spacing, powierzchnie, header metrics).
- Hierarchia nagłówków jest poprawna (1x H1 per page; brak skoków H1→H3).
- Skip linki i style focus-visible są obecne.
- Formularz kontaktowy ma Netlify Forms, honeypot i walidację klienta + no-JS fallback (`method="POST"`, `action="/success.html"`).
- SEO bazowe jest kompletne (canonical, robots, OG/Twitter, robots.txt, sitemap.xml).
- Obrazy są dostarczane z nowoczesnymi formatami (AVIF/WEBP + fallback JPG) i responsywnymi źródłami.

## 4. P1 — 5 improvements worth doing next

### P1-1: Ujednolicić runtime JS między stronami
- **Reason:** strona główna ładuje `js/main.js`, a podstrony `dist/script.min.js`; utrudnia to kontrolę regresji i spójność działania.
- **Suggested improvement:** przyjąć jedną strategię runtime (np. wyłącznie `dist/script.min.js` lub pełny ESM) dla wszystkich stron.

### P1-2: Zapewnić baseline no-JS dla nawigacji mobilnej
- **Reason:** przy `max-width: 768px` `#primaryNav` jest domyślnie ukryte (`display: none`) i odsłaniane przez JS.
- **Suggested improvement:** zastosować strategię progressive enhancement (np. klasa `js` na `<html>` i ukrywanie menu tylko gdy JS aktywny).

### P1-3: Ograniczyć niespójność CSP vs inline JSON-LD
- **Reason:** `_headers` ma `script-src 'self'` bez nonce/hash; JSON-LD jest osadzane inline na stronach.
- **Suggested improvement:** dodać nonce/hash dla inline JSON-LD lub przenieść dane do plików zewnętrznych i osadzać je zgodnie z CSP.

### P1-4: Domknąć checklistę wymiarów obrazów (lightbox)
- **Reason:** dynamiczny `img.lb__img` nie ma `width/height`, co utrudnia pełną zgodność z „images have width/height”.
- **Suggested improvement:** dodać stałe proporcje kontenera lightboxa i/lub dynamiczne ustawianie atrybutów wymiarów.

### P1-5: Oczyścić logi narzędziowe i dodać policy check
- **Reason:** w repozytorium występują `console.log` w skryptach buildowych.
- **Suggested improvement:** zamienić na kontrolowany logger poziomowany i dodać lint/check blokujący niezamierzone logi w kodzie runtime.

## 5. Future enhancements — 5 realistic ideas
1. Dodać CI job uruchamiający `qa:links` + walidację JSON-LD i raporty artefaktowe.
2. Dodać automatyczny smoke test klawiaturowy (menu mobilne, lightbox, formularz).
3. Wprowadzić centralny generator metadanych SEO/OG/JSON-LD (single source of truth).
4. Dodać performance budgets dla `dist/style.min.css`, `dist/script.min.js` i obrazów hero/gallery.
5. Dodać wersję i18n EN dla treści strony (obecnie nie wykryto wariantu EN w implementacji HTML).

## 6. Compliance checklist (pass / fail)
- **headings valid:** **PASS**
- **no broken links:** **PASS**
- **no console.log:** **FAIL**
- **aria attributes valid:** **PASS**
- **images have width/height:** **FAIL**
- **no-JS baseline usable:** **FAIL**
- **sitemap present (if expected):** **PASS**
- **robots present:** **PASS**
- **OG image exists:** **PASS**
- **JSON-LD valid:** **PASS**

## 7. Architecture Score (0–10)
- **BEM consistency:** 8.6/10
- **token usage:** 9.0/10
- **accessibility:** 8.0/10
- **performance:** 8.3/10
- **maintainability:** 8.2/10

**Overall Architecture Score: 8.4 / 10**

## 8. Senior rating (1–10)
**Senior rating: 8.3 / 10**

Uzasadnienie: projekt jest portfolio-grade i technicznie solidny, z dobrą architekturą warstwową i wysoką jakością bazową SEO/A11y. Główne braki dotyczą spójności runtime, progressive enhancement na mobile no-JS oraz domknięcia kwestii SW/CSP pod pełny poziom produkcyjny.
