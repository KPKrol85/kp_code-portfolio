# AUDIT — Volt Garage

## 1. Executive summary
Audit wykonano wyłącznie na podstawie realnych plików w repozytorium. Projekt ma czytelną strukturę MPA, modularny JavaScript, sensowną warstwę PWA i widoczne działania na rzecz dostępności, SEO oraz jakości kodu. Najpoważniejsze wykryte ryzyko dotyczy konfliktu między polityką CSP w `_headers` a osadzoną mapą Google na stronie kontaktowej, co może blokować iframe w środowisku produkcyjnym. Poza tym kod jest uporządkowany, ale wymaga kilku celowanych poprawek w obszarach QA coverage, cache strategy, no-JS baseline i ograniczania ręcznej duplikacji.

## 2. P0 — Critical risks
- **CSP blokuje osadzoną mapę Google na stronie kontaktowej.** `_headers` ustawia `Content-Security-Policy` z `default-src 'self'` i nie definiuje `frame-src`, więc zewnętrzny iframe dziedziczy restrykcję same-origin. Jednocześnie `pages/contact.html` osadza mapę z `https://www.google.com/maps?...&output=embed`, co oznacza realne ryzyko zablokowania mapy po wdrożeniu. Evidence: `_headers:6`, `pages/contact.html:254-260`.

## 3. Strengths
- **Architektura front-end jest modularna i spójna.** Główny bootstrap agreguje moduły `ui`, `features`, `services` i `core`, a inicjalizacja jest warunkowa zależnie od obecności danego widoku. Evidence: `js/main.js:1-25`, `js/main.js:167-207`.
- **Repo ma realną warstwę PWA, a nie tylko deklaracje marketingowe.** Obecne są `site.webmanifest`, rejestracja service workera, prompt instalacji oraz obsługa aktualizacji. Evidence: `site.webmanifest:1-75`, `js/main.js:200-205`.
- **Dostępność jest widoczna w implementacji.** Strony mają skip link, formularze sterują `aria-invalid` i `aria-describedby`, nawigacja ustawia `aria-current` i obsługuje klawiaturę, a modal projektu ma focus trap. Evidence: `index.html:118`, `css/partials/base.css:62-80`, `js/main.js:27-155`, `js/ui/header.js:12-50`, `js/ui/header.js:75-170`, `js/ui/project-modal.js:23-43`.
- **Fundamenty SEO są wdrożone konsekwentnie.** Występują canonicale, Open Graph, Twitter cards, `robots.txt`, `sitemap.xml` i JSON-LD. Evidence: `index.html:15-40`, `index.html:88-110`, `robots.txt:1-4`, `sitemap.xml:1-63`.
- **Wydajność obrazów i fontów jest traktowana poważnie.** Produkty używają `<picture>` z AVIF/WebP, lazy loading i atrybutów wymiarów, a fonty lokalne mają `font-display: swap`. Evidence: `js/features/products.js:19-29`, `js/features/products.js:42-47`, `js/features/cart.js:83-99`, `css/partials/themes.css:2-42`.
- **Repo zawiera użyteczne skrypty jakościowe, a nie tylko pojedynczy build.** Są osobne komendy dla HTML, CSS, JS, linków, JSON-LD i Lighthouse smoke. Evidence: `package.json:19-40`.

