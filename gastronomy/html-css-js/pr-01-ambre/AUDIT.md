# AUDYT ARCHITEKTURY FRONT-END — `pr-01-ambre`

## 1. Executive Summary
Projekt ma dojrzałą strukturę dla statycznego front-endu: wielostronicowy układ HTML, modularny CSS (`base/components/layout/pages`), modularny JavaScript inicjalizowany przez wspólny bootstrap oraz komplet plików wdrożeniowych (`_headers`, `_redirects`, `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`).

Architektura jest spójna i utrzymywalna, ale w obecnej formie ma kilka punktów poprawy związanych głównie z długoterminową utrzymywalnością (duplikacja metadanych/JSON-LD między stronami, ręczne utrzymanie listy precache i ładowanie jednego dużego entrypointu JS na wszystkie podstrony).

## 2. P0 — Critical Risks
No P0 issues detected.

## 3. Strengths
- Jasny podział warstw stylów (`css/base`, `css/components`, `css/layout`, `css/pages`) i agregacja przez `css/style.css`.
- Konsekwentna semantyka dokumentów: `header`, `main`, `footer`, sekcje z nagłówkami oraz link „skip to content”.
- Dobra baza dostępności: widoczne `:focus-visible`, obsługa `prefers-reduced-motion`, atrybuty ARIA w komponentach interaktywnych oraz fallback no-JS.
- Dobre praktyki SEO: canonical, OpenGraph, Twitter Card, JSON-LD, `robots.txt`, `sitemap.xml`.
- Dojrzała warstwa deployment/PWA: polityki bezpieczeństwa w `_headers`, mapowanie tras w `_redirects`, service worker z offline fallback.
- W repo istnieją skrypty QA dla linków, SEO, a11y, HTML, CSS i JS, co wspiera kontrolę jakości.

## 4. P1 — Exactly 5 Improvements Worth Doing Next

### 1) Duplikacja metadanych i JSON-LD między stronami
**Reason:** Każdy dokument HTML zawiera rozbudowane i bardzo podobne bloki SEO/OG/JSON-LD. To zwiększa koszt zmian i ryzyko niespójności przy kolejnych aktualizacjach.

**Suggested improvement:** Wprowadzić generowanie `head` z jednego źródła (np. prosty build step/template partial), aby tytuły/opisy/canonical/OG/Schema były zarządzane centralnie.

### 2) Jeden wspólny entrypoint JS dla wszystkich podstron
**Reason:** Wszystkie strony ładują `js/script.js`, który importuje komplet modułów (nawet gdy część funkcji nie jest potrzebna na danej stronie). To zwiększa koszt parsowania i utrudnia skalowanie projektu.

**Suggested improvement:** Podzielić skrypty na per-page entrypointy (`home`, `menu`, `gallery`, `legal`) i pozostawić wspólny tylko lekki core.

### 3) Ręcznie utrzymywana lista `PRECACHE` w service worker
**Reason:** `sw.js` zawiera statyczną listę zasobów. Przy rozwoju projektu grozi to rozjazdem między realnymi assetami a cache (pominięcia po dodaniu nowych stron/zasobów).

**Suggested improvement:** Generować manifest precache automatycznie podczas builda (np. przez skrypt node), a w `sw.js` konsumować wygenerowaną listę.

### 4) Brak pełnej uruchamialności lokalnego testu a11y bez zależności runtime
**Reason:** Skrypt `qa:a11y` nie uruchomił się w aktualnym środowisku z powodu braku pakietu `playwright`, co utrudnia powtarzalne audyty dostępności.

**Suggested improvement:** Ustabilizować pipeline testowy: doprecyzować bootstrap środowiska QA (np. `npm ci` + instalacja browser binaries) i dodać krok CI blokujący merge przy błędach a11y.

### 5) Linki social zawierają adresy ogólne zamiast profili docelowych
**Reason:** W stopce występują ogólne URL-e (`https://x.com`, `https://linkedin.com`) zamiast konkretnych profili marki, co osłabia spójność produkcyjną i użyteczność.

**Suggested improvement:** Podmienić URL-e na rzeczywiste profile projektu lub tymczasowo usunąć niedokończone pozycje z UI.

## 5. P2 — Minor Refinements (optional)
- Rozważyć ograniczenie powtarzalnych fragmentów nawigacji/stopki między plikami HTML przez prosty generator statyczny.
- Dodać raport wydajności budowany cyklicznie (np. Lighthouse CI jako etap obowiązkowy, nie tylko skrypt lokalny).
- Ujednolicić politykę nazw dla elementów testowych (`data-testid`) i opisać ją w krótkim standardzie repo.

## 6. Future Enhancements — Exactly 5 Ideas
1. Wdrożenie lekkiego SSG/templatingu (np. Eleventy/Vite static) bez zmiany obecnej architektury komponentowej CSS/JS.
2. Dodanie preconnect/dns-prefetch dla zewnętrznych źródeł krytycznych (jeśli pojawią się zewnętrzne fonty/API/mapy).
3. Rozszerzenie strategii cache SW o stale-while-revalidate dla wybranych obrazów galerii.
4. Dodanie monitoringu Web Vitals (RUM) dla produkcji i kwartalnych progów jakości.
5. Wydzielenie współdzielonego słownika treści SEO (title/description/og) do jednego pliku konfiguracyjnego.

## 7. Compliance Checklist (pass / fail)
- headings structure valid — **pass**
- no broken links (excluding .min strategy) — **pass**
- no console.log — **pass** (w kodzie runtime `js/`)
- aria attributes valid — **pass** (walidacja statyczna struktury + brak oczywistych konfliktów)
- images have width/height — **pass**
- no-JS baseline usable — **pass**
- robots.txt present (if expected) — **pass**
- sitemap.xml present (if expected) — **pass**
- OpenGraph image present — **pass**
- JSON-LD valid (if present) — **pass** (strukturę wykryto; formalna walidacja zewnętrzna not detected in project)

## 8. Architecture Score (1–10)
- structural consistency: **8.5/10**
- accessibility maturity: **8/10**
- performance discipline: **7.5/10**
- SEO correctness: **8.5/10**
- maintainability: **7.5/10**

## 9. Senior Rating (1–10)
**8/10**

Projekt jest technicznie solidny i gotowy do dalszego rozwoju produkcyjnego. Największy potencjał poprawy leży w ograniczeniu duplikacji między stronami oraz w dojrzalszym podziale bundli JS i automatyzacji cache SW. Po tych zmianach architektura będzie wyraźnie bardziej skalowalna przy rosnącej liczbie podstron i funkcji.
