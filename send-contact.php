<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'andy@andreasboehler.com';
const CONTACT_SENDER = 'andy@andreasboehler.com';
const MAX_REQUEST_BYTES = 100000;

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requestedWith = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';

    return stripos($accept, 'application/json') !== false
        || strcasecmp($requestedWith, 'XMLHttpRequest') === 0;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');

    if (wants_json()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (($payload['ok'] ?? false) === true) {
        $type = ($payload['form_type'] ?? '') === 'wedding' ? 'wedding' : 'project';
        header('Location: danke.html?anfrage=' . rawurlencode($type), true, 303);
        exit;
    }

    header('Content-Type: text/plain; charset=UTF-8');
    echo $payload['message'] ?? 'Die Anfrage konnte nicht verarbeitet werden.';
    exit;
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function text_slice(string $value, int $maxLength): string
{
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength, 'UTF-8')
        : substr($value, 0, $maxLength);
}

function clean_text($value, int $maxLength = 4000): string
{
    if (!is_scalar($value)) {
        return '';
    }

    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    $text = preg_replace('/[ \t]+/u', ' ', $text) ?? '';
    $text = preg_replace('/\R{3,}/u', "\n\n", $text) ?? '';

    return text_length($text) > $maxLength ? text_slice($text, $maxLength) : $text;
}

function field_values(string $key, int $maxLength = 4000): array
{
    if (!array_key_exists($key, $_POST)) {
        return [];
    }

    $rawValues = is_array($_POST[$key]) ? $_POST[$key] : [$_POST[$key]];
    $values = [];

    foreach ($rawValues as $value) {
        $clean = clean_text($value, $maxLength);

        if ($clean !== '') {
            $values[] = $clean;
        }
    }

    return array_values(array_unique($values));
}

function first_value(string $key, int $maxLength = 4000): string
{
    $values = field_values($key, $maxLength);

    return $values[0] ?? '';
}

function encoded_subject(string $subject): string
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, [
        'ok' => false,
        'message' => 'Diese Adresse akzeptiert ausschließlich Formularanfragen.',
    ]);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, [
        'ok' => false,
        'message' => 'Die Anfrage ist zu groß. Bitte kürze die Nachricht.',
    ]);
}

$fetchSite = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? ''));
if ($fetchSite === 'cross-site') {
    respond(403, [
        'ok' => false,
        'message' => 'Die Anfrage konnte aus Sicherheitsgründen nicht angenommen werden.',
    ]);
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $allowedHosts = [
        'andreasboehler.com',
        'www.andreasboehler.com',
        'staging.andreasboehler.com',
    ];

    if (!in_array($originHost, $allowedHosts, true)) {
        respond(403, [
            'ok' => false,
            'message' => 'Die Anfrage konnte aus Sicherheitsgründen nicht angenommen werden.',
        ]);
    }
}

if (first_value('website', 200) !== '') {
    respond(200, [
        'ok' => true,
        'form_type' => 'project',
    ]);
}

$startedAt = (int) first_value('form_started_at', 20);
if ($startedAt > 0) {
    $elapsed = time() - $startedAt;

    if ($elapsed < 2 || $elapsed > 43200) {
        respond(429, [
            'ok' => false,
            'message' => 'Bitte lade das Formular neu und versuche es noch einmal.',
        ]);
    }
}

$formType = first_value('form_type', 30);
$isWedding = $formType === 'wedding';
$isProject = $formType === 'project';

if (!$isWedding && !$isProject) {
    respond(422, [
        'ok' => false,
        'message' => 'Das Formular konnte nicht eindeutig zugeordnet werden.',
    ]);
}

$nameKey = $isWedding ? 'Namen' : 'Name';
$name = first_value($nameKey, 160);
$email = first_value('E-Mail', 254);
$consent = first_value('Datenschutz', 40);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $consent !== 'Akzeptiert') {
    respond(422, [
        'ok' => false,
        'message' => 'Bitte prüfe Name, E-Mail-Adresse und Datenschutz-Zustimmung.',
    ]);
}

$projectFields = [
    'Referenzprojekt' => 300,
    'Projekttyp' => 160,
    'Ziel' => 240,
    'Kanäle' => 160,
    'Timing' => 160,
    'Budget' => 160,
    'Status' => 240,
    'Look' => 160,
    'Name' => 160,
    'E-Mail' => 254,
    'Notizen' => 5000,
];
$weddingFields = [
    'Namen' => 160,
    'E-Mail' => 254,
    'Hochzeitsdatum' => 40,
    'Ort / Location' => 240,
    'Paket' => 160,
    'Trauung' => 160,
    'Telefon' => 80,
    'Gästezahl' => 20,
    'Nachricht' => 5000,
];
$fields = $isWedding ? $weddingFields : $projectFields;
$bodyLines = [
    $isWedding ? 'Neue Hochzeitsanfrage über andreasboehler.com' : 'Neue Projektanfrage über andreasboehler.com',
    '',
];

foreach ($fields as $label => $maxLength) {
    $values = field_values($label, $maxLength);

    if ($values !== []) {
        $bodyLines[] = $label . ': ' . implode(', ', $values);
    }
}

$bodyLines[] = '';
$bodyLines[] = 'Datenschutz: Zustimmung im Formular erteilt';
$bodyLines[] = 'Eingang: ' . gmdate('Y-m-d H:i:s') . ' UTC';

$location = first_value('Ort / Location', 240);
$date = first_value('Hochzeitsdatum', 40);
$subject = $isWedding
    ? trim('Hochzeitsanfrage' . ($date !== '' ? ' · ' . $date : '') . ($location !== '' ? ' · ' . $location : ''))
    : 'Projektanfrage von ' . $name;
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Andreas Boehler Website <' . CONTACT_SENDER . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];
$testMode = getenv('FORM_TEST_MODE') === '1';
$sent = $testMode || @mail(
    CONTACT_RECIPIENT,
    encoded_subject($subject),
    implode("\r\n", $bodyLines),
    implode("\r\n", $headers)
);

if (!$sent) {
    respond(503, [
        'ok' => false,
        'message' => 'Der E-Mail-Versand ist vorübergehend nicht erreichbar.',
    ]);
}

respond(200, [
    'ok' => true,
    'form_type' => $formType,
]);
