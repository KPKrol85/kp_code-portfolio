<?php

declare(strict_types=1);

require_once __DIR__ . '/contact-form-support.php';

contact_form_start_session();
$flash = contact_form_pull_flash();

function contact_find_first(DOMXPath $xpath, string $query): ?DOMElement
{
    $nodes = $xpath->query($query);

    if ($nodes === false || $nodes->length === 0) {
        return null;
    }

    $node = $nodes->item(0);

    return $node instanceof DOMElement ? $node : null;
}

function contact_add_class(DOMElement $element, string $className): void
{
    $classes = preg_split('/\s+/', trim($element->getAttribute('class'))) ?: [];

    if (!in_array($className, $classes, true)) {
        $classes[] = $className;
    }

    $element->setAttribute('class', trim(implode(' ', array_filter($classes))));
}

function contact_remove_hidden(DOMElement $element): void
{
    if ($element->hasAttribute('hidden')) {
        $element->removeAttribute('hidden');
    }
}

function contact_set_text(DOMDocument $dom, DOMElement $element, string $text): void
{
    while ($element->firstChild) {
        $element->removeChild($element->firstChild);
    }

    $element->appendChild($dom->createTextNode($text));
}

$templatePath = __DIR__ . '/contact.html';
$template = is_file($templatePath) ? file_get_contents($templatePath) : false;

if ($template === false) {
    http_response_code(500);
    echo 'Brak szablonu strony kontaktowej.';
    exit;
}

$dom = new DOMDocument('1.0', 'UTF-8');
libxml_use_internal_errors(true);
$dom->loadHTML('<?xml encoding="UTF-8">' . $template, LIBXML_NOWARNING | LIBXML_NOERROR);
libxml_clear_errors();

foreach ($dom->childNodes as $childNode) {
    if ($childNode instanceof DOMProcessingInstruction) {
        $dom->removeChild($childNode);
        break;
    }
}

$xpath = new DOMXPath($dom);

$oldInput = is_array($flash['old'] ?? null) ? $flash['old'] : [];
$errors = is_array($flash['errors'] ?? null) ? $flash['errors'] : [];
$message = is_string($flash['message'] ?? null) ? $flash['message'] : '';
$status = is_string($flash['status'] ?? null) ? $flash['status'] : '';

foreach (['name', 'email'] as $fieldName) {
    $input = contact_find_first($xpath, sprintf('//*[@id="%s"]', $fieldName));

    if ($input && isset($oldInput[$fieldName])) {
        $input->setAttribute('value', (string) $oldInput[$fieldName]);
    }
}

$messageField = contact_find_first($xpath, '//*[@id="message"]');
if ($messageField && isset($oldInput['message'])) {
    contact_set_text($dom, $messageField, (string) $oldInput['message']);
}

if ($errors !== []) {
    foreach ($errors as $fieldName => $errorMessage) {
        $field = contact_find_first(
            $xpath,
            sprintf('//*[@id="%s"]/ancestor::*[contains(concat(" ", normalize-space(@class), " "), " form__field ")][1]', $fieldName)
        );
        $input = contact_find_first($xpath, sprintf('//*[@id="%s"]', $fieldName));
        $errorElement = contact_find_first($xpath, sprintf('//*[@id="error-%s"]', $fieldName));

        if ($field) {
            contact_add_class($field, 'form__field--error');
        }

        if ($input) {
            $input->setAttribute('aria-invalid', 'true');
            $existingDescription = trim($input->getAttribute('aria-describedby'));
            $descriptionIds = array_filter(explode(' ', $existingDescription));
            $errorId = sprintf('error-%s', $fieldName);

            if (!in_array($errorId, $descriptionIds, true)) {
                $descriptionIds[] = $errorId;
            }

            $input->setAttribute('aria-describedby', implode(' ', $descriptionIds));
        }

        if ($errorElement) {
            contact_set_text($dom, $errorElement, (string) $errorMessage);
            $errorElement->setAttribute('aria-hidden', 'false');
            contact_remove_hidden($errorElement);
        }
    }

    $summary = contact_find_first($xpath, '//*[@data-form-summary]');
    if ($summary) {
        while ($summary->firstChild) {
            $summary->removeChild($summary->firstChild);
        }

        $heading = $dom->createElement('p', 'Popraw błędy w formularzu:');
        $list = $dom->createElement('ul');

        foreach ($errors as $fieldName => $errorMessage) {
            $item = $dom->createElement('li');
            $link = $dom->createElement('a', (string) $errorMessage);
            $link->setAttribute('href', '#' . $fieldName);
            $item->appendChild($link);
            $list->appendChild($item);
        }

        $summary->appendChild($heading);
        $summary->appendChild($list);
        contact_remove_hidden($summary);
    }
}

if ($message !== '') {
    $messageElement = contact_find_first($xpath, '//*[@data-form-message]');

    if ($messageElement) {
        contact_set_text($dom, $messageElement, $message);

        if ($status !== '') {
            $messageElement->setAttribute('data-state', $status);
        }
    }
}

echo $dom->saveHTML();
