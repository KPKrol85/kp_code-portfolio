# AUDIT.md

## 1. Executive Summary

Projekt ma solidną bazę front-endową: modularny CSS i JS, spójną strukturę wielostronicową, poprawnie wdrożone kluczowe wzorce dostępności oraz działające lokalne skrypty QA. `npm run check:links` przechodzi bez błędów, a `npm run test:a11y` zwraca wynik pozytywny dla zdefiniowanych scenariuszy.

Najważniejszy problem dotyczy PWA: service worker jest rejestrowany z pliku w katalogu `pwa/`, ale bez jawnego rozszerzenia zakresu na `/`, więc nie będzie kontrolował stron w katalogu głównym. Poza tym repozytorium zawiera kilka problemów klasy P1 związanych z utrzymaniem i spójnością SEO.

## 2. Strengths

- **Spójna semantyka i hierarchia nagłówków.** Każda publiczna strona ma pojedynczy `h1`, a sekcje używają kolejnych poziomów nagłówków, np. [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L180), [contact.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/contact.html#L140), [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L141), [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L141).
- **Dostępność klawiaturowa jest widoczna w kodzie, nie tylko deklarowana.** Menu mobilne ma `aria-expanded`, pułapkę fokusu i obsługę `Escape` w [js/features/nav.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/nav.js#L20); zakładki mają poprawny model `role="tablist"` / `role="tab"` / `aria-selected` w [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L145) i [js/features/tabs.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/tabs.js#L1); lightbox zarządza fokusem i klawiaturą w [js/features/lightbox.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/lightbox.js#L47).
- **No-JS baseline i progressive enhancement są obecne.** HTML startuje z klasą `no-js` na [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L2), JS przełącza ją na `js` w [js/script.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/script.js#L1), a CSS odsłania nawigację przy braku JS w [css/modules/layout.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/layout.css#L139).
- **Dostępność wizualna i motion są przemyślane.** Skip link i globalne `:focus-visible` są zdefiniowane w [css/modules/utilities.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/utilities.css#L22), a tryb redukcji ruchu istnieje w [css/modules/motion.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/motion.css#L1).
- **Obrazy i fonty są obsłużone nowocześnie.** Fonty lokalne mają `font-display: swap` w [css/modules/tokens.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/tokens.css#L150). Obrazy w głównych szablonach mają `srcset`, nowoczesne formaty i wymiary, np. [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L147) oraz [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L167).
- **Repo ma działające automaty QA.** `scripts/check-link-integrity.mjs` sprawdza linki i sitemapę, a `scripts/a11y-axe.mjs` uruchamia scenariusze axe na lokalnym serwerze. W tej audytowanej kopii `npm run check:links` oraz `npm run test:a11y` zakończyły się powodzeniem.

## 3. P1 — Improvements Worth Doing Next



3. **`rooms.html` duplikuje ten sam markup kart pokoi między panelem „Wszystkie” i panelami szczegółowymi.** Te same treści i obrazy występują w [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L163) oraz ponownie w [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L325), [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L381) i [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L437). To podnosi koszt zmian i ryzyko rozjazdów treści.
4. **`gallery.html` zawiera powielone pozycje galerii w obrębie tych samych sekcji.** Ten sam asset `pokoj-01-1600x1067.jpg` pojawia się w [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L161) i ponownie w [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L290); analogicznie `lobby-01-1600x1067.jpg` w [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L339) i [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L468), a `okolica-01-1600x1067.jpg` w [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L873) i [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L1002). To nie psuje działania, ale niepotrzebnie zwiększa DOM i złożoność utrzymania.
5. **Lightbox usuwa intrinsic size aktywnego obrazu.** Podczas otwierania slajdu kod usuwa `width` i `height` z obrazu lightboxa w [js/features/lightbox.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/lightbox.js#L28). To odbiera przeglądarce informacje o proporcjach i może prowadzić do dodatkowego przesunięcia layoutu wewnątrz dialogu.

## 4. P2 — Minor Refinements

- **Repo nadal zawiera debugowe wyjścia do konsoli za flagą URL.** To nie jest `console.log`, ale wrapper w [js/features/logger.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/logger.js#L1) zostawia `console.debug/info/warn/error` w kodzie produkcyjnym.
- **Komentarz w `netlify/_headers` sam ostrzega przed potencjalnym problemem parsera.** W [netlify/_headers](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/netlify/_headers#L1) zapisano uwagę, że blok komentarza może sprawiać kłopoty. To raczej housekeeping niż błąd wdrożeniowy, ale warto uprościć plik.
- **Zgodność kontrastu nie może zostać jednoznacznie potwierdzona statycznie.** Tokeny i motywy są obecne, ale bez computed styles i testu runtime nie da się odpowiedzialnie potwierdzić pełnej zgodności WCAG kontrastu.

## 5. Future Enhancements

1. Przenieść service worker na scope `/` albo dodać `scope: "/"` wraz z `Service-Worker-Allowed: /`.
2. Zasilać service worker listą artefaktów wynikową z aktualnego buildu, zamiast ręcznie utrzymywanego source-listingu.
3. Ograniczyć powielony markup pokoi i galerii przez dane wejściowe, partiale buildowe albo renderowanie po stronie builda.
4. Dodać structured data także do `onas.html` i włączyć automatyczną walidację JSON-LD do QA.
5. Dodać do pipeline’u stały audyt Lighthouse/Web Vitals oraz runtime contrast checks.

## 6. Compliance Checklist

| Obszar | Status | Evidence |
|---|---|---|
| headings valid | Pass | Jedno `h1` na każdej publicznej stronie; potwierdzone skanem repo oraz np. [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L180), [contact.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/contact.html#L140), [rooms.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/rooms.html#L141) |
| no broken links excluding intentional minification strategy | Pass | `npm run check:links` zakończył się komunikatem `Link integrity check passed (11 HTML file(s) + sitemap.xml).` |
| no console.log | Pass | Brak dopasowań `console.log`; obecne są jedynie debug wrappers w [js/features/logger.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/features/logger.js#L1) |
| aria attributes valid | Pass | Kod używa spójnych wzorców `aria-expanded`, `aria-selected`, `aria-invalid`, `aria-current`; dodatkowo `npm run test:a11y` przeszedł bez naruszeń |
| images have width/height | Pass | Skrypt kontrolny nad wszystkimi root HTML nie wykazał żadnego `<img>` bez `width` i `height`; przykłady: [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L163), [contact.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/contact.html#L178), [gallery.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/gallery.html#L183) |
| no-JS baseline usable | Pass | HTML startuje z `.no-js` i CSS odsłania menu bez JS w [css/modules/layout.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/layout.css#L139); upgrade do `.js` w [js/script.js](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/js/script.js#L1) |
| sitemap present if expected | Pass | [sitemap.xml](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/sitemap.xml#L1) istnieje i jest uwzględniona w `robots.txt` |
| robots present | Pass | [robots.txt](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/robots.txt#L1) istnieje |
| OG image exists | Pass | Meta OG wskazuje na `assets/img/og/og-1200x630.jpg`, a plik jest obecny w repo; przykład w [index.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/index.html#L26) |
| JSON-LD valid | Fail | Pliki `assets/seo/*.json` są poprawnym JSON, ale coverage na stronach publicznych jest niespójny, bo [onas.html](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/onas.html#L1) nie zawiera ani `ld-json`, ani fallbackowego JSON-LD |

## 7. Architecture Score (0–10)

- **BEM consistency:** 8.5/10
  Klasy są w większości spójne z blokami i elementami (`site-header__*`, `room-card__*`, `gallery-cats__*`), choć powielony markup obniża ergonomię zmian.
- **Token usage:** 9/10
  Design tokens i fonty są zebrane centralnie w [css/modules/tokens.css](/c:/Users/KPKro/MY%20FILES/active-work/pr-01-vista/css/modules/tokens.css#L1).
- **Accessibility:** 8.5/10
  Mocna baza: skip link, focus styles, reduced motion, focus management, tabs, form messaging. Główny minus to brak runtime potwierdzenia kontrastu.
- **Performance:** 7.5/10
  Obrazy i fonty są obsłużone dobrze, ale lightbox usuwa intrinsic size, a PWA/cache strategy wymaga korekty.
- **Maintainability:** 7/10
  Modułowość jest dobra, ale powielenia w `rooms.html` i `gallery.html` oraz ręcznie utrzymywana lista cache service workera zwiększają koszt utrzymania.

**Overall architecture score:** 8.1/10

## 8. Senior Rating (1–10)

**8/10**

Technicznie to dojrzały, uporządkowany front-end statyczny z realną dbałością o semantykę, dostępność i proces QA. Ocena nie jest wyższa przez krytyczny błąd zakresu service workera oraz kilka miejsc, gdzie utrzymanie zależy od ręcznego synchronizowania powielonego markupu i konfiguracji cache.
