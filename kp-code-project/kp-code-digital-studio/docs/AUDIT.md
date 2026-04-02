# AUDIT

## 1. Executive summary

Repozytorium prezentuje uporządkowaną architekturę statycznego front-endu: wielostronicowe HTML, warstwowy CSS, modularny JS, build do `dist/` oraz QA dla outputu. Najpoważniejsze ryzyko nie dotyczy front-endowej struktury, tylko bezpieczeństwa wdrożenia formularza: w repozytorium wykryto jawne dane SMTP. Poza tym kod jest technicznie spójny, QA przechodzi poprawnie, a główne obszary do poprawy dotyczą głównie sprzężeń build/deploy, spójności SEO/PWA i utrzymania.

## 2. P0 — Critical risks

- Jawne dane SMTP zostały zapisane w repozytorium w pliku konfiguracyjnym formularza. To jest realne ryzyko bezpieczeństwa i operacyjne, bo hasło jest przechowywane w plaintext w śledzonym pliku: `contact-mail.config.php:5-15`.

## 3. Strengths

- Architektura CSS jest czytelnie rozdzielona na warstwy systemowe i pliki mają jednoznaczne przeznaczenie (`css/tokens.css:1-5`, `css/base.css:1-5`, `css/layout.css`, `css/components.css`, `css/pages.css`, `css/utilities.css:1-5`).
- Build składa współdzielone partiale, ustawia `aria-current` dla aktywnej nawigacji i przepisuje assety do wersji produkcyjnych (`scripts/build-utils.mjs:126-160`).
- QA dla `dist/` jest zautomatyzowane i w aktualnym stanie przechodzi poprawnie: `PASS dist-structure`, `PASS html-assembly`, `PASS local-refs` (`scripts/qa/run-qa.mjs:6-21`; lokalnie wykonane `npm run qa`).
- Dostępność ma realne implementacje, a nie wyłącznie deklaracje: skip link (`index.html:66`), fokus globalny (`css/base.css:129-131`), reduced motion (`css/tokens.css:171-189`, `css/utilities.css:112-120`) oraz focus management w mobilnej nawigacji (`src/partials/header.html:49-58`, `js/modules/navigation.js:22-107`).
- Warstwa performance ma sensowne podstawy: self-hosted font z `font-display: swap` (`css/base.css:7-28`), obrazy responsywne z wymiarami i lazy loadingiem (`about.html:121-148`, `index.html:304-310`), a build tworzy minifikowane pliki do `dist/` (`scripts/build-utils.mjs:36-64`).

## 4. P1 — Improvements worth doing next

1. Source manifest nie jest samowystarczalny i zależy od poprawiania ścieżek dopiero podczas builda. W `assets/icons/site.webmanifest` ikony wskazują na nieistniejące w root source pliki `/web-app-manifest-192x192.png` i `/web-app-manifest-512x512.png`, a dopiero build zamienia je na `/assets/icons/...` (`assets/icons/site.webmanifest:10-22`, `scripts/build-utils.mjs:324-340`).
2. Source service worker cache'uje wyłącznie buildowe assety `/css/main.min.css` i `/js/main.min.js`, podczas gdy źródłowe HTML odwołują się do `./css/main.css` i `./js/main.js`. Przy serwowaniu source tree bez kroku build offline shell nie zainstaluje się poprawnie (`service-worker.js:1-9`, `index.html:61`, `contact.html:411`, `scripts/build-utils.mjs:92-98`).
3. Bootstrap motywu jest skopiowany inline przez cały zestaw stron zamiast być utrzymywany z jednego źródła. Ten sam blok występuje m.in. w `index.html:42-59`, `about.html:43-60` i `contact.html:43-60`, co podnosi koszt zmian i ryzyko dryfu.
4. `robots.txt` wskazuje na `https://www.kp-code.pl/sitemap.xml`, ale `sitemap.xml` nie jest wykryty w source root repozytorium; pojawia się dopiero podczas builda do `dist/`. To jest poprawne dla pipeline'u buildowego, ale osłabia samowystarczalność source tree i statyczną weryfikację bez builda (`robots.txt:1-3`, `scripts/build-utils.mjs:308-317`).
5. Structured data nie jest wdrożone konsekwentnie na wszystkich publicznych stronach repozytorium. JSON-LD jest obecny np. na `index.html:903` i `contact.html:307`, ale nie został wykryty w `404.html`, `offline.html`, `in-progress.html` i `thank-you.html`.

## 5. P2 — Minor refinements

