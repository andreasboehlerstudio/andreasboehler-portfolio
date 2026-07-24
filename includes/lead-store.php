<?php
declare(strict_types=1);

const LEAD_ADMIN_ACCESS_HASH = '6965822bd23d00d6fb8dd5c07e785f743700421315e99429358a5be4e386d856';
const LEAD_IP_HASH_SALT = '0a7ee198b5d6033508dd58ebfb1d0b35c6afd326347825a9dab271616c192b40';
const LEAD_RATE_LIMIT_MAX = 5;
const LEAD_RATE_LIMIT_WINDOW = 3600;

function lead_database_path(): string
{
    $configuredPath = getenv('LEADS_DB_PATH');

    if (is_string($configuredPath) && trim($configuredPath) !== '') {
        return trim($configuredPath);
    }

    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? 'production'));
    $instance = strpos($host, 'staging.') === 0 ? 'staging' : 'production';

    return dirname(dirname(__DIR__))
        . DIRECTORY_SEPARATOR
        . 'andreasboehler-private'
        . DIRECTORY_SEPARATOR
        . $instance
        . DIRECTORY_SEPARATOR
        . 'leads.sqlite';
}

function lead_database(): PDO
{
    static $database = null;

    if ($database instanceof PDO) {
        return $database;
    }

    if (!extension_loaded('pdo_sqlite')) {
        throw new RuntimeException('Die PHP-Erweiterung PDO SQLite ist auf dem Server nicht verfügbar.');
    }

    $path = lead_database_path();
    $directory = dirname($path);

    if (
        (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory))
        || !is_writable($directory)
    ) {
        $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private-data' . DIRECTORY_SEPARATOR . 'leads.sqlite';
        $directory = dirname($path);
        if (
            (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory))
            || !is_writable($directory)
        ) {
            throw new RuntimeException('Das private Datenverzeichnis konnte nicht sicher angelegt werden.');
        }
    }

    $database = new PDO('sqlite:' . $path, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $database->exec('PRAGMA busy_timeout = 5000');
    $database->exec('PRAGMA journal_mode = WAL');
    $database->exec('PRAGMA foreign_keys = ON');
    $database->exec(
        'CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            form_type TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL DEFAULT "",
            event_date TEXT NOT NULL DEFAULT "",
            location TEXT NOT NULL DEFAULT "",
            package_name TEXT NOT NULL DEFAULT "",
            subject TEXT NOT NULL DEFAULT "",
            message TEXT NOT NULL DEFAULT "",
            payload_json TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT "new",
            notes TEXT NOT NULL DEFAULT "",
            email_sent INTEGER NOT NULL DEFAULT 0,
            source_url TEXT NOT NULL DEFAULT "",
            ip_hash TEXT NOT NULL DEFAULT ""
        )'
    );
    $database->exec('CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)');
    $database->exec('CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status, created_at DESC)');
    $database->exec('CREATE INDEX IF NOT EXISTS leads_ip_hash_idx ON leads (ip_hash, created_at DESC)');
    $cleanup = $database->prepare(
        'DELETE FROM leads
        WHERE status NOT IN ("booked", "completed")
        AND created_at < :retention_threshold'
    );
    $cleanup->execute([
        ':retention_threshold' => gmdate('c', strtotime('-12 months')),
    ]);

    return $database;
}

function lead_client_ip_hash(): string
{
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));

    return $ip === '' ? '' : hash('sha256', LEAD_IP_HASH_SALT . '|' . $ip);
}

function lead_rate_limit_reached(PDO $database, string $ipHash): bool
{
    if ($ipHash === '') {
        return false;
    }

    $statement = $database->prepare(
        'SELECT COUNT(*) FROM leads WHERE ip_hash = :ip_hash AND created_at >= :threshold'
    );
    $statement->execute([
        ':ip_hash' => $ipHash,
        ':threshold' => gmdate('c', time() - LEAD_RATE_LIMIT_WINDOW),
    ]);

    return (int) $statement->fetchColumn() >= LEAD_RATE_LIMIT_MAX;
}

