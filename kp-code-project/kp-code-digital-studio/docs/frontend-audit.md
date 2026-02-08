# Audyt frontendu: KP_Code Digital Studio

## 1) Snapshot aktualnego stanu projektu

- Projekt jest statycznym serwisem marketingowo-portfolio (multi-page) opartym o HTML + CSS + vanilla JS, bez frameworka UI. Widoczne są 4 strony (`index`, `projects`, `case-digital-vault`, `contact`).
- Frontend ma podział CSS na warstwy (`tokens.css`, `base.css`, `components.css`, `sections.css`) oraz jeden centralny skrypt (`js/main.js`) obsługujący nawigację mobilną, theme toggle, reveal on scroll, walidację formularza i filtrowanie projektów.
- Struktura jest semantycznie poprawna na poziomie podstawowym (header/main/footer, sekcje, artykuły), ale zawiera istotne luki produkcyjne: wiele linków prowadzi do nieistniejących podstron, a znaczna część assetów (favicon, obrazy projektów) nie istnieje w repo.
- UI oparty jest o tokeny design systemowe i komponenty typu button/card/tag/nav/footer; widać dobrą bazę do skalowania, ale też niespójności (np. niedefiniowane tokeny promienia, mieszanie języka PL/EN, inline style).

## 2) Mocne strony projektu (zalety)

1. **Dobry fundament design tokens** (kolory, spacing, typografia, transition, container) i spójne użycie zmiennych CSS.
2. **Lokalne fonty z `font-display: swap` i `unicode-range`** (lepsza wydajność i mniejszy payload fontów).
3. **Globalny `skip-link` + `:focus-visible`** – dobra baza dostępności klawiatury.
4. **Obsługa `prefers-reduced-motion`** przez tokeny czasu przejść i conditional smooth scroll.
5. **Wspieranie dark mode** (`[data-theme]` + inicjalizacja preferencji przed CSS renderem).
6. **Mobile nav z podstawowym focus trap i ESC** – dojrzałe podejście jak na vanilla JS.
7. **Header shrink z `requestAnimationFrame` i passive scroll listenerem** – sensowna optymalizacja interakcji.
8. **Reużywalne komponenty** (`card`, `button`, `tag`, `pill-grid`) i modularny podział sekcji.
9. **Metadane SEO/OG/Twitter + canonical + manifest** obecne na kluczowych stronach.
10. **Lazy loading obrazów w listingu projektów** (`loading="lazy"`) ogranicza koszt initial render.
11. **Czytelna architektura plików** (rozdzielenie SEO, skryptów obrazów, zasobów i dokumentacji).

## 3) Audyt obszarów seniorskich

### Wydajność

- **CWV (LCP/CLS/INP):**
  - LCP: potencjalnie dobre dla prostego HTML, ale ryzyko wzrostu przez brak optymalizacji hero image i brak preloading krytycznych assetów.
  - CLS: podwyższone ryzyko, ponieważ obrazy nie mają atrybutów `width`/`height`.
  - INP: raczej dobry (niskie JS), ale eventy filter/nav mogłyby być bardziej semantyczne i przewidywalne.
- **Fonty:** poprawnie self-hosted + `swap` + `unicode-range`.
- **Obrazy/media:** krytyczny problem jakościowy – większość wskazywanych assetów nie istnieje (favicon + miniatury projektów).
- **CSS/JS:** sensowna segmentacja CSS; brak bundlingu i critical CSS (akceptowalne na tym etapie), ale są miejsca do redukcji duplikacji.
- **Render-blocking:** 4 pliki CSS w `<head>` są blokujące; brak strategii critical/async CSS.

### Dostępność (a11y)

- **Semantyka:** dobra baza (landmarki, sekcje, nagłówki).
- **Hierarchia nagłówków:** na ogół poprawna.
- **Kontrast/czytelność:** stylowo spójne, ale kontrasty części tekstów `muted` wymagają pomiaru automatycznego (nie wszystkie kombinacje są pewne WCAG AA).
- **Klawiatura:** nav mobilne obsługuje ESC i tab loop, plus skip link; to duży plus.
- **Focus states:** globalnie obecne (`:focus-visible`) + dedykowane style button/footer social.
- **Skip links:** wdrożony poprawnie.

### ARIA

- **Pozytywy:** użycie `aria-current`, `aria-expanded`, `aria-controls`, `aria-hidden` w menu mobilnym.
- **Ryzyka:** filtr projektów używa `role="tablist"`/`role="tab"`, ale nie implementuje pełnego wzorca tabs (brak `aria-controls`, brak paneli `role="tabpanel"`, brak obsługi klawiszy strzałek/Home/End).
- **Nadmierna ARIA:** miejscami stosowana poprawnie, ale warto usunąć role ARIA tam, gdzie natywna semantyka wystarcza.

