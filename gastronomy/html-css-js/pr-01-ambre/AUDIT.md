# AUDIT.md

## 1. Executive Summary
Projekt ma dojrzałą, produkcyjnie sensowną architekturę statycznego front-endu: wielostronicowy HTML, podział CSS na warstwy (`base/layout/components/pages`) oraz modułowy JavaScript z bootstrapem inicjalizacji funkcji. W repozytorium są obecne elementy wdrożeniowe i operacyjne (PWA, Service Worker, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, skrypty QA), co wskazuje na świadomie zaprojektowany proces utrzymania. Główne ryzyka dotyczą obecnie utrzymywalności (duplikacja znaczników i metadanych) oraz skalowania wydajności (jeden wspólny entrypoint JS i ręczne zarządzanie precache).

## 2. P0 — Critical Risks
No P0 issues detected.

## 3. Strengths
- Spójna architektura stylów: centralny agregator `css/style.css` i podział na katalogi domenowe (`base`, `layout`, `components`, `pages`).
- Dobrze przygotowana warstwa SEO: canonical, OpenGraph, Twitter, JSON-LD i komplet plików indeksujących (`robots.txt`, `sitemap.xml`).
- Zadbana baza a11y i UX: `skip-link`, semantyczne sekcje (`header/main/footer`), widoczne stany focus oraz obsługa `prefers-reduced-motion`.
- Strategia no-JS jest zaadresowana przez klasy `.no-js` i ich kontrolę po `DOMContentLoaded`, co poprawia baseline użyteczności.
- Warstwa deployment/security jest obecna: `_headers` z CSP i politykami bezpieczeństwa oraz `_redirects` dla aliasów URL.
- Projekt posiada skrypty jakościowe (`qa:links`, `qa:seo`, `qa:a11y`, `qa:html`, `qa:nojs`) i skrypty pomocnicze dla CSP i optymalizacji obrazów.

## 4. P1 — Exactly 5 Improvements Worth Doing Next

### 1) Duplikacja metadanych SEO i bloków JSON-LD między stronami
**Reason:** Każda podstrona zawiera bardzo podobny, rozbudowany blok `<head>` i dane strukturalne (`application/ld+json`), co zwiększa koszt zmian i ryzyko niespójności przy aktualizacjach.

**Suggested improvement:** Wprowadzić generowanie `<head>` i JSON-LD z jednego źródła (np. prosty template/build step), a per-page utrzymywać wyłącznie różnice (`title`, `description`, canonical, typ strony).

### 2) Duplikacja szablonów nagłówka/stopki w wielu plikach HTML
**Reason:** Powtarzanie dużych fragmentów markupu (header/footer/nav) w `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `404.html`, `offline.html` obniża maintainability i utrudnia bezpieczne refaktoryzacje.

**Suggested improvement:** Ujednolicić layout przez partiale/template include (na etapie builda) albo narzędzie do statycznej kompozycji HTML.

### 3) Jeden wspólny entrypoint JS ładowany globalnie
**Reason:** `js/script.js` importuje komplet modułów i inicjalizuje wszystkie feature’y, nawet gdy dana podstrona ich nie używa. To zwiększa koszt parsowania/wykonania i utrudnia dalsze skalowanie kodu.

**Suggested improvement:** Podzielić bundle na entrypointy per widok (home/menu/gallery/legal), zostawiając lekki shared core.

### 4) Ręcznie utrzymywana lista `PRECACHE` w `sw.js`
**Reason:** Statyczna lista zasobów w Service Workerze wymaga manualnej synchronizacji z repozytorium. Przy rozwoju strony łatwo o niespójność cache i regresje offline.

**Suggested improvement:** Generować manifest precache automatycznie podczas builda i konsumować go w SW (z wersjonowaniem opartym o hash/revizję plików).

## 5. P2 — Minor Refinements (optional)
- W `js/modules/load-more.js` stała `DONE_STATUS_ICON` zawiera nadmiarowy znak `>` po otwarciu `<svg>`, co nie musi powodować błędu runtime, ale jest nieczystością markupu i warto to skorygować.
- Warto dopisać jawny dokument „Definition of Done” dla QA (które skrypty są krytyczne przed deployem), aby proces był jednoznaczny dla nowych contributorów.

## 6. Future Enhancements — Exactly 5 Ideas
1. Dodać per-page critical CSS (inline tylko dla above-the-fold), aby poprawić FCP/LCP bez zmiany architektury funkcjonalnej.
2. Wprowadzić automatyczny visual regression (np. screenshot diff) dla kluczowych widoków: home, menu, galeria, legal.
3. Rozszerzyć telemetrykę web-vitals (LCP/INP/CLS) z raportowaniem do endpointu analitycznego.
4. Dodać generator changelogów treści SEO (title/description/canonical), żeby łatwiej kontrolować zmiany między release’ami.
5. Ustandaryzować kontrakty komponentów JS (krótki katalog data-attributes + ARIA API), by zmniejszyć ryzyko regresji podczas refaktorów.

## 7. Compliance Checklist (pass / fail)
- headings structure valid: **pass**
- no broken links (excluding .min strategy): **pass**
- no console.log: **fail**
- aria attributes valid: **pass**
- images have width/height: **pass**
- no-JS baseline usable: **pass**
- robots.txt present (if expected): **pass**
- sitemap.xml present (if expected): **pass**
- OpenGraph image present: **pass**
- JSON-LD valid (if present): **pass**

## 8. Architecture Score (1–10)
- structural consistency: **8/10**
- accessibility maturity: **8/10**
- performance discipline: **7/10**
- SEO correctness: **9/10**
- maintainability: **7/10**

## 9. Senior Rating (1–10)
**8/10.** Projekt jest technicznie dojrzały i zawiera większość elementów wymaganych produkcyjnie dla nowoczesnego front-endu statycznego. Największe rezerwy jakościowe są w utrzymywalności (duplikacja HTML/SEO) i skalowaniu warstwy JS/SW. Po wdrożeniu wskazanych P1 architektura będzie bliżej standardu „production-hardened”.
