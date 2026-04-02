<?php

declare(strict_types=1);

/*
 * Copy this file to "contact-mail.config.local.php" for a server-only fallback
 * when environment variables are not available to PHP. Do not commit the local file.
 *
 * Preferred env variables:
 * - KP_CODE_SMTP_HOST
 * - KP_CODE_SMTP_PORT
 * - KP_CODE_SMTP_USERNAME
 * - KP_CODE_SMTP_PASSWORD
 * - KP_CODE_SMTP_SECURE
 * - KP_CODE_MAIL_FROM_EMAIL
 * - KP_CODE_MAIL_FROM_NAME
 * - KP_CODE_MAIL_RECIPIENT_EMAIL
 * - KP_CODE_CONTACT_REDIRECT_PATH
 */

return [
  'smtp_host' => 'smtp.example.com',
  'smtp_port' => 587,
  'smtp_username' => 'mailbox@example.com',
  'smtp_password' => 'REPLACE_WITH_REAL_PASSWORD',
  'smtp_secure' => 'tls',
  'from_email' => 'mailbox@example.com',
  'from_name' => 'KP_Code Digital Studio',
  'recipient_email' => 'contact@example.com',
  'redirect_path' => '/contact.html',
];
