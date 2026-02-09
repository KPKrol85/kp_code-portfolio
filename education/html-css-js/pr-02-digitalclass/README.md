# Digital-class (MVP SPA)

## Uruchomienie

1. Otwórz plik `digital-class/index.html` w przeglądarce (offline, bez backendu).
2. Dane demo są automatycznie seedowane przy pierwszym uruchomieniu.

## Struktura projektu

```
digital-class/
  index.html
  assets/
  css/
  js/
    app.js
    router/
    core/
    domain/
    ui/
    pages/
    utils/
```

## Architektura

### Store
- Jeden centralny store (`js/core/store.js`) z event-driven `dispatch` i `subscribe`.
- Dane są persystowane w `localStorage` (`js/core/storage.js`) z wersjonowaniem schematu (`js/core/migrate.js`).
- Akcje walidują wejście w `js/core/actions.js`.
- Adapter przyszłego API znajduje się w `js/core/dataClient.js`.

### Router
- Hash-based routing (`/#/dashboard`).
- Parametry obsługiwane w `js/router/router.js` (np. `/#/classes/:classId`).

### Role i uprawnienia
- Role: admin, teacher, student.
- Uprawnienia kontrolowane w `js/core/permissions.js`.
- Role/User Switcher w topbarze pozwala zmieniać aktywnego użytkownika.

### Seed danych
- Seed uruchamiany w `js/core/seed.js`.
- Zawiera demo tenant, użytkowników, klasy, grupy, treści, czaty, notatki i oddania.
- Zmiany w seed wprowadzisz w `js/core/seed.js`.

## Role switcher
- Dropdown w topbarze przełącza aktywnego użytkownika i rolę.
- Stan jest persystowany w localStorage.

## Layout i UI
- Mobile-first: sidebar jako drawer + topbar.
- Komponenty UI w `js/ui/` (tabs, toast, drawer, empty state, list).
- Spójne tokeny designu w `css/tokens.css`.
