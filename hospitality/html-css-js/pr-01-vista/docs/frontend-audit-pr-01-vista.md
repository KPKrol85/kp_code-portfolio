# Audyt frontendowy (senior) — `pr-01-vista`

## 1) Krótki opis projektu
Projekt to wielostronicowy, statyczny serwis hotelowy oparty o Vanilla HTML/CSS/JS, z naciskiem na estetykę, responsywność i media-rich content (dużo obrazów, galerie, lightbox). Architektura jest modularna (podział CSS i feature-based JS), a nawigacja, formularz i część SEO są wspierane skryptami po stronie klienta. Widać dobrą bazę jakościową, ale jest kilka istotnych ryzyk produkcyjnych (a11y/SEO/performance/progressive enhancement).

## 2) P0 — CRITICAL
Brak krytycznych problemów P0 wykrytych w aktualnym stanie projektu.

## 3) P1 — IMPORTANT
1. **JSON-LD jest ładowany wyłącznie przez JS (fetch + dynamic injection), bez fallbacku inline w HTML.** To obniża niezawodność SEO dla crawlerów/renderingów bez pełnego wykonania JS.  
2. **Formularz ma `novalidate`, a walidacja telefonu może zablokować submit bez pokazania błędu użytkownikowi.** W `form.js` wynik walidacji telefonu wpływa na `ok`, ale nie ma `setError(...)` ani dedykowanego komunikatu dla pola telefonu.  
3. **Przycisk zmiany motywu nie komunikuje stanu komponentu (`aria-pressed`) i ma etykietę po angielsku w polskiej wersji UI.** To obniża spójność UX i dostępność dla technologii asystujących.  
4. **CSS bazuje na łańcuchu `@import` w runtime (`css/style.css` importuje wiele modułów).** Dla produkcji to gorsze TTFB/render path (więcej etapów pobrań parsera CSS) i słabsza wydajność pierwszego renderu.  
5. **Na mobile bez JS przycisk hamburgera pozostaje widoczny, ale jest niefunkcjonalny.** To mylący element interfejsu (false affordance) w scenariuszu progressive enhancement.

## 4) P2 — NICE TO HAVE
1. **Nadmiarowe/niejednolite deklaracje `theme-color` w `<head>`.** Część stron ma warianty z `media`, a jednocześnie dodatkowy statyczny wpis; warto ujednolicić strategię.  
2. **`registerSW()` loguje do konsoli w produkcji.** Warto ograniczyć logowanie (np. tylko dev), by utrzymać czystą konsolę i łatwiejszy debug realnych błędów.  
3. **Brak fallbacków dla `color-mix(...)` w kluczowych miejscach stylów.** Na starszych przeglądarkach może to dać degradację wizualną bez kontrolowanego backupu wartości.  
4. **Powielanie logiki `aria-current` (statycznie w HTML + dynamicznie w JS).** Działa, ale zwiększa koszt utrzymania i ryzyko niespójności przy dalszym rozwoju nawigacji.  
5. **Brak wyraźnej polityki „critical CSS vs reszta” dla strony głównej.** Przy tak ciężkiej warstwie graficznej można jeszcze poprawić perceived performance (szybszy first paint).
