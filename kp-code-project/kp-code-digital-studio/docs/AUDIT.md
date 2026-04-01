# Audyt techniczny

## 1. Podsumowanie wykonawcze

Repozytorium stanowi zorientowaną produkcyjnie statyczną bazę front-endową z niestandardowym pipeline’em builda w Node, warstwowym CSS, modułowym JS, współdzielonymi partialami HTML, narzędziami do obsługi obrazów oraz kontrolą jakości po buildzie. Najmocniejsze obszary to organizacja kodu źródłowego, fundamenty ruchu i dostępności, obsługa obrazów i fontów oraz przejrzystość procesu budowania. Główne problemy koncentrują się wokół kompletności operacyjnej i utrzymywalności: formularz kontaktowy nigdzie nie wysyła danych, `seo/sitemap.xml` nie obejmuje wszystkich kanonicznych stron indeksowalnych, etykiety jump-linków w sekcji usług są błędnie skopiowane, obsługa robots/sitemap jest rozdzielona między źródło i wynik builda, a kilka źródłowych stron projektów zostało zapisanych w skompresowanej, jednolinijkowej formie.

## 2. P0 — Krytyczne ryzyka

Nie potwierdzono problemów klasy P0 na podstawie dowodów z repozytorium.

## 3. Mocne strony

- Warstwowy punkt wejścia CSS jest jawny i uporządkowany: `tokens`, `base`, `layout`, `components`, `sections`, `utilities`, `pages`, `projects` (`css/main.css:1-13`).
- Design tokeny są scentralizowane dla kolorów, odstępów, typografii, promieni, cieni, z-indexów i ruchu (`css/tokens.css:1-183`).
- Ładowanie fontów jest self-hosted i używa `font-display: swap` (`css/base.css:7-23`).
- Źródłowy HTML korzysta teraz ze współdzielonych partiali nagłówka i stopki składanych w czasie builda (`scripts/build-utils.mjs:21-22`, `scripts/build-utils.mjs:146-156`).
- Nawigacja mobilna obejmuje obsługę klawiatury, focus trap, `Escape`, przywracanie fokusu i synchronizację ARIA (`js/modules/navigation.js:17-124`).
- Obsługa ograniczenia ruchu jest widoczna zarówno w tokenach CSS, jak i w zachowaniu scroll/reveal wzmacnianym przez JS (`css/tokens.css:169-183`, `js/modules/scroll.js:17-30`, `js/modules/reveal.js:47-51`).
- Fallback nawigacji bez JS jest zaimplementowany przez reguły `html:not(.js)` (`css/layout.css:290-308`).
- Obrazy w przeaudytowanym HTML mają jawnie ustawione `width` i `height`; statyczny skan źródeł nie wykrył brakujących wymiarów w pełnostronicowych plikach HTML.
- Lokalna warstwa QA istnieje i waliduje wygenerowaną strukturę `dist`, integralność składania partiali oraz lokalne referencje (`package.json:13`, `scripts/qa/check-dist-structure.mjs:12-31`, `scripts/qa/check-html-assembly.mjs:7-43`, `scripts/qa/check-local-refs.mjs:20-49`).
- Bloki JSON-LD wykryte w audytowanych stronach HTML zostały poprawnie sparsowane jako prawidłowy JSON podczas audytu.

## 4. P1 — Ulepszenia, które warto zrobić jako następne