### Zarządzanie focusem

- **Menu mobilne:** focus trap i powrót focusa do toggla są zaimplementowane.
- **Braki:** brak wzorca zarządzania focusem dla komponentu filtrów (obecnie pseudo-tabs).

### Preferencje użytkownika

- **`prefers-reduced-motion`:** częściowo zaimplementowane (tokeny i smooth scroll).
- **Dark/light mode:** zaimplementowane i zapamiętywane w `localStorage`.
- **Zoom/scaling:** layout oparty o `clamp` i tokeny, co sprzyja skalowaniu.

### Responsive & mobile-first

- **Stabilność layoutu:** grid i breakpointy są sensownie zorganizowane.
- **Touch targets:** większość CTA osiąga bezpieczne rozmiary.
- **Layout shift:** ryzyko przez brak wymiarów obrazów.

### Jakość i spójność kodu

- **Nazewnictwo:** zbliżone do BEM, czytelne i konsekwentne.
- **Tokeny CSS:** obecne, ale częściowo niespójne (użycie niezdefiniowanych `--radius-sm/md/lg`).
- **Modularność:** dobra separacja plików CSS/JS.
- **Powtarzalność/duplikaty:** duplikowany inline skrypt inicjalizacji theme na każdej stronie; duża liczba analogicznych bloków HTML.
- **Spójność treści:** mieszanie PL/EN w UI i copy obniża profesjonalizm produktu.

## 4) Lista rekomendowanych działań — PRIORYTETY

## P0 — Krytyczne (10)

1. **Naprawa martwych linków nawigacyjnych**  
   - Uzasadnienie: użytkownik trafia na 404 z poziomu głównego menu i sekcji usług, co blokuje ścieżki konwersji.  
   - Obszar: `index.html` (header/footer, sekcje usług i projektów).  
   - Kierunek: dodać brakujące podstrony lub usunąć/ukryć linki do czasu wdrożenia.

2. **Przywrócenie brakujących assetów (favicon, obrazy projektów)**  
   - Uzasadnienie: broken images i brak favicon obniżają jakość UX, wiarygodność i sygnały SEO.  
   - Obszar: `assets/icons/*`, `assets/img/*`, odwołania w HTML i manifest.  
   - Kierunek: uzupełnić zasoby lub skorygować ścieżki do istniejących plików.

3. **Usunięcie/uzupełnienie niezdefiniowanych tokenów promieni**  
   - Uzasadnienie: `var(--radius-sm/md/lg)` bez definicji powoduje nieważne deklaracje i niespójny rendering.  
   - Obszar: `css/tokens.css`, `css/base.css`, `css/components.css`, `css/sections.css`.  
   - Kierunek: zdefiniować brakujące tokeny albo zastąpić istniejącymi.

4. **Poprawne wdrożenie wzorca tabs albo rezygnacja z ARIA tabs**  
   - Uzasadnienie: obecne `role="tablist"`/`role="tab"` nie spełnia wymogów dostępności i może mylić czytniki ekranowe.  
   - Obszar: `projects.html`, `js/main.js`.  
   - Kierunek: pełny wzorzec tabs (ARIA + keyboard) lub semantyczny zestaw przycisków bez roli tabs.

5. **Dodanie wymiarów obrazów (`width`/`height` lub `aspect-ratio`)**  
   - Uzasadnienie: ograniczenie CLS i stabilizacja layoutu na mobile/desktop.  
   - Obszar: wszystkie `<img>` w HTML.  
   - Kierunek: ustalić proporcje i zadeklarować je w HTML/CSS.

6. **Wyrównanie języka interfejsu (PL vs EN)**  
   - Uzasadnienie: miks językowy obniża spójność UX i profesjonalny odbiór marki.  
   - Obszar: `contact.html`, `projects.html`, `case-digital-vault.html`, częściowo `index.html`.  
   - Kierunek: jedna strategia językowa per serwis (PL lub i18n).

7. **Wzmocnienie komunikatów błędów formularza dla czytników**  
   - Uzasadnienie: sam kolor błędu i ogólny komunikat to za mało dla pełnej dostępności.  
   - Obszar: `contact.html`, `js/main.js`, style formularza.  
   - Kierunek: komunikaty per pole + `aria-invalid` + powiązanie z opisem błędu.

8. **Eliminacja inline stylów i standaryzacja komponentów**  
   - Uzasadnienie: inline style utrudnia utrzymanie i łamie spójność systemu CSS.  
   - Obszar: `contact.html` (`style="margin-top: ..."`).  
   - Kierunek: przenieść do klas komponentowych i tokenów.

