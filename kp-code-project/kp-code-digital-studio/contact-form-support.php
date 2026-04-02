<?php

declare(strict_types=1);

const CONTACT_FORM_FLASH_KEY = 'contact_form_flash';
const CONTACT_FORM_DEFAULT_REDIRECT = '/contact.html';
const CONTACT_FORM_PARTIALS_DIR = __DIR__ . '/src/partials';
const CONTACT_FORM_GUARD_SESSION_KEY = 'contact_form_guard';
const CONTACT_FORM_GUARD_MIN_SECONDS = 3;
const CONTACT_FORM_THROTTLE_WINDOW_SECONDS = 600;
const CONTACT_FORM_THROTTLE_MAX_ATTEMPTS = 3;
const CONTACT_FORM_THROTTLE_DIR = 'kp-code-contact-throttle';

function contact_form_read_partial(string $filename): string
{
  $path = CONTACT_FORM_PARTIALS_DIR . '/' . $filename;

  if (!is_file($path)) {
    throw new RuntimeException(sprintf('Brak partiala: %s', $filename));
  }

  $contents = file_get_contents($path);
  if ($contents === false) {
    throw new RuntimeException(sprintf('Nie udało się odczytać partiala: %s', $filename));
  }

  return $contents;
}

function contact_form_get_active_nav_key(string $relativeFilePath): ?string
{
  $normalizedPath = '/' . str_replace('\\', '/', $relativeFilePath);

  if ($normalizedPath === '/index.html') {
    return 'start';
  }

  if ($normalizedPath === '/about.html') {
    return 'about';
  }

  if ($normalizedPath === '/contact.html') {
    return 'contact';
  }

  if ($normalizedPath === '/services.html' || str_starts_with($normalizedPath, '/services/')) {
    return 'services';
  }

  if ($normalizedPath === '/projects.html' || str_starts_with($normalizedPath, '/projects/')) {
    return 'projects';
  }

  return null;
}

function contact_form_render_header_partial(string $headerTemplate, string $relativeFilePath): string
{
  $activeNavKey = contact_form_get_active_nav_key($relativeFilePath);
  $navCurrentTokens = [
    '{{NAV_START_CURRENT}}' => $activeNavKey === 'start' ? ' aria-current="page"' : '',
    '{{NAV_ABOUT_CURRENT}}' => $activeNavKey === 'about' ? ' aria-current="page"' : '',
    '{{NAV_SERVICES_CURRENT}}' => $activeNavKey === 'services' ? ' aria-current="page"' : '',
    '{{NAV_PROJECTS_CURRENT}}' => $activeNavKey === 'projects' ? ' aria-current="page"' : '',
    '{{NAV_CONTACT_CURRENT}}' => $activeNavKey === 'contact' ? ' aria-current="page"' : '',
  ];

  return strtr($headerTemplate, $navCurrentTokens);
}

function contact_form_assemble_shell(string $html, string $relativeFilePath): string
{
  $themeBootstrap = contact_form_read_partial('theme-bootstrap.html');
  $header = contact_form_read_partial('header.html');
  $footer = contact_form_read_partial('footer.html');

  return strtr($html, [
    '<!-- @include:theme-bootstrap -->' => $themeBootstrap,
    '<!-- @include:header -->' => contact_form_render_header_partial($header, $relativeFilePath),
    '<!-- @include:footer -->' => $footer,
  ]);
}

function contact_form_start_session(): void
{
  if (session_status() === PHP_SESSION_NONE) {
    session_start();
  }
}

function contact_form_create_guard_token(): string
{
  try {
    return bin2hex(random_bytes(16));
  } catch (Throwable $exception) {
    return hash('sha256', uniqid('contact-form-guard', true));
  }
}

function contact_form_issue_timing_guard(): array
{
  contact_form_start_session();

  $guard = [
    'token' => contact_form_create_guard_token(),
    'issued_at' => time(),
  ];

  $_SESSION[CONTACT_FORM_GUARD_SESSION_KEY] = $guard;

  return $guard;
}

function contact_form_get_client_identifier(): string
{
  $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';

  if (is_string($remoteAddr)) {
    $remoteAddr = trim($remoteAddr);
  }

  if ($remoteAddr !== '' && filter_var($remoteAddr, FILTER_VALIDATE_IP) !== false) {
    return $remoteAddr;
  }

  return 'unknown-client';
}

