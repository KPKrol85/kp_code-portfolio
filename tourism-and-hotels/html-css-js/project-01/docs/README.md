# Image Optimization Pipeline

## Folders
- Source images: `assets/img/src/`
- Optimized output: `assets/img/optimized/`

Only place original `.jpg`, `.jpeg`, `.png` files in `assets/img/src/`.  
Generated `.webp` and `.avif` files are written to `assets/img/optimized/` with the same subfolder structure.

## Commands
- `npm run img:opt` - one-time optimization run
- `npm run img:clean` - remove only `assets/img/optimized/`
- `npm run img:watch` - watch `assets/img/src/` and process changed files

## Defaults
- WebP: quality `80`
- AVIF: quality `50`, effort `4`
- Max width: `2000px` (no upscaling)

