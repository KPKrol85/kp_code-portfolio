import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const srcDir = join(process.cwd(), 'assets', 'src-images');
const outDir = join(process.cwd(), 'assets', 'images');

if (!existsSync(srcDir)) {
  console.error('Brak folderu assets/src-images. Dodaj źródłowe pliki PNG/JPG.');
  process.exit(1);
}

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const files = readdirSync(srcDir).filter((file) => ['.png', '.jpg', '.jpeg'].includes(extname(file).toLowerCase()));

if (!files.length) {
  console.log('Brak plików do konwersji w assets/src-images.');
  process.exit(0);
}

await Promise.all(
  files.map(async (file) => {
    const inputPath = join(srcDir, file);
    const baseName = basename(file, extname(file));
    await sharp(inputPath).webp({ quality: 80 }).toFile(join(outDir, `${baseName}.webp`));
    await sharp(inputPath).avif({ quality: 50 }).toFile(join(outDir, `${baseName}.avif`));
  })
);

console.log(`Przekonwertowano ${files.length} plików do assets/images.`);
