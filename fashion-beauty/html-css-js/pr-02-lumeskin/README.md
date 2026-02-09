# Lumé Skin — premium beauty studio website

## Overview
Portfolio-grade multi-page website for **Lumé Skin** (studio pielęgnacji skóry, paznokci i masażu). Projekt zawiera jasny/ciemny motyw, responsywny układ i rozbudowane komponenty UI zgodne z zasadami dostępności.

## Pages
- `index.html` — landing page
- `uslugi.html` — usługi (Skin Care, Paznokcie, Masaż)
- `cennik.html` — cennik
- `o-nas.html` — o nas
- `rezerwacja.html` — rezerwacja z formularzem
- `faq.html` — FAQ
- `kontakt.html` — kontakt
- `standardy-higieny.html` — standardy higieny
- `zespol.html` — zespół

## Setup
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Optional CSS/JS minification
```bash
npm run css:build
npm run js:build
```

## Folder structure
```
pr-02-lume-skin/
├── assets/
│   ├── icons/
│   └── illustrations/
├── css/
│   ├── pages/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── tokens.css
│   ├── utilities.css
│   └── main.css
├── js/
│   └── main.js
├── scripts/
│   └── convert-images.js
└── *.html
```

## Image pipeline (ready for real assets)
Place source images in `assets/src-images/` as `.png` or `.jpg`. Then run:
```bash
npm run images:convert
```
This will generate `.webp` and `.avif` files in `assets/images/`. **Binary outputs and `assets/images/` are ignored in git.**

## Accessibility & keyboard support
- Skip link, semantic landmarks and headings.
- Keyboard-friendly navigation with focus styles.
- Accessible tabs, accordion, and mobile menu with focus trap.
- Reduced motion support and aria-live messaging on form submission.

## Notes
- All icons and illustrations are inline SVG placeholders, ready for replacement with real visuals.
