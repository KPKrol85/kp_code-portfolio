# Image pipeline note

## Folder roles
- `assets/img-src/` — editable raster source files (developer source of truth).
- `assets/img/` — optimized working images consumed by source HTML during development.
- `dist/assets/img/` — deploy output copied from `assets/img/` during the normal build.
- `assets/svg/` — existing SVG assets (left unchanged by raster optimizer).

## How it works
Run the optimizer with:

```bash
npm run build:images
```

The script:
1. reads raster files from `assets/img-src/`
2. preserves folder structure
3. writes optimized output to `assets/img/`
4. creates deterministic variants per raster source:
   - optimized same-family output (`.jpg/.jpeg/.png/.webp/.avif`)
   - `.webp`
   - `.avif`
5. copies `.svg` files from `assets/img-src/` as pass-through assets into `assets/img/`

The deploy build then copies optimized working images into `dist` through the normal asset copy:

```bash
npm run build
```

## Scope and guardrails
- SVG files from `assets/img-src/` are copied as-is (no forced rasterization).
- Existing references to `assets/svg/` remain stable.
- Source HTML should reference `assets/img/` when using optimized raster assets.
- `assets/img-src/` is never copied into deploy output.
- Workflow is intentionally minimal and ready for future extension (e.g., responsive variants) without forcing it now.