function contact_form_validate_timing_guard(array $source): array
{
  contact_form_start_session();

  $guard = $_SESSION[CONTACT_FORM_GUARD_SESSION_KEY] ?? null;
  $token = $source['form_guard_token'] ?? '';

  if (!is_array($guard)) {
    return ['ok' => false, 'reason' => 'missing_guard_session'];
  }

  $expectedToken = $guard['token'] ?? '';
  $issuedAt = (int) ($guard['issued_at'] ?? 0);

  if (!is_string($token) || trim($token) === '') {
    return ['ok' => false, 'reason' => 'missing_guard_token'];
  }

  if (!is_string($expectedToken) || $expectedToken === '' || !hash_equals($expectedToken, trim($token))) {
    return ['ok' => false, 'reason' => 'invalid_guard_token'];
  }

  if ($issuedAt <= 0) {
    return ['ok' => false, 'reason' => 'invalid_guard_timestamp'];
  }

  if ((time() - $issuedAt) < CONTACT_FORM_GUARD_MIN_SECONDS) {
    return ['ok' => false, 'reason' => 'submitted_too_fast'];
  }

  return ['ok' => true, 'reason' => null];
}

function contact_form_get_throttle_dir(): string
{
  return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . CONTACT_FORM_THROTTLE_DIR;
}

function contact_form_check_rate_limit(string $clientIdentifier): array
{
  $directory = contact_form_get_throttle_dir();

  if (!is_dir($directory) && !@mkdir($directory, 0775, true) && !is_dir($directory)) {
    return ['ok' => true, 'reason' => 'throttle_storage_unavailable'];
  }

  $filePath = $directory . DIRECTORY_SEPARATOR . hash('sha256', $clientIdentifier) . '.json';
  $handle = @fopen($filePath, 'c+');

  if ($handle === false) {
    return ['ok' => true, 'reason' => 'throttle_file_unavailable'];
  }

  $now = time();
  $windowStart = $now - CONTACT_FORM_THROTTLE_WINDOW_SECONDS;
  $timestamps = [];

  try {
    if (!flock($handle, LOCK_EX)) {
      return ['ok' => true, 'reason' => 'throttle_lock_unavailable'];
    }

    $raw = stream_get_contents($handle);
    if (is_string($raw) && trim($raw) !== '') {
      $decoded = json_decode($raw, true);
      if (is_array($decoded)) {
        $timestamps = array_values(
          array_filter(
            $decoded,
            static fn ($value): bool => is_int($value) || ctype_digit((string) $value),
          ),
        );
      }
    }

    $timestamps = array_values(
      array_filter(
        array_map('intval', $timestamps),
        static fn (int $timestamp): bool => $timestamp >= $windowStart,
      ),
    );

    if (count($timestamps) >= CONTACT_FORM_THROTTLE_MAX_ATTEMPTS) {
      ftruncate($handle, 0);
      rewind($handle);
      fwrite($handle, json_encode($timestamps, JSON_UNESCAPED_SLASHES));
      fflush($handle);

      return ['ok' => false, 'reason' => 'rate_limited'];
    }

    $timestamps[] = $now;

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($timestamps, JSON_UNESCAPED_SLASHES));
    fflush($handle);

    return ['ok' => true, 'reason' => null];
  } finally {
    flock($handle, LOCK_UN);
    fclose($handle);
  }
}

function contact_form_abuse_error_message(): string
{
  return 'Nie udało się wysłać wiadomości. Odczekaj chwilę i spróbuj ponownie.';
}

function contact_form_log_abuse_event(string $reason, string $clientIdentifier): void
{
  error_log(sprintf('[contact-form] blocked submission: %s (%s)', $reason, $clientIdentifier));
}

function contact_form_pull_flash(): array
{
  contact_form_start_session();

  $flash = $_SESSION[CONTACT_FORM_FLASH_KEY] ?? [];
  unset($_SESSION[CONTACT_FORM_FLASH_KEY]);

  return is_array($flash) ? $flash : [];
}

function contact_form_set_flash(array $flash): void
{
  contact_form_start_session();
  $_SESSION[CONTACT_FORM_FLASH_KEY] = $flash;
}

function contact_form_is_json_request(): bool
{
  $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
  $requestedWith = strtolower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));

  return contact_form_contains($accept, 'application/json') || $requestedWith === 'xmlhttprequest';
}

function contact_form_json_response(int $statusCode, array $payload): void
{
  http_response_code($statusCode);
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit();
}

function contact_form_redirect(string $path): void
{
  header('Location: ' . $path, true, 303);
  exit();
}

