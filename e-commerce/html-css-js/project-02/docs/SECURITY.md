# Security posture (Demo mode)

KP_Code Digital Vault działa obecnie jako projekt frontend-only. To oznacza, że:

- Sesja jest trzymana po stronie klienta (localStorage) wyłącznie do celów demonstracyjnych.
- Role i uprawnienia nie są weryfikowane na backendzie.
- Panel administracyjny jest celowo zablokowany i wymaga prawdziwej weryfikacji po stronie serwera.

## Co jest wymagane dla trybu produkcyjnego

Aby zapewnić realne bezpieczeństwo należy wdrożyć backend, który:

- uwierzytelnia użytkowników (np. JWT + sesje),
- przechowuje role na serwerze,
- weryfikuje dostęp do tras i zasobów po stronie serwera.

Wersja demo nie powinna być używana jako zabezpieczenie produkcyjne.
