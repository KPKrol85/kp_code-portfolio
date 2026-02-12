# TransLogix

## Image optimization

- Wrzuć obrazy źródłowe do `src_img` (obsługiwane: `.jpg`, `.jpeg`, `.png`, także w podfolderach).
- Uruchom optymalizację poleceniem:

```bash
npm run img:opt
```

- Wygenerowane pliki trafiają do `opt_img` z zachowaniem tej samej struktury katalogów.
- Dla każdego obrazu skrypt tworzy dwa formaty: `AVIF` oraz `WEBP`.
- Skrypt działa incrementalnie: jeżeli plik wyjściowy jest nowszy od wejściowego, konwersja jest pomijana.
- Jeśli folder `src_img` nie istnieje, skrypt kończy się kodem `0` i komunikatem „Nothing to optimize”.
- Przy błędach konwersji skrypt zwraca kod `1`.

## Quality checks (HTML + a11y smoke)

- Uruchom pełny pakiet walidacji poleceniem:

```bash
npm run check
```

- `check:html` waliduje wszystkie pliki HTML przez `html-validate`.
- `check:a11y` uruchamia lokalny serwer statyczny i odpala smoke test dostępności przez `pa11y-ci` (WCAG2AA).

## E2E smoke tests (Playwright)

- Uruchom wszystkie testy E2E (one command):

```bash
npm run test:e2e
```

- Uruchom interfejs Playwright UI:

```bash
npm run test:e2e:ui
```

- Otwórz raport HTML po teście:

```bash
npm run test:e2e:report
```
