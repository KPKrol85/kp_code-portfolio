# FleetOps Image Asset Pipeline Map

## Status

The hero image optimization workflow has been implemented.

The project now separates editable image sources from optimized runtime images:

- `assets/img-src/` contains editable source images.
- `assets/img/` contains optimized runtime output.
- `assets/img-src/` is excluded from production `dist/`.
- `assets/logos/` contains logo assets, while `assets/icons/` contains UI icons.

## Current Asset Structure

```text
assets/
├── favicon/
│   ├── apple-touch-icon.png
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── fonts/
│   └── inter-latin.woff2
├── icons/
│   ├── hamburger-dark.svg
│   └── hamburger-light.svg
├── img-src/
│   └── hero/
│       ├── hero-dark.jpg
│       └── hero-light.jpg
├── img/
│   └── hero/
│       ├── hero-dark.avif
│       ├── hero-dark.webp
│       ├── hero-dark.jpg
│       ├── hero-light.avif
│       ├── hero-light.webp
│       └── hero-light.jpg
├── logos/
│   ├── logo-512.png
│   ├── logo-black.svg
│   └── logo-white.svg
├── og-img/
│   ├── og-1200x1200.jpg
│   └── og-1200x630.jpg
├── screenshots/
│   ├── screenshot-desktop.png
│   └── screenshot-mobile.png
└── shortcuts/
    ├── dashboard.png
    ├── flota.png
    └── zlecenia.png
```

## Runtime Image References

### HTML metadata and app surface

- `index.html` references Open Graph, Twitter, favicon, Apple touch icon and manifest assets.
- `index.html` preloads the local Inter font from `assets/fonts/`.

### Manifest assets

`assets/favicon/site.webmanifest` references:

- manifest icons from `assets/favicon/`;
- screenshots from `assets/screenshots/`;
- shortcut icons from `assets/shortcuts/`.

The Dashboard shortcut points to `/app`, which is an implemented application route.

### JavaScript-rendered assets

Landing hero images are rendered from:

```text
assets/img/hero/
```

Logo references use:

```text
assets/logos/
```

Hamburger menu icons use:

```text
assets/icons/
```

## Implemented Optimization Strategy

The image pipeline is implemented in `optimize-images.js` and uses `sharp`.

Current behavior:

- required sources are read from `assets/img-src/hero/`;
- output folders are created automatically;
- each hero JPG source generates:
  - AVIF
  - WebP
  - JPG fallback
- the script fails clearly if a required source file is missing.

The npm command is:

```bash
npm run optimize:images
```

The production build runs image optimization before generating `dist/`:

```bash
npm run build
```

## Dist Handling

`build-dist.js` copies runtime assets into `dist/` and excludes:

```text
assets/img-src/
```

Expected production asset structure:

```text
dist/assets/
├── favicon/
├── fonts/
├── icons/
├── img/
├── logos/
├── og-img/
├── screenshots/
└── shortcuts/
```

`dist/assets/img-src/` should not exist.

## Asset Category Rules

- `assets/img-src/` - editable source images only.
- `assets/img/` - optimized runtime images.
- `assets/logos/` - brand/logo files.
- `assets/icons/` - UI icons.
- `assets/favicon/` - browser and manifest icons.
- `assets/og-img/` - Open Graph images.
- `assets/screenshots/` - PWA manifest screenshots.
- `assets/shortcuts/` - PWA manifest shortcut icons.

## Maintenance Notes

- Do not manually edit generated files in `assets/img/` if they are produced from `assets/img-src/`.
- Do not copy `assets/img-src/` to production output.
- Keep SVG icons as SVG; do not rasterize them through the hero image pipeline.
- Keep favicon, Open Graph, screenshots and shortcut assets outside the hero optimization workflow unless a separate pipeline is introduced.
- If a new optimized image group is added, update `optimize-images.js` and verify references before changing runtime markup.
