## 🇬🇧 English version

# SolidCraft — Construction Company Website (Demo)

Responsive demo website for a construction and renovation company, created as a portfolio project.
The focus is on clean UI, accessibility, performance, and modern front-end best practices.

🔗 **Live demo:** https://construction-pr-01-solidcraft.netlify.app

---

## Project Purpose

This project was created as part of a professional front-end portfolio.
It demonstrates how a real-world construction company website could be designed and implemented
using semantic HTML, modern CSS, and vanilla JavaScript — without frameworks.

The goal of the project is to showcase layout architecture, accessibility awareness,
and production-ready front-end structure.

---

## Key Characteristics

- Fully responsive, mobile-first layout
- Accessible navigation and semantic HTML
- Light / dark theme support
- Optimized performance and SEO fundamentals
- Clean, scalable project structure

---

## Tech Stack

- HTML5
- CSS3 (custom properties, responsive layout)
- Vanilla JavaScript (ES6)
- Netlify (hosting & deployment)

---

## Contact form (Netlify Forms)

The contact form uses Netlify Forms with progressive enhancement, so it works
without JavaScript and submits to a dedicated thank-you page. With JavaScript
enabled, the form submits via `fetch` (URL-encoded) and shows inline
loading/success/error feedback, plus a honeypot field for basic anti-spam.

Manual test:

1. Run the site locally and open the contact section.
2. Submit the form and verify the POST request in DevTools → Network.
3. Deploy to Netlify and confirm the submission appears in **Netlify → Forms**.

---

## Image optimization

Source images live in `assets/img-src` and are generated into `assets/img`.
Only these folders are processed: `hero`, `oferta`, `gallery`, `og`, `screenshots`.

How to add a new image:

- Put the original JPG/JPEG/PNG in the matching folder under `assets/img-src`.
- Run `npm run images:build` to generate AVIF/WEBP and JPG fallbacks.

Commands:

- `npm run images:build`
- `npm run images:clean`

---

## Project Status

✔ Completed (v1)

Future improvements planned:

- SVG logo optimization
- UI polish and minor refactors
- Further accessibility enhancements

---

## Disclaimer

This website is a fictional demo project created for portfolio purposes only.
All company names, addresses, and data are used as examples and do not represent a real business.

---

## Author

Kamil Król
**KP*Code***
Front-End Developer
Portfolio project — 2025

---

## 🇵🇱 Wersja polska

# SolidCraft — strona firmy remontowo-budowlanej (demo)

Responsywna demonstracyjna strona internetowa dla firmy remontowo-budowlanej,
stworzona jako projekt portfolio.
Projekt koncentruje się na czytelnym interfejsie, dostępności, wydajności
oraz nowoczesnych standardach front-end.

🔗 **Demo online:** https://construction-pr-01-solidcraft.netlify.app

---

## Cel projektu

Projekt został stworzony jako element profesjonalnego portfolio front-end.
Pokazuje, w jaki sposób może wyglądać i działać nowoczesna strona firmy
remontowo-budowlanej oparta o czysty HTML, CSS i JavaScript — bez użycia frameworków.

Celem projektu jest zaprezentowanie architektury layoutu,
świadomego podejścia do dostępności oraz struktury gotowej do wdrożenia produkcyjnego.

---

## Główne cechy

- W pełni responsywny layout (mobile-first)
- Dostępna nawigacja i semantyczny HTML
- Obsługa trybu jasnego i ciemnego
- Optymalizacja wydajności i podstaw SEO
- Czysta i skalowalna struktura projektu

---

## Stack technologiczny

- HTML5
- CSS3 (custom properties, layout responsywny)
- JavaScript (ES6, vanilla)
- Netlify (hosting i deployment)

---

## Formularz kontaktowy (Netlify Forms)

Formularz korzysta z Netlify Forms i działa również bez JavaScript (progressive
enhancement) — wysyłka prowadzi na stronę podziękowania. Przy włączonym JS
formularz wysyła dane przez `fetch` (URL-encoded) i pokazuje stany
loading/success/error, a dodatkowo zawiera honeypot jako podstawową ochronę
anty-spamową.

Test manualny:

1. Uruchom stronę lokalnie i przejdź do sekcji kontaktu.
2. Wyślij formularz i sprawdź request POST w DevTools → Network.
3. Po wdrożeniu na Netlify potwierdź zgłoszenie w **Netlify → Forms**.

---

## Status projektu

✔ Zakończony (v1)

Planowane usprawnienia:

- optymalizacja logo SVG
- drobne poprawki UI i refaktoryzacja
- dalsze usprawnienia dostępności

---

## Informacja prawna

Strona jest fikcyjnym projektem demonstracyjnym stworzonym wyłącznie
w celach portfolio.
Wszystkie nazwy firm, adresy i dane mają charakter przykładowy
i nie odnoszą się do rzeczywistej działalności.

---

## Autor

Kamil Król
**KP*Code***
Front-End Developer
Projekt portfolio — 2025