1. Formularz kontaktowy nie zapewnia rzeczywistej ścieżki wysyłki i nie jest użyteczny bez JavaScriptu. Dowód: formularz nie ma `action` ani `method` i jest oznaczony jako `novalidate` (`contact.html:138-160`), podczas gdy JS zawsze przechwytuje wysyłkę przez `event.preventDefault()` (`js/modules/forms.js:161`).
2. `seo/sitemap.xml` jest niekompletny względem kanonicznych stron indeksowalnych. Dowód: wpisy mapy witryny ograniczają się do strony głównej, portfolio, wybranych stron projektów, jednej strony case study i kontaktu (`seo/sitemap.xml:1-46`), podczas gdy dodatkowe strony wystawiają `canonical` oraz `meta name="robots" content="index, follow"`, takie jak `about.html:9-14`, `services.html:9-14`, `ecosystem.html:9-16` oraz strony szczegółowe usług, np. `services/websites.html:9-16`.
3. Jump-linki na stronie przeglądu usług używają tego samego tekstu etykiety ARIA dla wielu różnych celów, przez co odczyt czytników ekranu jest niepoprawny. Dowód: `services.html:92`, `services.html:127`, `services.html:159` i `services.html:197` wszystkie używają `aria-label="Przejdź do sekcji usługi: Strony internetowe"`.
4. Obsługa robots/sitemap jest rozdzielona między źródłowe pliki SEO i generowany przez build output w katalogu głównym, co tworzy dwa różne miejsca mapy witryny do utrzymania. Dowód: źródłowy `seo/robots.txt` wskazuje na `https://www.kp-code.pl/seo/sitemap.xml` (`seo/robots.txt:3`), podczas gdy build zapisuje główny `robots.txt` z `Sitemap: https://www.kp-code.pl/sitemap.xml` (`scripts/build-utils.mjs:182-185`).
5. Kilka źródłowych stron szczegółów projektów zostało zapisanych w skompresowanej, jednolinijkowej formie, co pogarsza czytelność i bezpieczeństwo review w nieminifikowanej warstwie źródłowej. Dowód: całe sekcje stron są zwinięte do pojedynczych linii w plikach takich jak `projects/aurora.html:43-55`, `projects/atelier-no-02.html:43-55`, `projects/axiom-construction.html:43-55` i `projects/volt-garage.html:43-55`.

## 5. P2 — Drobne dopracowania

- `console.log` nadal występuje w narzędziach i skryptach QA (`scripts/preview-dist.mjs:139-140`, `scripts/images/build-images.mjs:146-188`, `scripts/images/clean-images.mjs:26`, `scripts/qa/run-qa.mjs:16-25`).
- Filtr projektów poprawnie używa `aria-pressed`, ale jego wrapper to generyczny `div` z `aria-label`, zamiast semantyki silniej wskazującej grupowanie (`projects.html:92-97`).
- Tymczasowa strona `in-progress.html` jest celowo minimalna i oznaczona jako `noindex`, ale nie wykryto tam bloku JSON-LD. Nie jest to problem runtime i może być akceptowalne dla strony tymczasowej.
- W projekcie nie wykryto plików konfiguracyjnych zależnych od wdrożenia, takich jak `_headers`, `_redirects`, `netlify.toml` i `vercel.json`.
- Zgodności kontrastu nie da się potwierdzić bez analizy stylów obliczonych, mimo że definicje tokenów są uporządkowane i jawne.

## 6. Przyszłe usprawnienia

1. Dodaj rzeczywistą ścieżkę dostarczania formularza albo zewnętrzny handler formularza i zachowaj obecną walidację po stronie klienta jako progressive enhancement.
2. Generuj `sitemap.xml` z faktycznego inwentarza HTML podczas builda, aby usunąć ręczne rozjeżdżanie się stanu.
3. Ujednolić source-of-truth dla robots/sitemap, tak aby źródłowe pliki SEO i output builda wskazywały tę samą kanoniczną lokalizację mapy witryny.
4. Przeformatować skompresowane źródłowe strony HTML w `projects/`, aby zachowywały się jak utrzymywalne pliki developerskie zamiast gęstego wygenerowanego markupu.
5. Rozszerzyć obecną warstwę QA o statyczne kontrole metadanych/JSON-LD i dostępności, a nie tylko składanie `dist` i walidację lokalnych referencji.

## 7. Lista kontrolna zgodności

