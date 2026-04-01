<?php

declare(strict_types=1);

const CONTACT_FORM_FLASH_KEY = 'contact_form_flash';
const CONTACT_FORM_DEFAULT_REDIRECT = '/contact.html';

function contact_form_start_session(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
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
    exit;
}

function contact_form_redirect(string $path): void
{
    header('Location: ' . $path, true, 303);
    exit;
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

    foreach (['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'from_email', 'from_name', 'recipient_email'] as $requiredKey) {
        if (!isset($config[$requiredKey]) || trim((string) $config[$requiredKey]) === '') {
            throw new RuntimeException(sprintf('Brakuje wymaganej konfiguracji: %s', $requiredKey));
        }
    }

    $config['smtp_port'] = (int) $config['smtp_port'];
    $config['smtp_secure'] = strtolower((string) $config['smtp_secure']);
    $config['redirect_path'] = contact_form_resolve_redirect_path($config);

    return $config;
}

function contact_form_build_payload(bool $ok, string $message, array $errors = [], array $old = []): array
{
    return [
        'ok' => $ok,
        'message' => $message,
        'errors' => $errors,
        'old' => $old,
    ];
}

function contact_form_respond(int $statusCode, bool $ok, string $message, array $errors = [], array $old = [], string $redirectPath = CONTACT_FORM_DEFAULT_REDIRECT): void
{
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
