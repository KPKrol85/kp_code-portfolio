# Pipeline obrazów

## 1) Dodawanie plików źródłowych
- Wrzucaj obrazy do: `assets/img/img_src/`.
- Możesz zachować podfoldery (np. `assets/img/img_src/projects/hero.jpg`).
- Dozwolone formaty źródeł: JPG, JPEG, PNG.
- SVG nie są przetwarzane.

## 2) Budowanie wariantów
Zainstaluj zależności i uruchom build:

```
npm install
npm run img:build
```

Skrypt odczytuje `image.config.json` i generuje warianty do `assets/img/img_optimized/`.

## 3) Czyszczenie outputu
Usuwa tylko zawartość katalogu output:

```
npm run img:clean
```

## 4) Używanie wyników w HTML
Przykład z `picture` (AVIF + WebP + fallback JPG):

```html
<picture>
  <source type="image/avif" srcset="/assets/img/img_optimized/hero-480.avif 480w, /assets/img/img_optimized/hero-768.avif 768w, /assets/img/img_optimized/hero-1024.avif 1024w, /assets/img/img_optimized/hero-1440.avif 1440w" sizes="(max-width: 768px) 100vw, 768px">
  <source type="image/webp" srcset="/assets/img/img_optimized/hero-480.webp 480w, /assets/img/img_optimized/hero-768.webp 768w, /assets/img/img_optimized/hero-1024.webp 1024w, /assets/img/img_optimized/hero-1440.webp 1440w" sizes="(max-width: 768px) 100vw, 768px">
  <img src="/assets/img/img_optimized/hero-768.jpg" alt="Opis" loading="lazy" decoding="async">
</picture>
```

Uwaga:
- Dla PNG z przezroczystością generowane są tylko AVIF/WebP (bez JPG).
- Struktura podfolderów jest zachowana (np. `img_src/projects/a.jpg` -> `img_optimized/projects/a-768.webp`).
