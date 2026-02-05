# FlowDesk

FlowDesk to demo aplikacji SPA typu Service Management Dashboard dla małych firm usługowych. Aplikacja działa w pełni po stronie klienta (bez backendu), z realistycznym stanem i CRUD w `localStorage`.

## Funkcje
- Fake auth z walidacją formularza i guardem routingu.
- Dashboard KPI, listy działań i ostatnich zleceń.
- Klienci: filtrowanie, sortowanie, CRUD, panel szczegółów.
- Zlecenia: lekka tablica statusów, filtry, CRUD.
- Kalendarz: lista wydarzeń z powiązaniami.
- Ustawienia: motyw, reduced motion, eksport JSON, reset danych.
- PWA: manifest, service worker, offline fallback.

## Struktura folderów
```
flowdesk/
  assets/
    fonts/
    icons/
  css/
  js/
    core/
    data/
    views/
    components/
    utils/
  index.html
  offline.html
  404.html
```

## A11y checklist
- Skip link i focus-visible.
- Modal/drawer z `aria-modal` i obsługą ESC.
- Klawiaturowy dostęp do nawigacji i formularzy.
- Kontrast i tryb reduced motion.

## PWA
- `manifest.webmanifest` + ikony SVG.
- `service-worker.js` cache app-shell + offline fallback.

## Komendy npm
- `npm run dev` — lokalny serwer.
- `npm run build:css` — build CSS z minifikacją.
- `npm run build:js` — minifikacja `main.js`.
- `npm run images` — kompresja obrazów.

## Uwagi o danych demo
Dane w `localStorage` są inicjalizowane z `js/data/seed.js`. Reset w ustawieniach przywraca ten zestaw.
