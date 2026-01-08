# Gastronomy 02 — Fine Dining Restaurant Demo Website

A fully responsive and accessible demo website for the gastronomy industry, built to demonstrate professional front-end practices in HTML, CSS, and JavaScript.

Live Demo:
→ https://gastronomy-project-02.netlify.app/

1. **Overview**
   - Part of the _KP_Code Professional Learning Plan_.
   - Achieved Lighthouse score: **100 / 100 / 100 / 100**.
   - Strong focus on performance, accessibility, SEO, and PWA best practices.

2. **Features**
   - Responsive layout (mobile-first grid/flex, fluid typography).
   - Semantic HTML with proper headings and landmarks.
   - Accessibility: `aria-labels`, focus styles, high contrast, skip links.
   - Images: modern formats (WebP/JPG), `loading="lazy"`, width/height set to avoid layout shift.
   - Performance: `theme-color`, preconnects, critical assets preload (fonts/hero), minified CSS/JS.
   - SEO: descriptive titles, meta descriptions, structured headings, canonical URL.
   - PWA: Web App Manifest (`manifest.webmanifest`) and Service Worker (`sw.js`).
   - Offline mode: cache-first strategy with a fallback `404.html` for offline navigation.
   - Netlify headers: caching, security headers, and file-specific rules via `_headers`.
   - Build optimizations: CSSNano and Terser minification pipelines.

3. **Manual Build (final step only)**
   - Dev source: `css/style.css`, `js/script.js`, and `assets/img/**/*.{jpg,png}`.
   - Run `npm run build` to generate optimized images (WebP/AVIF) and minified CSS/JS (`style.min.css`, `script.min.js`).
   - Add new images by placing JPG/PNG files under `assets/img/` and rerun `npm run optimize:images`.

4. **Tech Stack**
   - HTML5, CSS3, JavaScript (ES6)
   - Netlify (hosting & headers)
   - CSSNano, Terser (minification)
   - Lighthouse, Chrome DevTools (audits)
   - VS Code (editor)

5. **Folder Structure**

```text
gastronomy-html-css-js-project-02/
├── index.html
├── about.html
├── menu.html
├── gallery.html
├── cookies.html
├── polityka-prywatnosci.html
├── 404.html
├── css/
│   ├── style.css
│   └── style.css
├── js/
│   ├── script.js
│   └── script.js
├── assets/
│   ├── fonts/
│   │   ├── lato-400-latin.woff2
│   │   ├── lato-700-latin.woff2
│   │   ├── montserrat-400-latin.woff2
│   │   └── montserrat-700-latin.woff2
│   ├── icons/
│   │   ├── fav-icon/
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   ├── favicon-96x96.png
│   │   │   ├── favicon-1024x1024.png
│   │   │   ├── favicon.ico
│   │   │   ├── favicon.svg
│   │   │   └── web-app-manifest-512x512.png
│   │   └── svg-icon/
│   │       ├── github-icon.svg
│   │       ├── facebook-icon.svg
│   │       ├── instagram-icon.svg
│   │       ├── mail-icon.svg
│   │       ├── phone-icon.svg
│   │       ├── home-icon.svg
│   │       ├── icon-moon.svg
│   │       └── icon-sun.svg
│   └── img/
│       ├── menu/
│       │   ├── risotto-800x534.webp
│       │   └── risotto-800x534.jpg
│       └── …
├── manifest.webmanifest
├── sw.js
├── sitemap.xml
├── robots.txt
├── _headers
├── _redirects.txt
├── package.json
├── package-lock.json
└── postcss.config.js
```

6. **Performance & Accessibility**
   - Performance: 100
     Accessibility: 100
     Best Practices: 100
     SEO: 100

   | Metric        | Value |
   | ------------- | -----:|
   | FCP           | 0.8s  |
   | LCP           | 1.1s  |
   | TBT           | 0ms   |
   | CLS           | 0.00  |
   | Speed Index   | 1.0s  |

7. **SEO & PWA**
   - Meta Open Graph & Twitter Cards for rich sharing.
   - `robots.txt` configured for crawl directives.
   - `sitemap.xml` for search engine indexing.
   - `manifest.webmanifest` with icons and display properties.
   - Netlify `_headers` for cache and security policies.
   - Offline support via Service Worker and `404.html` fallback.

8. **Author**
   - **KP_Code**
     Front-End Developer focused on clean code, accessibility, and performance.
     © 2025 KP_Code — For educational and portfolio use only.

> This project is part of the KP_Code portfolio series — Gastronomy Demo 02.
