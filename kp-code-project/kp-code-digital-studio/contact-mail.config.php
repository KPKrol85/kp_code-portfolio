<?php

declare(strict_types=1);

$defaults = [
  'smtp_secure' => 'tls',
  'from_name' => 'KP_Code Digital Studio',
  'redirect_path' => '/contact.html',
];

$privateConfigPath = __DIR__ . '/contact-mail.config.local.php';
$privateConfig = [];

if (is_file($privateConfigPath)) {
  $privateConfig = require $privateConfigPath;

  if (!is_array($privateConfig)) {
    throw new RuntimeException('Prywatny plik konfiguracyjny formularza musi zwracać tablicę.');
  }
}

$readEnv = static function (string $name): ?string {
  $value = getenv($name);
  if (is_string($value) && trim($value) !== '') {
    return trim($value);
  }

  if (isset($_ENV[$name]) && is_string($_ENV[$name]) && trim($_ENV[$name]) !== '') {
    return trim($_ENV[$name]);
  }

  if (isset($_SERVER[$name]) && is_string($_SERVER[$name]) && trim($_SERVER[$name]) !== '') {
    return trim($_SERVER[$name]);
  }

  return null;
};

$envConfig = [];
$envMap = [
  'smtp_host' => 'KP_CODE_SMTP_HOST',
  'smtp_port' => 'KP_CODE_SMTP_PORT',
  'smtp_username' => 'KP_CODE_SMTP_USERNAME',
  'smtp_password' => 'KP_CODE_SMTP_PASSWORD',
  'smtp_secure' => 'KP_CODE_SMTP_SECURE',
  'from_email' => 'KP_CODE_MAIL_FROM_EMAIL',
  'from_name' => 'KP_CODE_MAIL_FROM_NAME',
  'recipient_email' => 'KP_CODE_MAIL_RECIPIENT_EMAIL',
  'redirect_path' => 'KP_CODE_CONTACT_REDIRECT_PATH',
];

foreach ($envMap as $configKey => $envName) {
  $value = $readEnv($envName);

  if ($value !== null) {
    $envConfig[$configKey] = $value;
  }
}

return array_merge($defaults, $privateConfig, $envConfig);
