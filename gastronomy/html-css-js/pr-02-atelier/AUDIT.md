# Front-End Audit — Atelier No.02

## 1. Executive summary
Projekt jest dojrzały architektonicznie: modularny CSS, tokeny, spójne BEM, poprawna separacja warstw (`base/layout/components/pages/utilities`) oraz solidna implementacja dostępności i SEO. Największe ryzyko produkcyjne dotyczy jednego krytycznego CTA z nieprodukcyjnym adresem mapy (`maps.example.com`) na stronie „O nas”, co bezpośrednio obniża skuteczność ścieżki kontaktowej.

## 2. P0 — Critical risks

### P0.1 — Nieprodukcyjny link lokalizacji w kluczowym CTA
- **Impact:** Użytkownik nie przechodzi do faktycznej mapy lokalu; kluczowa ścieżka „Pokaż na mapie” może kończyć się błędem lub stroną testową, co wpływa na konwersję i wiarygodność produktu.
- **Evidence:** `about.html` zawiera `href="https://maps.example.com"` w przycisku lokalizacji.
- **Fix:** Zastąpić URL realnym adresem (np. Google Maps / OpenStreetMap z docelową lokalizacją) i zweryfikować odpowiedź HTTP 200 oraz poprawność otwarcia na mobile.
- **Effort:** **S**

## 3. Strengths
- Architektura CSS jest czytelna i skalowalna (podział na warstwy + centralne tokeny).
- BEM jest stosowany konsekwentnie w komponentach i sekcjach.
- Dostępność: skip link, `aria-*` w nawigacji, focus states, `prefers-reduced-motion`, focus trap w menu mobilnym.
- Performance: preloading fontów i hero, nowoczesne formaty obrazów, responsive `picture/srcset/sizes`.
- SEO: canonical + OG + robots + JSON-LD + sitemap + robots.txt na całym serwisie.
- Deploy hygiene: `_headers`, `_redirects`, manifest i SW są obecne.

## 4. P1 — 5 improvements worth doing next

### P1.1 — Ujednolicić canonical na stronie 404 do pełnego URL
- **Reason:** `404.html` ma canonical względny (`/`), co jest mniej jednoznaczne dla crawlerów i raportowania SEO.
- **Suggested improvement:** Ustawić absolutny canonical URL do strony głównej lub rozważyć usunięcie canonical dla 404 przy zachowaniu `noindex`.

### P1.2 — Ograniczyć diagnostyczne logowanie SW do kanału debug-build
- **Reason:** W kodzie pozostają `console.log`/`console.warn` (choć ograniczone do localhost); warto utrzymać czystą politykę produkcyjną.
- **Suggested improvement:** Przenieść logowanie do warunku środowiskowego build-time (np. flaga debug) albo usunąć całkowicie.

### P1.3 — Dodać automatyczną walidację linków zewnętrznych w CI
- **Reason:** Obecny problem z `maps.example.com` pokazuje ryzyko regresji przy ręcznych zmianach treści.
- **Suggested improvement:** Dodać prosty job walidujący statusy HTTP dla linków zewnętrznych i kompletność anchorów wewnętrznych.

### P1.4 — Rozdzielić artefakty źródłowe i produkcyjne obrazów poza drzewo deploy
- **Reason:** Równoległe katalogi (`assets/img-src`, `assets/img`, `assets/img-optimized`) zwiększają ryzyko przypadkowego publikowania zbędnych zasobów.
- **Suggested improvement:** Przenieść źródła robocze poza root deploy lub wykluczyć je regułami publikacji.

### P1.5 — Doprecyzować politykę prywatności pod konkretne integracje
- **Reason:** Strony prawne są poprawnie obecne, ale część treści ma charakter demonstracyjny; warto związać zapisy z realnym stackiem analitycznym/cookies.
- **Suggested improvement:** Uzupełnić dokumenty o rzeczywiste narzędzia, okresy retencji i podstawy prawne zgodne z docelową konfiguracją.

## 5. Future enhancements — 5 realistic ideas
1. Dodać automatyczne testy dostępności (axe-core) dla głównych podstron.
2. Wdrożyć budowanie krytycznego CSS per-page dla dalszego skrócenia czasu renderu.
3. Rozszerzyć JSON-LD o `BreadcrumbList` na wszystkich podstronach contentowych.
4. Dodać monitoring Core Web Vitals (np. `web-vitals` + endpoint telemetryczny).
5. Dodać automatyczny smoke-test offline/PWA (instalacja SW, fallback, cache update).

## 6. Compliance checklist (pass / fail)
- **headings valid:** **PASS**
- **no broken links:** **FAIL** (wykryty link `https://maps.example.com` w CTA lokalizacji)
- **no console.log:** **FAIL** (logi diagnostyczne w inline rejestracji SW)
- **aria attributes valid:** **PASS**
- **images have width/height:** **PASS**
- **no-JS baseline usable:** **PASS**
- **sitemap present (if expected):** **PASS**
- **robots present:** **PASS**
- **OG image exists:** **PASS**
- **JSON-LD valid:** **PASS** (nie wykryto konfliktów/duplikacji krytycznych)

## 7. Architecture Score (0–10)
- **BEM consistency:** 9.5/10
- **token usage:** 9.0/10
- **accessibility:** 8.8/10
- **performance:** 8.6/10
- **maintainability:** 8.7/10

**Final Architecture Score:** **8.9/10**

## 8. Senior rating (1–10)
**8.8/10** — Projekt ma poziom portfolio produkcyjnego: dobra struktura, solidna jakość frontendowa i pełen zestaw elementów deploy/SEO/a11y. Ocena obniżona głównie przez pojedynczy krytyczny link CTA oraz drobne kwestie higieny operacyjnej.