## 4. P1 — Improvements worth doing next
- **`npm run qa` nie obejmuje pełnego zestawu krytycznych stron i walidacji schema.** Główna komenda QA uruchamia HTML, linki, JS i CSS, ale nie zawiera `validate:jsonld`, a sama walidacja HTML pomija `404.html` i `offline.html`. Evidence: `package.json:30-32`, `package.json:37-38`.
- **Strategia cache dla CSS i JS jest agresywna względem niezhashowanych plików.** `_headers` ustawia `Cache-Control: public, max-age=31536000, immutable` dla `/css/*` i `/js/*`, podczas gdy HTML odwołuje się bezpośrednio do `/css/main.css` i `/js/main.js`, bez wersjonowania nazw plików. To zwiększa ryzyko serwowania przestarzałych assetów po wdrożeniu. Evidence: `_headers:14-18`, `index.html:86`, `index.html:590`, `404.html:54`, `offline.html:54`.
- **Baseline bez JavaScript jest ograniczony dla kluczowych widoków katalogowych.** W sekcjach produktów użytkownik bez JS widzi tylko komunikat fallback zamiast realnej listy katalogowej lub statycznych rekomendacji. Evidence: `index.html:328-333`, `pages/shop.html:279-281`, `pages/product.html:217-227`, `js/features/products.js:129-160`, `js/features/products.js:225-301`.
- **CSS entry opiera się na łańcuchu `@import`.** `css/main.css` składa arkusze z czterech importów runtime, co jest prostsze organizacyjnie, ale mniej korzystne dla render path niż pojedynczy zbundlowany arkusz źródłowy. Evidence: `css/main.css:2-5`.
- **Współdzielony modal projektu jest ręcznie kopiowany przez wiele stron.** Ta sama struktura `project-modal` występuje w `index.html`, `404.html`, `offline.html` i wszystkich głównych podstronach, co podnosi koszt utrzymania i ryzyko niespójnych zmian treści. Evidence: `index.html:558-579`, `404.html:364-385`, `offline.html:363-384`, `pages/shop.html:434-455`, `pages/contact.html:504-525`.

## 5. P2 — Minor refinements
- **JSON-LD `SearchAction` wskazuje ścieżkę `/search`, której nie wykryto jako rzeczywistego widoku repo.** Nie powoduje to awarii runtime, ale warto doprecyzować zgodność schema z realnym interfejsem. Evidence: `pages/contact.html:82-93`, `404.html:72-82`, `offline.html:72-82`.
- **W repo występują `console.log`, ale tylko w skryptach narzędziowych i walidacyjnych.** To nie jest problem runtime aplikacji, jednak w ścisłej ocenie porządku repo warto rozróżnić logi narzędzi od produkcyjnego front-endu. Evidence: `scripts/validate-jsonld.js:190`, `scripts/validate-internal-links.js:152`, `scripts/qa-smoke-lighthouse.js:169-179`, `tools/image-optimizer/optimize-images.mjs:75`, `tools/image-optimizer/optimize-images.mjs:274-283`.
- **Logo w `404.html` nie ma jawnych atrybutów `width` i `height`, podczas gdy większość głównych stron je ustawia.** To drobna niespójność mogąca zwiększać ryzyko CLS na tej jednej stronie. Evidence: `404.html:90-92`, porównawczo `index.html:120-128`.

## 6. Future enhancements
- Dodać CI uruchamiające `npm run qa`, `npm run validate:jsonld` i opcjonalnie `npm run qa:smoke:enforce` przy każdym PR.
- Wersjonować pliki CSS i JS albo złagodzić długie cache `immutable` dla niehashowanych assetów.
- Rozszerzyć statyczny fallback katalogu, aby `shop`, `featured` i `related` były bardziej użyteczne bez JavaScript.
- Ograniczyć ręczną duplikację współdzielonych bloków HTML przez prosty proces składania partiali lub templating build step.
- Zaostrzyć CSP tak, by jawnie dopuszczać tylko potrzebne zewnętrzne źródła, zamiast polegać na szerokich wyjątkach lub fallbackach.

