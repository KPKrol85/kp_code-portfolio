# AUDIT — Axiom Construction (kp-code-playground/construction/html-css-js/pr-02-axiom)

## 1) Executive summary
Projekt ma dojrzałą, modułową strukturę front-end (BEM-like naming, tokeny, podział CSS/JS na warstwy), poprawnie wdrożone podstawy SEO i PWA oraz dobrze przygotowaną warstwę formularza kontaktowego. Nie wykryto błędów klasy P0 (runtime/accessibility blockers). Wykryto kilka istotnych obszarów utrzymaniowych (P1), głównie spójność ścieżek i konfiguracji oraz doprecyzowanie polityki motion/accessibility.

**Uwaga dot. kontrastu:** contrast compliance cannot be verified without computed style analysis.

## 2) P0 — Critical risks
Brak potwierdzonych ryzyk P0 w analizowanym kodzie źródłowym.

## 3) Strengths
- Spójna architektura CSS oparta o tokeny i warstwy (`tokens/base/layout/components/sections`).
- Dobra progresywna degradacja: nawigacja mobilna ukrywana tylko dla `html.js`, więc bez JS menu pozostaje dostępne.
- Formularz kontaktowy: walidacja, `aria-invalid`, live region, honeypot, fallback natywny.
- SEO baseline: canonical + OG + Twitter + JSON-LD na stronach.
- PWA baseline: manifest, offline page, service worker z wersjonowaniem cache.
- Link-check lokalny przechodzi bez błędów (z wyłączeniem strategii minifikacji jako decyzji build/deploy).

## 4) P1 — Improvements worth doing next (exactly 5)

1. **PWA shortcut points to non-existing anchor**  
   **Reason:** W manifeście shortcut „Oferta” prowadzi do `/#oferta`, ale sekcja na stronie głównej ma id `uslugi`. To obniża jakość deep-linkingu z poziomu PWA.  
   **Suggested improvement:** Zmień `"url": "/#oferta"` na `"url": "/#uslugi"` albo dodaj aliasowy identyfikator sekcji.
   **Evidence:** `manifest.webmanifest:58-58`, `index.html:427-427`.

2. **Inconsistent service CTA phone numbers**  
   **Reason:** Część podstron usług zawierała wcześniej inny numer telefonu niż numer globalny, co osłabiało wiarygodność i spójność danych kontaktowych.  
   **Suggested improvement:** Ujednolić numery w CTA i stopkach do jednego, rzeczywistego numeru.
   **Evidence:** `services/budowa-domow.html:461-461`, `services/adaptacje-poddaszy.html:389-389`, `services/instalacje-elektryczne.html:463-463`, `index.html:1258-1258`.

3. **Reduced-motion coverage is partial**  
   **Reason:** Istnieje media query `prefers-reduced-motion`, ale wyłącza animacje tylko dla klas `.u-no-motion/.no-motion`; nie obejmuje globalnie wszystkich animowanych komponentów i przejść.  
   **Suggested improvement:** Rozszerzyć regułę reduce-motion na globalne animacje/przejścia (np. `*`, `*::before`, `*::after` albo dedykowane klasy w komponentach z animacją).
   **Evidence:** `css/base/base.css:132-140`, `js/sections/hero.js:15-20`.

4. **Service worker install has no cache-addAll fallback handling**  
   **Reason:** `cache.addAll(ASSETS)` w `install` nie ma obsługi błędu; pojedynczy brak assetu może przerwać instalację SW.  
   **Suggested improvement:** Dodać bezpieczną obsługę błędów dla pre-cache (np. `Promise.allSettled`/segmentacja listy krytycznej i opcjonalnej).
   **Evidence:** `sw.js:6-10`.

5. **High duplication across static service/legal pages**  
   **Reason:** Nagłówki, stopki i meta bloki są powielane w wielu plikach HTML, co zwiększa koszt utrzymania i ryzyko niespójności.  
   **Suggested improvement:** Wzmocnić proces generowania wspólnych fragmentów (np. utrzymanie jednego źródła layoutu/head i kompilacja do stron wynikowych).
   **Evidence:** `services/budowa-domow.html:5-47`, `services/remonty-mieszkan.html:5-47`, `legal/regulamin.html:5-47`.

## 5) P2 — Minor refinements (optional)
- Rozważyć jawne `width`/`height` dla obrazu lightboxa (placeholder w dialogu) w celu pełnej spójności polityki CLS. (`index.html:1067-1067`)
- Ujednolicić komentarze i opisy deploy (np. nazewnictwo „demo” w `_redirects`) do dokumentacyjnego tonu produkcyjnego. (`_redirects:2-4`)
- Drobne uporządkowanie aliasów utility (`u-visually-hidden` / `visually-hidden`) i dokumentacji konwencji klas dla zespołu.

## 6) Future enhancements (exactly 5)
1. Dodać automatyczny pipeline CI uruchamiający `qa:links`, `qa:a11y`, `qa:lighthouse` przy każdym PR.
2. Wprowadzić automatyczne porównanie spójności danych kontaktowych (telefon/e-mail) między wszystkimi stronami.
3. Rozszerzyć structured data o `Service`/`Offer` z centralnego generatora, by ograniczyć ręczne duplikacje.
4. Dodać testy regresji dostępności (keyboard flow + aria states) dla menu, lightboxa i formularza.
5. Dodać monitorowanie wersji cache SW i rejestrowanie metryk hit/miss w trybie debug build.

## 7) Compliance checklist
- **headings valid:** PASS
- **no broken links (excluding .min strategy):** PASS
- **no console.log:** PASS
- **aria attributes valid:** PASS (statycznie; bez runtime AT testów)
- **images have width/height:** FAIL (placeholder lightbox `<img>` bez wymiarów)
- **no-JS baseline usable:** PASS
- **sitemap present (if expected):** PASS
- **robots present:** PASS
- **OG image exists:** PASS
- **JSON-LD valid:** PASS

## 8) Architecture score (0–10)
**8.6 / 10**
- **BEM consistency:** 8.5/10
- **token usage:** 9.0/10
- **accessibility:** 8.5/10
- **performance:** 8.5/10
- **maintainability:** 8.5/10

## 9) Senior rating (1–10)
**8.7 / 10**  
Profesjonalny poziom implementacji front-end dla portfolio produkcyjnego: dobre fundamenty architektoniczne, SEO i a11y. Obszary do dopracowania dotyczą głównie spójności konfiguracji i dalszej automatyzacji jakości, a nie krytycznych błędów runtime.