- Open Graph image alt jest wdrożony niespójnie: występuje np. w `projects.html:29` i `cookies.html:31-44`, ale nie został wykryty na wielu innych stronach, w tym na `index.html`, `about.html` i `contact.html`.
- W `index.html` znajduje się osierocony tekstowy token `d` wewnątrz SVG, co jest błędem jakości markupu, choć nie wygląda na krytyczny runtime blocker (`index.html:126-129`).
- W repozytorium tooling używa `console.log`, co nie wpływa na produkcyjny front-end, ale obniża czystość checklisty jakości (`scripts/qa/run-qa.mjs:11-21`, `scripts/preview-dist.mjs:139-141`).

## 6. Future enhancements

1. Dodać statyczny check spójności `canonical`, `og:url`, `robots`, obecności `og:image:alt` i coverage JSON-LD w pipeline QA.
2. Zastąpić duplikowany inline bootstrap motywu jednym współdzielonym źródłem generowanym podczas assembly HTML.
3. Rozszerzyć QA o walidację PWA, w tym source manifest paths i service worker shell assets.
4. Dodać repozytoryjny mechanizm konfiguracji sekretów poza śledzonym plikiem source, np. przez env/config injection podczas wdrożenia.
5. Utrzymać source `sitemap.xml` lub dodać jawny etap dokumentacyjny, że mapa strony istnieje wyłącznie jako artefakt builda.

## 7. Compliance checklist

- `PASS` headings valid: audytowane strony mają pojedyncze `h1`, a struktura nagłówków jest obecna na stronach głównych, usługowych, projektowych i prawnych.
- `PASS` no broken links excluding intentional minification strategy: lokalnie wykonane `npm run qa` zakończyło się `PASS local-refs`.
- `FAIL` no console.log: `console.log` jest używany w tooling repozytorium (`scripts/qa/run-qa.mjs:11-21`, `scripts/preview-dist.mjs:139-141`).
- `PASS` aria attributes valid: aktywna nawigacja i toggle menu używają poprawnych wartości `aria-current`, `aria-expanded`, `aria-controls` i `aria-hidden` (`src/partials/header.html:15-58`, `js/modules/navigation.js:22-30`).
- `PASS` images have width/height: w statycznym przeglądzie HTML nie wykryto `<img>` bez jawnych `width` i `height`.
- `PASS` no-JS baseline usable: treść jest serwowana w HTML, skip link działa bez JS, a formularz ma klasyczny fallback POST (`contact.html:186-193`).
- `FAIL` sitemap present if expected: `robots.txt` wskazuje sitemapę, ale `sitemap.xml` nie jest wykryty w root source; jest generowany dopiero do `dist/` (`robots.txt:1-3`, `scripts/build-utils.mjs:308-317`).
- `PASS` robots present: `robots.txt` istnieje w katalogu głównym repozytorium.
- `PASS` OG image exists: plik `assets/og/og-img.png` istnieje w repozytorium i jest używany w metadanych OG.
- `FAIL` JSON-LD valid: bloki JSON-LD są składniowo poprawne tam, gdzie występują, ale structured data nie została wykryta na części publicznych stron pomocniczych, więc zgodność projektowa jest niepełna.

## 8. Architecture score (0–10)

- BEM consistency: `8/10`
  Uzasadnienie: nazewnictwo klas jest w większości konsekwentne (`block__element--modifier`), szczególnie w layout/components/pages, bez widocznego chaosu selektorów.
- Token usage: `9/10`
  Uzasadnienie: tokeny kolorów, typografii, spacingu, motion i z-index są wyraźnie scentralizowane w `css/tokens.css`.
- Accessibility: `8/10`
  Uzasadnienie: są skip linki, focus styles, reduced motion, focus management i progressive enhancement formularza; brakuje pełnej spójności structured metadata i nie da się statycznie potwierdzić kontrastu.
- Performance: `7/10`
  Uzasadnienie: obrazy i fonty są obsłużone sensownie, ale source PWA/service worker zależy od build-only assetów.
- Maintainability: `7/10`
  Uzasadnienie: warstwy są dobrze rozdzielone, lecz duplikacja inline bootstrapu motywu i build-time fixups dla manifestu/PWA obniżają jakość utrzymania.

**Architecture score: 7.8/10**

## 9. Senior rating (1–10)

**8/10**

Technicznie to jest dojrzały, uporządkowany front-end z realnym pipeline build/QA i sensowną bazą a11y/performance. Ocena spada głównie przez jawny sekret w repozytorium oraz kilka miejsc, gdzie source tree nie jest w pełni samowystarczalny bez kroku build.
