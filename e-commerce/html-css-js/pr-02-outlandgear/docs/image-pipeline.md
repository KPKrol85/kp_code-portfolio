# Image pipeline note

## Folder roles
- `assets/img-src/` — editable raster source files (developer source of truth).
- `assets/img/` — source-level runtime folder not used as the production output target.
- `dist/assets/img/` — generated, production-ready raster assets consumed by the deploy build.
- `assets/svg/` — existing SVG assets (left unchanged by raster optimizer).

## How it works
Run the optimizer with:

```bash
npm run build:images
```

The script:
1. reads raster files from `assets/img-src/`
2. preserves folder structure
3. writes optimized output to `dist/assets/img/`
4. creates deterministic variants per raster source:
   - optimized same-family output (`.jpg/.jpeg/.png/.webp/.avif`)
   - `.webp`
   - `.avif`
5. copies `.svg` files from `assets/img-src/` as pass-through assets into `dist/assets/img/`

The full production build also includes the image step:

```bash
npm run build
```

## Scope and guardrails
- SVG files from `assets/img-src/` are copied as-is (no forced rasterization).
- Existing references to `assets/svg/` remain stable.
- Source images are never optimized back into `assets/img/`.
- Workflow is intentionally minimal and ready for future extension (e.g., responsive variants) without forcing it now.