- `PASS` Nagłówki poprawne: przeaudytowane pełnostronicowe źródłowe pliki HTML zawierają dokładnie po jednym `h1`.
- `PASS` Brak uszkodzonych linków z wyłączeniem celowej strategii minifikacji: statyczny skan lokalnych referencji w źródłowym HTML nie wykrył nierozwiązanych lokalnych celów `href` / `src` / `srcset`, a `npm run qa` przeszedł podczas audytu.
- `FAIL` Brak `console.log`: `console.log` występuje w narzędziach repozytorium i skryptach QA (`scripts/preview-dist.mjs:139-140`, `scripts/images/build-images.mjs:146-188`, `scripts/images/clean-images.mjs:26`, `scripts/qa/run-qa.mjs:16-25`).
- `PASS` Atrybuty ARIA poprawne: nie wykryto statycznie nieprawidłowych wartości tokenów ARIA w przeaudytowanych wzorcach HTML i JS; użycie stanów ARIA, takich jak `aria-current`, `aria-expanded` i `aria-pressed`, zostało wdrożone z poprawnymi wartościami.
- `PASS` Obrazy mają `width`/`height`: statyczny skan pełnostronicowych źródłowych plików HTML nie wykrył brakujących wymiarów na elementach `<img>`.
- `FAIL` Bazowa wersja bez JS jest użyteczna: nawigacja ma fallback bez JS, ale formularz kontaktowy nie ma endpointu wysyłki i jest przechwytywany w JS (`contact.html:138-160`, `js/modules/forms.js:161-191`).
- `PASS` Mapa witryny istnieje, jeśli jest oczekiwana: `seo/sitemap.xml` jest obecny.
- `PASS` Robots istnieje: `seo/robots.txt` jest obecny.
- `PASS` Istnieje obraz OG: `assets/og/og-img.png` istnieje i jest referencjonowany w przeaudytowanych stronach HTML (`index.html:23`, `services.html:22`, `projects/ambre.html:20`).
- `PASS` JSON-LD poprawny: wykryte bloki JSON-LD w przeaudytowanych stronach HTML zostały poprawnie sparsowane jako prawidłowy JSON podczas audytu.

## 8. Ocena architektury (0–10)

- Spójność BEM: `8/10`
  Dowód: nazewnictwo klas jest w dużej mierze skomponentyzowane i zbliżone do BEM w plikach layoutu, komponentów, sekcji, stron i plikach specyficznych dla projektów.
- Użycie tokenów: `9/10`
  Dowód: typografia, kolor, odstępy, ruch, promienie, cienie i wartości z-index są scentralizowane w `css/tokens.css`.
- Dostępność: `7/10`
  Dowód: skip linki, style fokusu, nawigacja uwzględniająca klawiaturę i wsparcie reduced motion są solidne, ale fallback formularza kontaktowego i skopiowane etykiety ARIA nadal obniżają ocenę.
- Wydajność: `8/10`
  Dowód: obecne są lokalne fonty, jawne wymiary obrazów, lazy loading, responsywne warianty obrazów oraz dedykowany pipeline obrazów.
- Utrzymywalność: `8/10`
  Dowód: pipeline builda, składanie partiali i warstwa QA istotnie poprawiają utrzymywalność, ale rozjazdy sitemap, duplikacja robots, braki w dostarczaniu formularza i skompresowany źródłowy HTML nadal dodają zbędne tarcie.

**Łączna ocena architektury: 8.0/10**

## 9. Ocena seniorska (1–10)

**Ocena seniorska: 8/10**

Uzasadnienie techniczne: repozytorium pokazuje seniorski poziom dyscypliny w strukturyzacji front-endu, rozdzieleniu warstwy źródłowej i builda, nawigacji uwzględniającej dostępność, obsłudze obrazów oraz lekkich, własnych narzędziach. Nie otrzymuje wyższej oceny, ponieważ część detali produkcyjnych nadal zależy od ręcznego utrzymania zamiast pełnej systematyzacji, szczególnie w obszarach dostarczania formularza kontaktowego, pokrycia sitemap, spójności robots oraz kilku regresji w utrzymywalności źródeł.
