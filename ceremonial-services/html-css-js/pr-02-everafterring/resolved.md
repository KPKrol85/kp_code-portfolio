# Rejestr rozwiązanych problemów po audytach

Ten plik służy do dokumentowania problemów wykrytych w audytach po ich faktycznym naprawieniu w kodzie lub dokumentacji. Nie oznaczaj pozycji jako rozwiązanej, dopóki zmiana nie została wdrożona i zweryfikowana.

----------

## 2026-04-30 — Formularz kontaktowy bez rzeczywistej ścieżki wysyłki

### Data

2026-04-30

### Tytuł problemu

Formularz kontaktowy bez rzeczywistej ścieżki wysyłki.

### Status

Rozwiązane.

### Źródło

`daily-AUDIT.md`, sekcja P1.

### Rozwiązanie

Formularz kontaktowy został przygotowany jako statyczny formularz Netlify Forms z natywną metodą `POST`, akcją `/dziekujemy.html`, ukrytym polem `form-name` oraz honeypotem `bot-field`. JavaScript zachowuje walidację po stronie klienta, ale blokuje wysyłkę tylko przy niepoprawnych danych i nie pokazuje już fałszywego komunikatu sukcesu przed realnym wysłaniem.

### Zmienione pliki

- `kontakt.html`
- `js/modules/form.js`
- `dziekujemy.html`
- `scripts/build.mjs`
- `daily-AUDIT.md`
- `resolved.md`
- `README.md`

### Notatki

Poprawne zgłoszenia używają natywnej ścieżki POST przygotowanej pod Netlify Forms. Nie dodano AJAX, własnego backendu, zewnętrznego providera ani ręcznych zmian w `dist/`.

----------

## 2026-04-30 — Brak podlinkowanej informacji o przetwarzaniu danych

### Data

2026-04-30

### Tytuł problemu

Brak podlinkowanej informacji o przetwarzaniu danych.

### Status

Rozwiązane.

### Źródło

`daily-AUDIT.md`, sekcja P1.

### Rozwiązanie

Dodano źródłową stronę `polityka-prywatnosci.html` z treścią polityki prywatności dla demonstracyjnego projektu EverAfter Ring. Komunikat przy formularzu kontaktowym linkuje teraz do tej strony, a strona została uwzględniona w buildzie, sitemapie i stopce.

### Zmienione pliki

- `polityka-prywatnosci.html`
- `kontakt.html`
- `partials/footer.html`
- `scripts/build.mjs`
- `sitemap.xml`
- `daily-AUDIT.md`
- `resolved.md`
- `README.md`

### Notatki

Nie dodano `regulamin.html`, `cookies.html`, bannera cookies, analityki, backendu ani ręcznych zmian w `dist/`. Strona potwierdzenia formularza `dziekujemy.html` pozostaje poza sitemapą.

----------

## 2026-05-02 — Final audit P1: portfolio image metadata and active navigation build logic

### Data

2026-05-02

### Tytuł problemu

Final audit P1.1 invalid non-ASCII subscript zero characters in `realizacje.html` portfolio image markup oraz P1.2 stale build navigation logic for the `uslugi.html` active navigation state.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja P1.

### Rozwiązanie

W `realizacje.html` zastąpiono niepoprawne znaki `₀` zwykłymi cyframi ASCII w atrybutach `srcset`, `sizes`, `width` i `height` pięciu kart portfolio. Ścieżki JPG fallbacków wskazują teraz na istniejące pliki `400`, `800` i `1200` w `assets/img/portfolio-img/`.

W `scripts/build.mjs` usunięto przestarzałą gałąź dla dawnego dropdownu usług. Build używa teraz płaskiego linku `.nav__link` jako źródła prawdy i osadza `aria-current="page"` również dla `uslugi.html`.

### Zmienione pliki

- `realizacje.html`
- `scripts/build.mjs`
- `resolved.md`

### Notatki

Zweryfikowano brak znaków `₀` w poprawionym markupie, brak brakujących lokalnych referencji obrazów w `realizacje.html`, poprawne wykonanie `npm run build` oraz obecność `aria-current="page"` na linku `Usługi` w wygenerowanym `dist/uslugi.html`.

----------

## 2026-05-02 — Audit P2.2: duplicated `--font-size-xxl` token

### Data

2026-05-02

### Tytuł problemu

P2.2 duplicate token definition for `--font-size-xxl` in `css/tokens.css`.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja P2.

### Rozwiązanie

Zostawiono `--font-size-xxl` jako skalę `2rem`, a większą dotychczas nadpisującą wartość `2.8rem` przeniesiono do nowego tokenu `--font-size-3xl`. Globalny styl `h1` w `css/base.css` używa teraz `--font-size-3xl`, aby zachować dotychczasową wizualną skalę nagłówków pierwszego poziomu.