9. **Konsolidacja inicjalizacji theme (DRY)**  
   - Uzasadnienie: powielany inline skrypt w wielu HTML zwiększa ryzyko niespójności i regresji.  
   - Obszar: wszystkie pliki HTML + `js/main.js`.  
   - Kierunek: wspólny, minimalny bootstrap script + jedno źródło prawdy.

10. **Weryfikacja i poprawa ścieżek absolutnych/relatywnych w PWA**  
   - Uzasadnienie: niespójne ścieżki (np. w manifeście) i brak plików mogą psuć instalowalność.  
   - Obszar: `seo/manifest.webmanifest`, `<link rel="icon">` w HTML.  
   - Kierunek: spójna strategia ścieżek i realna obecność assetów.

## P1 — Ważne, ale niekrytyczne (10)

1. **Critical CSS dla above-the-fold**  
   - Uzasadnienie: poprawi FCP/LCP bez zmiany UI.  
   - Obszar: `index.html` + CSS.  
   - Kierunek: wyodrębnić krytyczne style i odroczyć resztę.

2. **Optymalizacja ładowania obrazów (`srcset`, formaty next-gen)**  
   - Uzasadnienie: lepsza wydajność i jakość na różnych DPR.  
   - Obszar: sekcje projektów/hero.  
   - Kierunek: pipeline responsive images + webp/avif fallback.

3. **Ujednolicenie layoutów footerów między stronami**  
   - Uzasadnienie: spójność informacji i IA.  
   - Obszar: wszystkie `*.html`.  
   - Kierunek: jeden wzorzec stopki i jeden zestaw linków.

4. **Formalizacja konwencji namingowych komponentów**  
   - Uzasadnienie: łatwiejsze skalowanie i onboarding.  
   - Obszar: CSS i HTML klas komponentowych.  
   - Kierunek: krótki standard (BEM-light) w `docs/`.

5. **Lepsza semantyka list usług/projektów**  
   - Uzasadnienie: zwiększa czytelność DOM i potencjał SEO.  
   - Obszar: `index.html`, `projects.html`.  
   - Kierunek: uporządkowanie sekcji listujących (np. spójny article/list pattern).

6. **Odseparowanie logiki strony kontaktowej od globalnego `main.js`**  
   - Uzasadnienie: mniejszy kod wykonywany na stronach bez formularza.  
   - Obszar: `js/main.js`.  
   - Kierunek: moduły per feature/page.

7. **Rozbudowa testów manualnych a11y (keyboard-only i SR smoke test)**  
   - Uzasadnienie: szybkie wykrywanie regresji nawigacji i ARIA.  
   - Obszar: cały frontend.  
   - Kierunek: checklista QA a11y w `docs/`.

8. **Uspójnienie stanów aktywnych/hovers dla elementów interaktywnych**  
   - Uzasadnienie: przewidywalniejsze UX i lepsza heurystyka affordance.  
   - Obszar: nawigacja, filtry, tagi, przyciski.  
   - Kierunek: wspólny zestaw stanów komponentów.

9. **Doprecyzowanie treści case study (wiarygodność metryk)**  
   - Uzasadnienie: metryki typu „95+ Lighthouse” bez kontekstu osłabiają odbiór ekspercki.  
   - Obszar: `case-digital-vault.html`.  
   - Kierunek: podać kontekst pomiaru i zakres środowiska.

10. **Porządki w komentarzach i sekcjach CSS/HTML**  
   - Uzasadnienie: szybsza orientacja w kodzie i mniej długu dokumentacyjnego.  
   - Obszar: wszystkie pliki frontendowe.  
   - Kierunek: jednolity styl komentarzy sekcyjnych.

## 5) Nice to have (5)

1. **Tryb high-contrast / accessibility theme preset**  
   - Daje dodatkową warstwę dostępności ponad standard WCAG.

2. **Mikrointerakcje oparte o `prefers-reduced-motion` z progresywnym enhancement**  
   - Bardziej premium UX bez ryzyka dla użytkowników wrażliwych na ruch.

3. **Skeleton/loading placeholders dla sekcji projektów**  
   - Poprawia percepcję szybkości przy cięższych assetach.

4. **Lepsza telemetria frontendowa (np. pomiar Web Vitals w runtime)**  
   - Pozwala podejmować decyzje optymalizacyjne na danych produkcyjnych.

5. **Dokumentacja komponentów (mini style guide)**  
   - Podnosi jakość współpracy i ułatwia dalsze skalowanie UI.

## Uwagi końcowe

- Audyt był analityczny; nie wdrażano zmian funkcjonalnych ani wizualnych.
- Przed wejściem na produkcję rekomendowany jest szybki „stabilization sprint” skupiony na P0.
