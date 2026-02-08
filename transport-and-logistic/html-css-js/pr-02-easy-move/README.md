# Easy Move – premium site for moving services

## Overview
Multi-page, accessibility-first website for the Easy Move moving company. The project uses modular CSS (BEM), vanilla JS interactions, and a light/dark theme system with persistence.

## Pages
- `index.html` – landing page
- `uslugi.html` – services
- `cennik.html` – pricing
- `o-nas.html` – about
- `faq.html` – FAQ
- `kontakt.html` – contact + full form
- `przeprowadzki-firm.html` – office moves

## Development
```bash
npm install
npm run dev
```

## Build & preview
```bash
npm run build
npm run preview
```

## Useful scripts
```bash
npm run css:build
npm run css:watch
npm run js:build
npm run images:convert
```

## Folder structure
```
/transport-and-logistics/pr-02-easy-move
├── assets
│   ├── icons
│   └── illustrations
├── css
│   ├── pages
│   └── main.css
├── js
├── scripts
└── dist (generated)
```

## Adding real images later
1. Place source `.png/.jpg/.jpeg` files in `assets/src-images/` (create the folder if needed).
2. Run `npm run images:convert` to generate optimized `.webp` and `.avif` files in `assets/images/`.
3. Reference the generated images in HTML or CSS.

## Accessibility notes
- Skip link, semantic landmarks, and visible focus rings across all pages.
- Mobile menu is keyboard navigable with focus trap and Escape/overlay close.
- Accordions and tabs use accessible ARIA patterns.
- The contact form includes inline errors and a summary with `aria-live` feedback.
- Reduced motion is respected via `prefers-reduced-motion`.
