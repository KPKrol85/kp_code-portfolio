# Pakiety – przypisanie materiałów premium

## Źródło prawdy
Pakiety i ich anchor linki są zdefiniowane w `js/data/packages.js` i tylko stamtąd pobieramy hrefy do CTA premium.

## packageKey w materiałach
W `js/data/materials.js` dodaj pole `packageKey` dla materiałów premium:

- `start`
- `regular`
- `intensive`

Jeśli materiał premium nie ma sensownego dopasowania, ustaw `packageKey: 'regular'`.
