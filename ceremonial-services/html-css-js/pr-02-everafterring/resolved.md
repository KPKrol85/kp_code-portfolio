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

----------
