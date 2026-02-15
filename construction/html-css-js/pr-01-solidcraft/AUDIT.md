# AUDIT — SolidCraft (Senior Front-End Review)

## 1) Executive summary
Projekt ma solidną bazę produkcyjną: spójne meta SEO, konsekwentny układ stron, rozbudowane dane strukturalne, poprawne formaty obrazów i modularny CSS oparty na tokenach. Architektura jest czytelna i utrzymywalna.

Wykryto jednak dwa ryzyka krytyczne:
1. rejestracja Service Workera zależna od bieżącej ścieżki (nie działa poprawnie na podstronach),
2. brak baseline no-JS dla mobilnej nawigacji (menu pozostaje ukryte).

## 2) P0 — Critical risks (real issues only)

### P0.1 — Service Worker registration fails on nested routes
- **Impact:** Funkcje PWA/offline działają niestabilnie zależnie od punktu wejścia. Użytkownik otwierający serwis od podstrony (`/oferta/...`, `/doc/...`) może nie mieć aktywnego SW.
- **Evidence:** `js/sw-register.js` rejestruje `navigator.serviceWorker.register("sw.js")` (ścieżka względna). Podstrony ładują ten sam plik przez `../js/sw-register.js`, więc przeglądarka próbuje rejestracji pod `/oferta/sw.js` lub `/doc/sw.js`.
- **Fix:** Zmienić rejestrację na ścieżkę absolutną: `navigator.serviceWorker.register('/sw.js', { scope: '/' })`.
- **Effort:** S

### P0.2 — Mobile navigation is inaccessible without JavaScript
- **Impact:** Przy wyłączonym JS na mobile (≤1024px) użytkownik traci dostęp do głównej nawigacji, co pogarsza dostępność i baseline progressive enhancement.
- **Evidence:** `css/style.css` ustawia `.nav-menu { display: none; }` w `@media (max-width: 1024px)` i pokazuje menu wyłącznie klasą `.nav-menu.open`. Klasa `open` jest dodawana tylko przez JS (`js/script.js`, `initNav`).
- **Fix:** Wprowadzić fallback no-JS (np. klasa `no-js` na `<html>` usuwana przez JS; dla `no-js` ustawić `.nav-menu{display:flex}` i ukryć `.nav-toggle`).
- **Effort:** M

## 3) Strengths
- Spójna struktura dokumentów: canonical, OpenGraph, Twitter Cards i metadata na stronach publicznych.
- Inline JSON-LD jest składniowo poprawny (22 bloki, bez błędów parsowania).
- Obrazy mają poprawne ścieżki i zadeklarowane `width`/`height` dla `<img>`.
- Formularz kontaktowy ma etykiety, `required`, `aria-live`, honeypot i dedykowaną stronę potwierdzenia.
- Architektura CSS wykorzystuje tokeny (`:root`), sekcje i nomenklaturę komponentową z czytelnym podziałem odpowiedzialności.

## 4) P1 — 5 improvements worth doing next (exactly five)

### P1.1 — Add `noindex` for utility pages (404/offline/thank-you)
- **Reason:** Strony narzędziowe nie powinny konkurować z docelowymi URL-ami w indeksie.
- **Suggested improvement:** Ustawić `meta robots="noindex, follow"` dla `404.html`, `offline.html`, `thank-you/index.html`.

### P1.2 — Remove stale comments and typos in source headers
- **Reason:** Nagłówki plików zawierają literówki (`Aanimations`, `sytyles`) i mylące opisy (`CSS Stylesheet` w `js/script.js`).
- **Suggested improvement:** Ujednolicić komentarze nagłówkowe oraz metadata plików źródłowych.

### P1.3 — Tighten CSP for long-term hardening
- **Reason:** Aktualna polityka CSP jest poprawna bazowo, ale można doprecyzować ją pod konkretne źródła i typy zasobów.
- **Suggested improvement:** Rozważyć nonce/hash policy dla skryptów oraz doprecyzowanie `connect-src`/`img-src` wg realnego użycia.

### P1.4 — Move repetitive per-page SEO/JSON-LD into generation step
- **Reason:** Duplikacja bloków SEO i JSON-LD na wielu stronach zwiększa koszt utrzymania.
- **Suggested improvement:** Wprowadzić generator/templating na etapie build (np. skrypt Node) dla wspólnych sekcji head.

### P1.5 — Remove non-essential `console.log` from project tooling output
- **Reason:** Wymóg higieny statycznej (`no console.log`) formalnie nie jest spełniony (`scripts/images.js`).
- **Suggested improvement:** Zastąpić logi opcjonalnym verbose mode (`--verbose`) albo `console.info` pod flagą środowiskową.

## 5) Future enhancements — 5 realistic ideas (exactly five)
1. Dodać automatyczny link checker (href/src/srcset + anchors) uruchamiany w CI.
2. Dodać automatyczną walidację JSON-LD i raport schematów podczas build.
3. Wprowadzić Lighthouse CI z progami dla Performance/Accessibility/SEO.
4. Rozszerzyć strategię SW o pre-cache krytycznych obrazów hero dla szybszego LCP.
5. Dodać mechanizm `lastmod` do `sitemap.xml` generowany z git metadata.

## 6) Compliance checklist (pass / fail)
- **headings valid:** **PASS**
- **no broken links:** **PASS**
- **no console.log:** **FAIL**
- **aria attributes valid:** **PASS**
- **images have width/height:** **PASS**
- **no-JS baseline usable:** **FAIL**
- **sitemap present (if expected):** **PASS**
- **robots present:** **PASS**
- **OG image exists:** **PASS**
- **JSON-LD valid:** **PASS**

## 7) Architecture Score (0–10)
- **BEM consistency:** 8.0/10
- **token usage:** 8.5/10
- **accessibility:** 7.2/10
- **performance:** 8.0/10
- **maintainability:** 7.8/10

**Overall architecture score:** **7.9/10**

## 8) Senior rating (1–10)
**7.8/10** — Projekt jest dojrzały wizualnie i architektonicznie, z poprawną bazą SEO/performance, ale wymaga usunięcia krytycznych luk w progressive enhancement i stabilności rejestracji SW, aby spełnić standard production-grade portfolio.
