# BlackGrid Security — Multipage Website

Nowoczesny, produkcyjny projekt strony WWW (PL + EN) dla firmy świadczącej usługi cyberbezpieczeństwa: audyty, wdrożenia hardening/Zero Trust, SOC/MDR, incident response i testy penetracyjne.

## Struktura folderów

```text
it-pr02-blackgrid/
├── index.html / index.en.html
├── services.html / services.en.html
├── subscriptions.html / subscriptions.en.html
├── threat-intelligence.html / threat-intelligence.en.html
├── case-studies.html / case-studies.en.html
├── about.html / about.en.html
├── contact.html / contact.en.html
├── privacy.html / privacy.en.html
├── cookies.html / cookies.en.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── utilities.css
│   ├── main.css
│   ├── components/
│   └── pages/
├── js/
│   ├── app.js
│   ├── config.js
│   ├── utils.js
│   └── modules/
└── assets/
    ├── icons/
    ├── logos/
    ├── images/
    └── team/
```

## Jak uruchomić lokalnie

1. Przejdź do katalogu repo i uruchom serwer statyczny:
   - `python3 -m http.server 8080`
2. Otwórz: `http://localhost:8080/it-pr02-blackgrid/index.html`
3. Sprawdź wariant EN przez przełącznik języka lub plik `index.en.html`.

## Features

- Multipage PL/EN z ręcznym przełącznikiem języka i mapowaniem odpowiednich podstron.
- Spójny system design tokens + modularny CSS (components/pages/layout).
- Modularny JS (ES Modules), bez globali, z idempotentną inicjalizacją.
- A11y: skip link, aria-current, formularze z etykietami i walidacją UX, accordiony/tabs z atrybutami ARIA.
- SEO: unikalne metadane per strona, canonical, robots.txt, sitemap.xml, JSON-LD Organization/WebSite.
- Wydajność: lokalne SVG placeholdery, lazy-loading obrazów poza viewportem, lekkie animacje reveal z obsługą reduced-motion.

## Checklist QA

- [ ] Lighthouse: Performance / Accessibility / Best Practices / SEO.
- [ ] Nawigacja klawiaturą (Tab, Shift+Tab, ESC w menu mobilnym).
- [ ] W3C validator: brak krytycznych błędów HTML/CSS.
- [ ] Responsywność: 360px, 768px, 1024px, 1440px.
- [ ] Działanie filtrów threat-intelligence i tabs/accordion.
- [ ] Walidacja formularza kontaktowego (focus na pierwszym błędzie + aria-live).