### Zmienione pliki

- `css/tokens.css`
- `css/base.css`
- `resolved.md`

### Notatki

Zweryfikowano, że `--font-size-xxl` występuje w `css/tokens.css` tylko raz, `--font-size-3xl` jest zdefiniowany raz, a jedyna źródłowa referencja do większej skali została przeniesiona na nowy token.

----------

## 2026-05-02 — Audit P2.3: undefined `--color-text-primary` token

### Data

2026-05-02

### Tytuł problemu

P2.3 undefined color token reference in `css/components/cards.css`.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja P2.

### Rozwiązanie

W `css/components/cards.css` zastąpiono nieistniejący token `--color-text-primary` istniejącym tokenem `--color-text` w stylu elementów `.card__process-list li`.

### Zmienione pliki

- `css/components/cards.css`
- `resolved.md`

### Notatki

Zweryfikowano, że `--color-text-primary` nie występuje już w nieminifikowanych źródłach CSS, a użyty token `--color-text` jest zdefiniowany w `css/tokens.css` dla jasnego i ciemnego motywu.

----------

## 2026-05-02 — Audit P2.1: stale dropdown navigation code

### Data

2026-05-02

### Tytuł problemu

P2.1 stale dropdown navigation code remains after the header no longer exposes a dropdown.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja P2.

### Rozwiązanie

Usunięto martwe selektory dropdownu z `js/config.js`, obsługę dawnych dropdownów z `js/modules/nav.js` oraz specjalną logikę `.nav__dropdown-link` z `js/modules/partials.js`. W `css/components/nav.css` usunięto nieużywane selektory dropdown-only z bloku `prefers-reduced-motion`. README opisuje teraz aktualną płaską nawigację z menu mobilnym zamiast dropdownu usług.

### Zmienione pliki

- `js/config.js`
- `js/modules/nav.js`
- `js/modules/partials.js`
- `css/components/nav.css`
- `README.md`
- `resolved.md`

### Notatki

Zweryfikowano, że w aktywnych źródłach nie pozostały referencje do `data-dropdown-*`, `.nav__dropdown`, `.dropdown__icon` ani `.nav__dropdown-link`. Zachowano istniejące zachowanie menu mobilnego: toggle, `aria-expanded`, zamykanie linkiem i klawiszem `Escape`, focus trap oraz reset responsywny.

----------

## 2026-05-02 — Extra quality improvement: card image aspect-ratio fallback

### Data

2026-05-02

### Tytuł problemu

Opcjonalne usprawnienie stabilności layoutu dla reusable card image containers.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja Extra quality improvements.

### Rozwiązanie

Dodano `aspect-ratio: 4 / 3` do `.card__image` w `css/components/cards.css`, zgodnie z proporcją istniejących obrazów portfolio `1200x900`. Dodano też tło `--color-surface-alt`, aby kontener miał spójny placeholder przed załadowaniem obrazu.

### Zmienione pliki

- `css/components/cards.css`
- `resolved.md`

### Notatki

Nie zmieniano HTML, ścieżek obrazów, `picture/source/img`, JavaScriptu ani `dist/`. Obrazy nadal zachowują naturalne proporcje przez istniejące `width: 100%` i `height: auto`.

----------

## 2026-05-02 — Extra quality improvement: build-time active navigation assertion

### Data

2026-05-02

### Tytuł problemu

Opcjonalne zabezpieczenie builda przed cichym rozjazdem `aria-current` w primary navigation.

### Status

Rozwiązane.

### Źródło

`AUDIT.md`, sekcja Extra quality improvements.

### Rozwiązanie

Dodano w `scripts/build.mjs` jawny zestaw stron primary navigation oraz asercję `assertPrimaryNavActiveState()`. Build sprawdza teraz, czy dla `index.html`, `oferta.html`, `uslugi.html`, `realizacje.html`, `o-nas.html` i `kontakt.html` wygenerowany header zawiera dokładnie jeden oczekiwany link `.nav__link` z `aria-current="page"`.

### Zmienione pliki

- `scripts/build.mjs`
- `resolved.md`

### Notatki

Zweryfikowano przez `npm run build`, że obecne źródła przechodzą nową asercję. Strony prawne i użytkowe pozostają poza ścisłą kontrolą primary navigation, ponieważ nie mają odpowiadających linków w płaskiej głównej nawigacji.

----------

## Szablon wpisu

### Data

YYYY-MM-DD

### Tytuł problemu

Krótka nazwa problemu z audytu.

### Status

Do uzupełnienia po naprawie.

### Źródło

Np. `daily-AUDIT.md`, sekcja i punkt audytu.

### Rozwiązanie

Opis faktycznie wykonanej naprawy.

### Zmienione pliki

- brak

### Notatki

Dodatkowy kontekst, wynik weryfikacji lub powód przyjętego rozwiązania.
