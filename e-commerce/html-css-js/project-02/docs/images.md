# Images pipeline

## Source and generated folders

- Put original images in `assets/img/_src/`.
- Generated outputs are written to `assets/img/_gen/` (WebP + AVIF variants).

## Commands

- `npm run img:build` - generate responsive WebP/AVIF variants and `manifest.json`.
- `npm run img:clean` - remove generated assets in `_gen` (keeps `.gitkeep`).

## HTML usage example

```html
<picture>
  <source
    type="image/avif"
    srcset="assets/img/_gen/hero-w640.avif 640w, assets/img/_gen/hero-w1280.avif 1280w"
    sizes="(max-width: 768px) 90vw, 1280px"
  />
  <source
    type="image/webp"
    srcset="assets/img/_gen/hero-w640.webp 640w, assets/img/_gen/hero-w1280.webp 1280w"
    sizes="(max-width: 768px) 90vw, 1280px"
  />
  <img src="assets/img/_gen/hero-w640.webp" alt="Hero" width="640" height="360" loading="lazy" />
</picture>
```
