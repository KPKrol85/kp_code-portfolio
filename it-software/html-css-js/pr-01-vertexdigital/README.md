# Vertex Digital — strona firmowa

Nowoczesna, wielostronicowa strona WWW dla software house "Vertex Digital" zbudowana w Vanilla HTML/CSS/JS.

## Struktura folderów

```
it-pr01-vertexdigital/
├── assets/
│   ├── favicon.svg
│   ├── icons/
│   └── images/
├── css/
│   ├── components/
│   ├── pages/
│   ├── base.css
│   ├── layout.css
│   ├── main.css
│   ├── tokens.css
│   └── utilities.css
├── js/
│   ├── modules/
│   ├── app.js
│   ├── config.js
│   └── utils.js
├── index.html
├── kontakt.html
├── o-nas.html
├── proces.html
├── realizacje.html
├── uslugi.html
├── robots.txt
└── sitemap.xml
```

## Jak uruchomić lokalnie

1. Wejdź do folderu projektu: `cd it-pr01-vertexdigital`.
2. Otwórz `index.html` w przeglądarce (np. przez Live Server) lub użyj prostego serwera:
   ```
   python -m http.server 8000
   ```
3. Wejdź na `http://localhost:8000`.

## Features

- Semantyczny HTML i jeden `<main>` na stronę.
- Mobile-first, sticky header, dostępne menu mobilne.
- Modularny CSS z tokenami, BEM i dark mode.
- Modularny JS (ES Modules) z walidacją formularza, reveal animation i motywami.
- SEO-ready: meta title/description, canonical, JSON-LD, sitemap.xml i robots.txt.

## QA checklist

- [ ] Sprawdź Lighthouse (Performance, Accessibility, Best Practices, SEO).
- [ ] Przetestuj nawigację klawiaturą (TAB / ESC / focus states).
- [ ] Walidacja W3C dla każdej podstrony.
- [ ] Sprawdź kontrast w trybie jasnym i ciemnym.
- [ ] Sprawdź działanie formularza i komunikatów błędów.
