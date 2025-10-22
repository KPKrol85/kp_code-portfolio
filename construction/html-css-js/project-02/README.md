# Construction Project 02 — Responsive Demo Website

A fully responsive and accessible demo website for a construction company, built to demonstrate professional front-end practices in HTML, CSS and JavaScript.

🔗 **Live Demo:** *(add link when deployed)*

---

## 📖 Overview

This project is a production-ready showcase of clean, optimized front-end code with a focus on **accessibility**, **performance** and **maintainability**.
It expands the base landing page with **service subpages** and **legal pages**, implements modern patterns (semantic HTML, CSS custom properties, mobile-first layout), and adds lightweight, progressively-enhanced interactions (no frameworks).

---

## ✨ Features

* **100 / 100 / 100 / 100 Lighthouse score** (Performance / Accessibility / Best Practices / SEO)
* **Responsive layout** (mobile-first; refined breakpoints and compact header on scroll)
* **Accessible navigation** (ARIA, focus management, inert on mobile menu, ESC/overlay/resize close)
* **Theme switcher (Light / Dark)** with persistent preference and system sync
* **Local WOFF2 fonts** with `font-display: swap` and minimal FOIT
* **Hero, About, Services, Testimonials, Gallery, FAQ, Contact** sections
* **IntersectionObserver reveal** for safe, non-blocking animations
* **Gallery Lightbox** (focus-trap, ESC close, caption, body lock, hover prefetch on desktop)
* **Back-to-top** button with reduced-motion awareness
* **Contact form**:

  * Client-side validation (required fields, email, optional phone, consent)
  * Error summary + “skip to first error” for keyboard / screen readers
  * Message character counter + auto-save draft (localStorage)
  * Netlify Forms compatible submission (optional reCAPTCHA)
* **Service subpages** (`/services/...`) with breadcrumbs, checklists and CTA
* **Legal pages** (`/legal/...`) — privacy policy, cookies, terms, careers, certificates
* **PWA-ready**: manifest, icons, offline 404 (optional)
* **SEO-ready**: semantic HTML, meta tags, sitemap, robots, clean URLs
* **Production build**: minified CSS/JS, lean assets, sensible caching headers

---

## 🧰 Tech Stack

* **HTML5**, **CSS3**, **JavaScript (ES6)**
* **Netlify** (hosting / deploy, forms, optional reCAPTCHA)
* **CSSNano** (CSS minification)
* **Terser** (JS minification)
* **DevTools / Lighthouse / VS Code** for performance & accessibility testing

---

## 📂 Folder Structure

```
project-02/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── img/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   └── script.min.js
├── services/
│   ├── adaptacje-poddaszy.html
│   ├── budowa-domow.html
│   ├── instalacje-elektryczne.html
│   ├── instalacje-sanitarne.html
│   ├── remonty-mieszkan.html
│   └── wykonczenia-wnetrz.html
├── legal/
│   ├── polityka-prywatnosci.html
│   ├── polityka-cookies.html
│   ├── regulamin.html
│   ├── kariera.html
│   └── certyfikaty.html
├── index.html
├── 404.html                (optional offline fallback)
├── site.webmanifest / manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers                (security + caching)
├── _redirects.txt          (clean routes)
└── .gitignore
```

---

## ⚡ Performance & Accessibility

* Built for **Core Web Vitals** (fast FCP/LCP, zero TBT, stable CLS)
* Progressive enhancement throughout (works with JS off for core content)
* **Reduced-motion** respected for animations and smooth-scroll
* Accessible patterns: visible focus styles, logical heading structure, color-contrast, skip-link, ARIA where needed (never decorative)

---

## 🌐 SEO & PWA

* Descriptive titles, meta descriptions and headings
* Open Graph / social preview ready
* `robots.txt` and `sitemap.xml` included
* Web App Manifest with icon set
* Netlify headers for caching and basic security (HSTS, X-Content-Type-Options, X-Frame-Options)

---

## ▶️ Getting Started

1. **Open locally** — just open `index.html` in a modern browser.
2. **Serve** (recommended for forms/PWA testing): use any static server, e.g.

   ```bash
   npx serve .
   ```
3. **Deploy** — drag & drop the folder to Netlify (or connect the repo for CI).

   * Netlify Forms: ensure your `<form>` has `name` and data attributes as in the template.
   * Optional: enable Google reCAPTCHA and keep `_headers` / `_redirects.txt`.

---

## 🧑‍💻 Author

**KP_Code**
Front-End Developer focused on clean code, accessibility, and performance.

© 2025 KP_Code — For educational and portfolio use only.