## 7. Compliance checklist
- **Headings valid:** PASS. Przejrzane strony utrzymują jednego `h1` na widok oraz dalsze sekcje `h2`/`h3` zgodne z układem treści. Evidence: `index.html:249-333`, `pages/contact.html:234-274`, `pages/regulamin.html:234-327`.
- **No broken links excluding intentional minification strategy:** PASS. `node scripts/validate-internal-links.js` zakończył się wynikiem: `Internal link validation passed for 14 HTML files.` Evidence: `package.json:38`, `scripts/validate-internal-links.js:152`.
- **No console.log:** FAIL. `console.log` nie występuje w głównym front-endzie, ale jest obecny w skryptach repo, więc przy ścisłej ocenie repo warunek nie jest spełniony. Evidence: `scripts/validate-jsonld.js:190`, `scripts/validate-internal-links.js:152`, `scripts/qa-smoke-lighthouse.js:169-179`, `tools/image-optimizer/optimize-images.mjs:75`, `tools/image-optimizer/optimize-images.mjs:274-283`.
- **Aria attributes valid:** PASS statycznie. Kod pokazuje poprawne użycie `aria-current`, `aria-expanded`, `aria-modal`, `aria-describedby` i `aria-invalid` w kluczowych interakcjach. Evidence: `js/ui/header.js:33-49`, `js/ui/header.js:75-170`, `js/main.js:77-105`, `index.html:561-579`.
- **Images have width/height:** FAIL. Nie wszystkie obrazy w repo mają jawne atrybuty wymiarów, co widać na przykładzie logo w `404.html`. Evidence: `404.html:90-92`.
- **No-JS baseline usable:** FAIL. Główne widoki produktowe pokazują tylko komunikaty fallback, bez pełnego katalogu lub statycznych odpowiedników treści. Evidence: `index.html:328-333`, `pages/shop.html:279-281`, `pages/product.html:217-227`.
- **Sitemap present if expected:** PASS. `sitemap.xml` istnieje i zawiera główne adresy URL projektu. Evidence: `sitemap.xml:1-63`.
- **Robots present:** PASS. `robots.txt` jest obecny i wskazuje sitemapę. Evidence: `robots.txt:1-4`.
- **OG image exists:** PASS. Repo zawiera plik wskazywany w meta OG/Twitter. Evidence: `index.html:25-40`, `assets/images/og/og-1200x630.jpg`.
- **JSON-LD valid:** PASS. `node scripts/validate-jsonld.js` zakończył się powodzeniem dla 14 plików HTML. Evidence: `package.json:37`, `scripts/validate-jsonld.js:190`.

## 8. Architecture score (0–10)
**Overall: 7.9 / 10**

- **BEM consistency: 8.2/10**  
  Nazewnictwo komponentów i stanów jest w większości spójne (`project-modal__panel`, `card--skeleton`, `page-hero--contact`), choć duplikacja markupu obniża ergonomię zmian. Evidence: `css/partials/components.css:950-1031`, `js/features/products.js:91-99`.
- **Token usage: 8.9/10**  
  System tokenów obejmuje fonty, skale typografii, spacing, radius i shadow, a motywy są oparte o custom properties. Evidence: `css/partials/themes.css:45-80`.
- **Accessibility: 8.1/10**  
  Silne podstawy: skip link, focus-visible, keyboard nav, focus trap, aria feedback w formularzach, reduced motion. Punktację obniża częściowy baseline bez JS dla katalogu. Evidence: `css/partials/base.css:62-126`, `js/ui/header.js:75-170`, `js/ui/project-modal.js:23-43`, `js/main.js:27-155`.
- **Performance: 7.6/10**  
  Dobre praktyki obrazów i fontów są obecne, ale `@import` w CSS i długie cache dla niezhashowanych assetów tworzą pole do poprawy. Evidence: `js/features/products.js:19-29`, `css/partials/themes.css:2-42`, `css/main.css:2-5`, `_headers:14-18`.
- **Maintainability: 6.8/10**  
  Struktura modułów jest czytelna, lecz ręczna duplikacja współdzielonych bloków i niepełne pokrycie głównego QA utrudniają bezpieczne skalowanie zmian. Evidence: `package.json:30-38`, `index.html:558-579`, `pages/contact.html:504-525`.

## 9. Senior rating (1–10)
**7.8 / 10**

Technicznie to repo jest blisko solidnego poziomu produkcyjnego: ma realny podział odpowiedzialności, QA, PWA i sensowną dbałość o dostępność. Ocena spada przez jeden potwierdzony problem wdrożeniowy P0 oraz kilka wyraźnych luk jakościowych w no-JS resilience, cache strategy i utrzymywalności współdzielonego HTML.