function contact_form_resolve_redirect_path(array $config = []): string
{
  $redirectPath = $config['redirect_path'] ?? CONTACT_FORM_DEFAULT_REDIRECT;

  if (!is_string($redirectPath) || trim($redirectPath) === '') {
    return CONTACT_FORM_DEFAULT_REDIRECT;
  }

  return $redirectPath;
}

function contact_form_success_message(): string
{
  return 'Dziękuję! Wiadomość została wysłana. Wrócę z odpowiedzią tak szybko, jak to możliwe.';
}

function contact_form_error_message(): string
{
  return 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę lub napisz bezpośrednio na kontakt@kp-code.pl.';
}

function contact_form_method_error_message(): string
{
  return 'Nieprawidłowa metoda wysyłki formularza.';
}

function contact_form_normalize_input(array $source): array
{
  $normalized = [];

  foreach (['name', 'email', 'message', 'company'] as $field) {
    $value = $source[$field] ?? '';
    $normalized[$field] = is_string($value) ? trim($value) : '';
  }

  return $normalized;
}

function contact_form_validate_input(array $input): array
{
  $errors = [];
  $sanitized = [
    'name' => trim((string) ($input['name'] ?? '')),
    'email' => trim((string) ($input['email'] ?? '')),
    'message' => trim((string) ($input['message'] ?? '')),
    'company' => trim((string) ($input['company'] ?? '')),
  ];

  if ($sanitized['name'] === '') {
    $errors['name'] = 'To pole jest wymagane.';
  }

  if ($sanitized['email'] === '') {
    $errors['email'] = 'To pole jest wymagane.';
  } elseif (filter_var($sanitized['email'], FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'Podaj poprawny adres e-mail.';
  }

  if ($sanitized['message'] === '') {
    $errors['message'] = 'To pole jest wymagane.';
  } elseif (contact_form_length($sanitized['message']) < 10) {
    $errors['message'] = 'Wiadomość powinna mieć co najmniej 10 znaków.';
  }

  return [$sanitized, $errors];
}

function contact_form_load_config(string $configPath): array
{
  if (!is_file($configPath)) {
    throw new RuntimeException('Brak pliku konfiguracyjnego formularza.');
  }

  $config = require $configPath;

  if (!is_array($config)) {
    throw new RuntimeException('Plik konfiguracyjny formularza musi zwracać tablicę.');
  }

  $defaults = [
    'redirect_path' => CONTACT_FORM_DEFAULT_REDIRECT,
    'smtp_secure' => 'tls',
    'from_name' => 'KP_Code Digital Studio',
  ];

  $config = array_merge($defaults, $config);

  foreach ($config as $key => $value) {
    if (is_string($value)) {
      $config[$key] = trim($value);
    }
  }

  foreach (
    [
      'smtp_host',
      'smtp_port',
      'smtp_username',
      'smtp_password',
      'from_email',
      'from_name',
      'recipient_email',
    ]
    as $requiredKey
  ) {
    if (!isset($config[$requiredKey]) || trim((string) $config[$requiredKey]) === '') {
      throw new RuntimeException(sprintf('Brakuje wymaganej konfiguracji: %s', $requiredKey));
    }
  }

  $config['smtp_port'] = (int) $config['smtp_port'];
  if ($config['smtp_port'] < 1) {
    throw new RuntimeException('Nieprawidłowa konfiguracja: smtp_port.');
  }

  $config['smtp_secure'] = strtolower((string) $config['smtp_secure']);
  $config['redirect_path'] = contact_form_resolve_redirect_path($config);

  return $config;
}

function contact_form_build_payload(
  bool $ok,
  string $message,
  array $errors = [],
  array $old = [],
): array {
  return [
    'ok' => $ok,
    'message' => $message,
    'errors' => $errors,
    'old' => $old,
  ];
}

function contact_form_respond(
  int $statusCode,
  bool $ok,
  string $message,
  array $errors = [],
  array $old = [],
  string $redirectPath = CONTACT_FORM_DEFAULT_REDIRECT,
): void {
  $payload = contact_form_build_payload($ok, $message, $errors, $old);

  if (contact_form_is_json_request()) {
    contact_form_json_response($statusCode, $payload);
  }

  contact_form_set_flash([
    'status' => $ok ? 'success' : 'error',
    'message' => $message,
    'errors' => $errors,
    'old' => $old,
  ]);

  contact_form_redirect($redirectPath);
}

function contact_form_contains(string $haystack, string $needle): bool
{
  return $needle !== '' && strpos($haystack, $needle) !== false;
}

function contact_form_length(string $value): int
{
  if (function_exists('mb_strlen')) {
    return mb_strlen($value);
  }

  return strlen($value);
}
