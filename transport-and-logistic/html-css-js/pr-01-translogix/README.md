# TransLogix

## Image optimization

- Wrzuć obrazy źródłowe do `src_img` (obsługiwane: `.jpg`, `.jpeg`, `.png`, także w podfolderach).
- Uruchom optymalizację poleceniem:

```bash
npm run img:opt
```

- Wygenerowane pliki trafiają do `opt_img` z zachowaniem tej samej struktury katalogów.
- Dla każdego obrazu skrypt tworzy dwa formaty: `AVIF` oraz `WEBP`.
- Skrypt działa incrementalnie: jeżeli plik wyjściowy jest nowszy od wejściowego, konwersja jest pomijana.
- Jeśli folder `src_img` nie istnieje, skrypt kończy się kodem `0` i komunikatem „Nothing to optimize”.
- Przy błędach konwersji skrypt zwraca kod `1`.