function lead_insert(PDO $database, array $lead): int
{
    $now = gmdate('c');
    $statement = $database->prepare(
        'INSERT INTO leads (
            created_at, updated_at, form_type, name, email, phone, event_date,
            location, package_name, subject, message, payload_json, status,
            notes, email_sent, source_url, ip_hash
        ) VALUES (
            :created_at, :updated_at, :form_type, :name, :email, :phone, :event_date,
            :location, :package_name, :subject, :message, :payload_json, "new",
            "", 0, :source_url, :ip_hash
        )'
    );
    $statement->execute([
        ':created_at' => $now,
        ':updated_at' => $now,
        ':form_type' => (string) ($lead['form_type'] ?? ''),
        ':name' => (string) ($lead['name'] ?? ''),
        ':email' => (string) ($lead['email'] ?? ''),
        ':phone' => (string) ($lead['phone'] ?? ''),
        ':event_date' => (string) ($lead['event_date'] ?? ''),
        ':location' => (string) ($lead['location'] ?? ''),
        ':package_name' => (string) ($lead['package_name'] ?? ''),
        ':subject' => (string) ($lead['subject'] ?? ''),
        ':message' => (string) ($lead['message'] ?? ''),
        ':payload_json' => json_encode(
            $lead['payload'] ?? [],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
        ),
        ':source_url' => (string) ($lead['source_url'] ?? ''),
        ':ip_hash' => (string) ($lead['ip_hash'] ?? ''),
    ]);

    return (int) $database->lastInsertId();
}

function lead_mark_email_sent(PDO $database, int $leadId): void
{
    $statement = $database->prepare(
        'UPDATE leads SET email_sent = 1, updated_at = :updated_at WHERE id = :id'
    );
    $statement->execute([
        ':updated_at' => gmdate('c'),
        ':id' => $leadId,
    ]);
}

function lead_allowed_statuses(): array
{
    return [
        'new' => 'Neu',
        'contacted' => 'Kontaktiert',
        'offer' => 'Angebot',
        'booked' => 'Gebucht',
        'completed' => 'Abgeschlossen',
        'archived' => 'Archiviert',
    ];
}

function lead_list(PDO $database, array $filters = []): array
{
    $where = [];
    $parameters = [];
    $status = (string) ($filters['status'] ?? '');
    $type = (string) ($filters['type'] ?? '');
    $query = trim((string) ($filters['query'] ?? ''));

    if ($status !== '' && array_key_exists($status, lead_allowed_statuses())) {
        $where[] = 'status = :status';
        $parameters[':status'] = $status;
    }

    if (in_array($type, ['project', 'wedding'], true)) {
        $where[] = 'form_type = :form_type';
        $parameters[':form_type'] = $type;
    }

    if ($query !== '') {
        $where[] = '(name LIKE :query OR email LIKE :query OR location LIKE :query OR subject LIKE :query OR message LIKE :query)';
        $parameters[':query'] = '%' . $query . '%';
    }

    $sql = 'SELECT * FROM leads';
    if ($where !== []) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY created_at DESC LIMIT 250';

    $statement = $database->prepare($sql);
    $statement->execute($parameters);

    return $statement->fetchAll();
}

function lead_status_counts(PDO $database): array
{
    $counts = array_fill_keys(array_keys(lead_allowed_statuses()), 0);
    $statement = $database->query('SELECT status, COUNT(*) AS total FROM leads GROUP BY status');

    foreach ($statement->fetchAll() as $row) {
        $status = (string) ($row['status'] ?? '');
        if (array_key_exists($status, $counts)) {
            $counts[$status] = (int) $row['total'];
        }
    }

    return $counts;
}

function lead_update(PDO $database, int $leadId, string $status, string $notes): void
{
    if (!array_key_exists($status, lead_allowed_statuses())) {
        throw new InvalidArgumentException('Unbekannter Anfragenstatus.');
    }

    $statement = $database->prepare(
        'UPDATE leads SET status = :status, notes = :notes, updated_at = :updated_at WHERE id = :id'
    );
    $statement->execute([
        ':status' => $status,
        ':notes' => trim($notes),
        ':updated_at' => gmdate('c'),
        ':id' => $leadId,
    ]);
}

function lead_admin_access_hash(): string
{
    $configuredHash = getenv('LEADS_ADMIN_ACCESS_HASH');

    return is_string($configuredHash) && preg_match('/^[a-f0-9]{64}$/', $configuredHash)
        ? $configuredHash
        : LEAD_ADMIN_ACCESS_HASH;
}
