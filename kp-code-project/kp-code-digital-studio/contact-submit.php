<?php

declare(strict_types=1);

require_once __DIR__ . '/contact-form-support.php';

$configPath = __DIR__ . '/contact-mail.config.php';

try {
  $config = contact_form_load_config($configPath);
} catch (Throwable $exception) {
  contact_form_respond(
    500,
    false,
    contact_form_error_message(),
    [],
    [],
    CONTACT_FORM_DEFAULT_REDIRECT,
  );
}

$redirectPath = contact_form_resolve_redirect_path($config);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  contact_form_respond(405, false, contact_form_method_error_message(), [], [], $redirectPath);
}

$input = contact_form_normalize_input($_POST);

if ($input['company'] !== '') {
  contact_form_respond(200, true, contact_form_success_message(), [], [], $redirectPath);
}

$timingGuard = contact_form_validate_timing_guard($_POST);
if (!$timingGuard['ok']) {
  $clientIdentifier = contact_form_get_client_identifier();
  contact_form_log_abuse_event((string) $timingGuard['reason'], $clientIdentifier);

  contact_form_respond(
    429,
    false,
    contact_form_abuse_error_message(),
    [],
    [
      'name' => $input['name'],
      'email' => $input['email'],
      'message' => $input['message'],
      'service' => $input['service'],
    ],
    $redirectPath,
  );
}

$clientIdentifier = contact_form_get_client_identifier();
$rateLimit = contact_form_check_rate_limit($clientIdentifier);
if (!$rateLimit['ok']) {
  contact_form_log_abuse_event((string) $rateLimit['reason'], $clientIdentifier);

  contact_form_respond(
    429,
    false,
    contact_form_abuse_error_message(),
    [],
    [
      'name' => $input['name'],
      'email' => $input['email'],
      'message' => $input['message'],
      'service' => $input['service'],
    ],
    $redirectPath,
  );
}

[$sanitized, $errors] = contact_form_validate_input($input);
$oldInput = [
  'name' => $sanitized['name'],
  'email' => $sanitized['email'],
  'message' => $sanitized['message'],
  'service' => $sanitized['service'],
];

if ($errors !== []) {
  contact_form_respond(
    422,
    false,
    'Sprawdź formularz i popraw oznaczone pola.',
    $errors,
    $oldInput,
    $redirectPath,
  );
}

$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!is_file($autoloadPath)) {
  contact_form_respond(500, false, contact_form_error_message(), [], $oldInput, $redirectPath);
}

require_once $autoloadPath;

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
  contact_form_respond(500, false, contact_form_error_message(), [], $oldInput, $redirectPath);
}

try {
  $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
  $mail->CharSet = 'UTF-8';
  $mail->isSMTP();
  $mail->Host = (string) $config['smtp_host'];
  $mail->Port = (int) $config['smtp_port'];
  $mail->SMTPAuth = true;
  $mail->Username = (string) $config['smtp_username'];
  $mail->Password = (string) $config['smtp_password'];

  if (($config['smtp_secure'] ?? '') !== '') {
    $mail->SMTPSecure = (string) $config['smtp_secure'];
  }

  $mail->setFrom((string) $config['from_email'], (string) $config['from_name']);
  $mail->addAddress((string) $config['recipient_email']);
  $mail->addReplyTo($sanitized['email'], $sanitized['name']);
  $mail->Subject = 'Nowa wiadomość z formularza kontaktowego kp-code.pl';
  $mail->isHTML(true);

  $safeName = htmlspecialchars($sanitized['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $safeEmail = htmlspecialchars($sanitized['email'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $safeService = htmlspecialchars($sanitized['service'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $safeMessageHtml = nl2br(
    htmlspecialchars($sanitized['message'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
  );
  $safeMessageText = str_replace(["\r\n", "\r"], "\n", $sanitized['message']);
  $serviceHtml =
    $sanitized['service'] !== '' ? sprintf('<p><strong>Usługa:</strong> %s</p>', $safeService) : '';
  $serviceText = $sanitized['service'] !== '' ? "Usługa: {$sanitized['service']}\n\n" : '';

  $mail->Body = <<<HTML
  <h2>Nowa wiadomość z formularza kontaktowego</h2>
  <p><strong>Imię i nazwisko:</strong> {$safeName}</p>
  <p><strong>E-mail:</strong> {$safeEmail}</p>
  {$serviceHtml}
  <p><strong>Wiadomość:</strong></p>
  <p>{$safeMessageHtml}</p>
  HTML;

  $mail->AltBody = <<<TEXT
  Nowa wiadomość z formularza kontaktowego

  Imię i nazwisko: {$sanitized['name']}
  E-mail: {$sanitized['email']}
  {$serviceText}

  Wiadomość:
  {$safeMessageText}
  TEXT;

  $mail->send();
} catch (Throwable $exception) {
  contact_form_respond(500, false, contact_form_error_message(), [], $oldInput, $redirectPath);
}

contact_form_respond(200, true, contact_form_success_message(), [], [], $redirectPath);
