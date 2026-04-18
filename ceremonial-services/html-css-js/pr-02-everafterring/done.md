# Done

Ten plik służy do krótkiego potwierdzania wykonanych zadań.

## Szablon wpisu

- Punkt: [krótki opis]
- Status: zrobione
- Uwagi: [opcjonalnie]

1. 01: trapFocus aktywny tylko przy otwartym menu mobilnym
   Status: zrobione
   Uwagi: focus trap jest podpinany w `openNav()` i usuwany przy zamknięciu menu oraz przy resecie po `resize`.

2. 02: keyboard accessibility smoke test dla nawigacji i dropdownu
   Status: zrobione
   Uwagi: dodałem do `README.md` ręczny, powtarzalny checklist pre-merge obejmujący `Tab`, `Shift+Tab`, `Enter`, `Space` i `Escape`.

3. 03: domenowa walidacja formularza kontaktowego
   Status: zrobione
   Uwagi: dodałem reguły dla daty wydarzenia i liczby gości, precyzyjniejsze komunikaty błędów oraz spójną walidację podczas edycji i przy wysyłce formularza.

4. 04: doprecyzowanie komunikatów błędów formularza kontaktowego
   Status: zrobione
   Uwagi: ujednoliciłem i doprecyzowałem komunikaty dla wszystkich pól formularza, tak aby jasno wskazywały, co jest nie tak i jak poprawić wartość.

5. 05: przejściowy async submission flow dla formularza kontaktowego
   Status: zrobione
   Uwagi: wdrożyłem mockowy, asynchroniczny flow wysyłki z obsługą loading, sukcesu i błędu sieciowego, blokadą podwójnego submitu oraz strukturą gotową do późniejszej podmiany na prawdziwy endpoint.

6. 06: lekka warstwa antyspamowa dla formularza kontaktowego
   Status: zrobione
   Uwagi: dodałem honeypot ukryty w sposób bezpieczny dla UX i accessibility oraz lekki cooldown po udanej wysyłce, a payload przygotowałem pod późniejsze backendowe rate limiting.

7. 07: minimalny setup lintingu i formatowania dla HTML, CSS i JavaScript
   Status: zrobione
   Uwagi: dodałem package.json, konfiguracje ESLint/Stylelint/HTMLHint/Prettier, skrypty npm oraz instrukcję uruchamiania toolingu lokalnie i pod przyszłe CI.

8. 08: minimalny CI quality gate dla statycznego repo
   Status: zrobione
   Uwagi: dodałem pojedynczy workflow GitHub Actions, skrypt `check:static` do weryfikacji gotowości statycznego artefaktu oraz integrację tych checków z istniejącymi komendami npm.

9. 09: zwięzły pre-release quality checklist w README
   Status: zrobione
   Uwagi: dodałem krótki checklist releasowy obejmujący accessibility, SEO, linki wewnętrzne, formularz i responsywność, wyraźnie oddzielony od automatycznych checków CI.
