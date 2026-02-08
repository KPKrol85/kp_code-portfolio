# Images Pipeline – KP_Code Digital Vault

## 🇵🇱 Wersja polska

### Wprowadzenie

Niniejszy dokument opisuje pipeline optymalizacji obrazów stosowany w platformie KP_Code Digital Vault.
Celem pipeline’u jest zapewnienie wysokiej wydajności (performance), przewidywalnego zachowania layoutu
(ograniczenie CLS) oraz długoterminowej skalowalności zasobów graficznych w całym projekcie.

Pipeline stanowi integralny element architektury frontendowej platformy i wspiera strategię jakości,
dostępności oraz stabilności wizualnej interfejsu.

---

### Struktura katalogów źródłowych i generowanych

- Oryginalne obrazy należy umieszczać w katalogu `assets/img/_src/`.
- Wygenerowane pliki wynikowe zapisywane są w katalogu `assets/img/_gen/`.
- Katalog `_gen` zawiera wyłącznie zasoby generowane automatycznie (warianty WebP oraz AVIF).

Takie rozdzielenie:
- upraszcza utrzymanie repozytorium,
- jednoznacznie oddziela źródła od artefaktów generowanych,
- umożliwia szybkie czyszczenie i ponowne generowanie zasobów.

---

### Dostępne polecenia

- `npm run img:build`
  Generuje responsywne warianty obrazów w formatach WebP oraz AVIF oraz plik `manifest.json`.

- `npm run img:clean`
  Usuwa wszystkie wygenerowane zasoby z katalogu `_gen` (z zachowaniem pliku `.gitkeep`).

---

### Zalecany sposób użycia w HTML

Pipeline zakłada jawne deklarowanie:
- rozmiarów obrazów (`width`, `height`),
- wariantów responsywnych (`srcset`, `sizes`),
- nowoczesnych formatów (AVIF, WebP),
- strategii ładowania (`loading="lazy"`).

Przykład użycia:

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
  <img
    src="assets/img/_gen/hero-w640.webp"
    alt="Hero"
    width="640"
    height="360"
    loading="lazy"
  />
</picture>

---

### Cele pipeline’u

- poprawa wydajności ładowania strony (LCP),
- ograniczenie przesunięć layoutu (CLS),
- standaryzacja sposobu użycia obrazów w całym projekcie,
- gotowość do skalowania platformy i dalszej rozbudowy treści.

---

## 🇬🇧 English version

### Introduction

This document describes the image optimization pipeline used in the KP_Code Digital Vault platform.
The goal of this pipeline is to ensure high performance, predictable layout behavior (CLS reduction),
and long-term scalability of visual assets across the project.

The pipeline is an integral part of the frontend architecture and supports the platform’s quality,
accessibility, and visual stability strategy.

---

### Source and generated folder structure

- Original images must be placed in `assets/img/_src/`.
- Generated outputs are written to `assets/img/_gen/`.
- The `_gen` directory contains only automatically generated assets (WebP and AVIF variants).

This separation:
- simplifies repository maintenance,
- clearly distinguishes source files from generated artifacts,
- enables fast cleanup and regeneration of assets.

---

### Available commands

- `npm run img:build`
  Generates responsive image variants in WebP and AVIF formats and a `manifest.json` file.

- `npm run img:clean`
  Removes all generated assets from the `_gen` directory (while keeping the `.gitkeep` file).

---

### Recommended HTML usage

The pipeline enforces explicit declaration of:
- intrinsic image dimensions (`width`, `height`),
- responsive variants (`srcset`, `sizes`),
- modern image formats (AVIF, WebP),
- loading strategy (`loading="lazy"`).

Example usage:

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
  <img
    src="assets/img/_gen/hero-w640.webp"
    alt="Hero"
    width="640"
    height="360"
    loading="lazy"
  />
</picture>

---

### Pipeline goals

- improved page load performance (LCP),
- reduced layout shifts (CLS),
- standardized image usage across the platform,
- readiness for long-term platform scaling and content growth.

The image pipeline is an integral part of the KP_Code Digital Vault quality, accessibility,
and performance strategy.
