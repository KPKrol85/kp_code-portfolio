# Image pipeline note

## Folder roles
- `assets/img-src/` — editable raster source files (developer source of truth).
- `assets/img/` — generated, production-ready raster assets consumed by the site.
- `assets/svg/` — existing SVG assets (left unchanged by raster optimizer).

## How it works
Run the optimizer with:

```bash
npm run images:optimize
```

The script:
1. reads raster files from `assets/img-src/`
2. preserves folder structure
3. writes optimized output to `assets/img/`
4. creates deterministic variants per raster source:
   - optimized same-family output (`.jpg/.jpeg/.png/.webp/.avif`)
   - `.webp`
   - `.avif`

For a clean rebuild:

```bash
npm run images:clean
```

## Scope and guardrails
- SVG files are skipped intentionally (no forced rasterization).
- Existing references to `assets/svg/` remain stable.
- Workflow is intentionally minimal and ready for future extension (e.g., responsive variants) without forcing it now.
