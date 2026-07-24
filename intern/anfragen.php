<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/lead-store.php';

header('X-Robots-Tag: noindex, nofollow, noarchive', true);
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('Cache-Control: no-store, max-age=0');

session_name('andreas_boehler_leads');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/intern',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function admin_escape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function admin_csrf_token(): string
{
    if (!isset($_SESSION['csrf']) || !is_string($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(24));
    }

    return $_SESSION['csrf'];
}

function admin_is_authenticated(): bool
{
    return isset($_SESSION['lead_admin_until'])
        && is_int($_SESSION['lead_admin_until'])
        && $_SESSION['lead_admin_until'] >= time();
}

function admin_require_csrf(): void
{
    $submitted = (string) ($_POST['csrf'] ?? '');
    if ($submitted === '' || !hash_equals(admin_csrf_token(), $submitted)) {
        http_response_code(403);
        exit('Die Sicherheitsprüfung ist abgelaufen. Bitte lade die Seite neu.');
    }
}

function admin_format_date(string $value): string
{
    try {
        $date = new DateTimeImmutable($value);
        return $date->setTimezone(new DateTimeZone('Europe/Berlin'))->format('d.m.Y, H:i');
    } catch (Throwable $error) {
        return $value;
    }
}

$loginError = '';
$systemError = '';
$notice = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    admin_require_csrf();
    $_SESSION = [];
    session_destroy();
    header('Location: anfragen.php', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['access_key'])) {
    $lockedUntil = (int) ($_SESSION['login_locked_until'] ?? 0);

    if ($lockedUntil > time()) {
        $loginError = 'Zu viele Versuche. Bitte warte einige Minuten.';
    } else {
        $accessKey = trim((string) $_POST['access_key']);
        $valid = hash_equals(lead_admin_access_hash(), hash('sha256', $accessKey));

        if ($valid) {
            session_regenerate_id(true);
            $_SESSION['lead_admin_until'] = time() + 14400;
            $_SESSION['login_attempts'] = 0;
            unset($_SESSION['login_locked_until']);
            header('Location: anfragen.php', true, 303);
            exit;
        }

        $attempts = (int) ($_SESSION['login_attempts'] ?? 0) + 1;
        $_SESSION['login_attempts'] = $attempts;
        if ($attempts >= 5) {
            $_SESSION['login_locked_until'] = time() + 900;
            $_SESSION['login_attempts'] = 0;
        }
        $loginError = 'Der Zugangsschlüssel ist nicht korrekt.';
    }
}

$isAuthenticated = admin_is_authenticated();
$database = null;
$leads = [];
$counts = [];
$statuses = lead_allowed_statuses();
$statusFilter = trim((string) ($_GET['status'] ?? ''));
$typeFilter = trim((string) ($_GET['type'] ?? ''));
$queryFilter = trim((string) ($_GET['q'] ?? ''));

if ($isAuthenticated) {
    try {
        $database = lead_database();

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['lead_id'])) {
            admin_require_csrf();
            $leadId = filter_var($_POST['lead_id'], FILTER_VALIDATE_INT);
            $status = trim((string) ($_POST['status'] ?? 'new'));
            $notes = trim((string) ($_POST['notes'] ?? ''));

            if (!$leadId || strlen($notes) > 5000) {
                throw new InvalidArgumentException('Die Änderung konnte nicht gespeichert werden.');
            }

            lead_update($database, (int) $leadId, $status, $notes);
            header('Location: anfragen.php?updated=1', true, 303);
            exit;
        }

        $leads = lead_list($database, [
            'status' => $statusFilter,
            'type' => $typeFilter,
            'query' => $queryFilter,
        ]);
        $counts = lead_status_counts($database);

        if (isset($_GET['export']) && $_GET['export'] === 'csv') {
            header('Content-Type: text/csv; charset=UTF-8');
            header('Content-Disposition: attachment; filename="anfragen-' . gmdate('Y-m-d') . '.csv"');
            echo "\xEF\xBB\xBF";
            $stream = fopen('php://output', 'wb');
            fputcsv($stream, ['ID', 'Eingang', 'Typ', 'Status', 'Name', 'E-Mail', 'Telefon', 'Datum', 'Ort', 'Paket', 'Betreff', 'Nachricht', 'Notizen'], ';');
            foreach ($leads as $lead) {
                fputcsv($stream, [
                    $lead['id'],
                    $lead['created_at'],
                    $lead['form_type'],
                    $lead['status'],
                    $lead['name'],
                    $lead['email'],
                    $lead['phone'],
                    $lead['event_date'],
                    $lead['location'],
                    $lead['package_name'],
                    $lead['subject'],
                    $lead['message'],
                    $lead['notes'],
                ], ';');
            }
            fclose($stream);
            exit;
        }

        if (isset($_GET['updated'])) {
            $notice = 'Die Anfrage wurde aktualisiert.';
        }
    } catch (Throwable $error) {
        $systemError = $error->getMessage();
    }
}

$totalLeads = array_sum($counts);
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>Anfragen | Andreas Boehler</title>
  <style>
    :root { color-scheme: light; --ink:#151515; --paper:#f5f4f0; --line:#d9d7d0; --muted:#6c6a64; --accent:#f05a28; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font:15px/1.5 Arial, sans-serif; }
    a { color:inherit; }
    button, input, select, textarea { font:inherit; }
    button { cursor:pointer; }
    .login { min-height:100vh; display:grid; place-items:center; padding:24px; }
    .login form { width:min(100%, 440px); border-top:3px solid var(--ink); padding-top:28px; }
    .login span, .eyebrow { color:var(--accent); font-size:12px; text-transform:uppercase; }
    .login h1 { margin:12px 0 8px; font-size:clamp(34px, 6vw, 58px); line-height:1; }
    .login p { color:var(--muted); }
    .login input { width:100%; margin:22px 0 12px; padding:14px 0; border:0; border-bottom:1px solid var(--ink); background:transparent; }
    .login button, .toolbar button, .lead-actions button { border:1px solid var(--ink); background:var(--ink); color:white; padding:11px 16px; }
    .error { color:#a32920 !important; }
    .admin { width:min(100%, 1560px); margin:auto; padding:30px clamp(18px, 4vw, 64px) 80px; }
    .admin-header { display:flex; justify-content:space-between; gap:30px; align-items:flex-end; border-bottom:1px solid var(--line); padding-bottom:28px; }
    .admin-header h1 { margin:8px 0 0; font-size:clamp(38px, 6vw, 84px); font-weight:400; line-height:.95; }
    .admin-header form button { border:0; background:transparent; padding:8px 0; text-decoration:underline; }
    .stats { display:grid; grid-template-columns:repeat(6, 1fr); border-bottom:1px solid var(--line); }
    .stats div { padding:22px 14px 22px 0; }
    .stats strong { display:block; font-size:28px; font-weight:400; }
    .stats span { color:var(--muted); font-size:12px; text-transform:uppercase; }
    .toolbar { display:grid; grid-template-columns:1fr 180px 180px auto auto; gap:10px; padding:26px 0; }
    .toolbar input, .toolbar select { min-width:0; border:1px solid var(--line); background:white; padding:11px 12px; }
    .toolbar a { display:grid; place-items:center; padding:10px 14px; border:1px solid var(--line); text-decoration:none; }
    .notice { padding:12px 0; color:#24643c; }
    .system-error { border:1px solid #b84036; padding:18px; color:#8b211a; background:#fff; }
    .lead-list { display:grid; gap:1px; background:var(--line); border:1px solid var(--line); }
    .lead { background:white; padding:clamp(18px, 3vw, 34px); }
    .lead-head { display:grid; grid-template-columns:110px minmax(180px, .6fr) minmax(220px, 1fr) auto; gap:20px; align-items:start; }
    .lead-head small { color:var(--muted); }
    .lead-head h2 { margin:0; font-size:clamp(20px, 2.3vw, 34px); font-weight:400; }
    .lead-head a { overflow-wrap:anywhere; }
    .type { color:var(--accent); font-size:11px; text-transform:uppercase; }
    .lead-grid { display:grid; grid-template-columns:minmax(0, 1.3fr) minmax(260px, .7fr); gap:clamp(24px, 5vw, 70px); margin-top:28px; padding-top:24px; border-top:1px solid var(--line); }
    .lead-data { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:14px 30px; margin:0; }
    .lead-data div { border-bottom:1px solid #eceae4; padding-bottom:10px; }
    .lead-data dt { color:var(--muted); font-size:11px; text-transform:uppercase; }
    .lead-data dd { margin:4px 0 0; white-space:pre-wrap; overflow-wrap:anywhere; }
    .lead-data .wide { grid-column:1 / -1; }
    .lead-actions { display:grid; gap:12px; align-content:start; }
    .lead-actions select, .lead-actions textarea { width:100%; border:1px solid var(--line); background:var(--paper); padding:10px; }
    .empty { background:white; padding:40px; }
    @media (max-width:900px) {
      .stats { grid-template-columns:repeat(3, 1fr); }
      .toolbar { grid-template-columns:1fr 1fr; }
      .toolbar input { grid-column:1 / -1; }
      .lead-head { grid-template-columns:1fr 1fr; }
      .lead-grid { grid-template-columns:1fr; }
    }
    @media (max-width:560px) {
      .admin-header { align-items:flex-start; }
      .stats { grid-template-columns:repeat(2, 1fr); }
      .toolbar, .lead-head, .lead-data { grid-template-columns:1fr; }
      .lead-data .wide { grid-column:auto; }
    }
  </style>
</head>
<body>
<?php if (!$isAuthenticated): ?>
  <main class="login">
    <form method="post" action="anfragen.php" autocomplete="off">
      <span>Interner Bereich</span>
      <h1>Anfragen</h1>
      <p>Geschützte Übersicht der Projekt- und Hochzeitsanfragen.</p>
      <?php if ($loginError !== ''): ?><p class="error"><?= admin_escape($loginError) ?></p><?php endif; ?>
      <label>
        <span class="eyebrow">Zugangsschlüssel</span>
        <input type="password" name="access_key" required autofocus autocomplete="current-password">
      </label>
      <button type="submit">Anmelden</button>
    </form>
  </main>
<?php else: ?>
  <main class="admin">
    <header class="admin-header">
      <div><span class="eyebrow">Andreas Boehler</span><h1>Anfragen</h1></div>
      <form method="post" action="anfragen.php">
        <input type="hidden" name="csrf" value="<?= admin_escape(admin_csrf_token()) ?>">
        <button type="submit" name="logout" value="1">Abmelden</button>
      </form>
    </header>

    <section class="stats" aria-label="Anfragen nach Status">
      <?php foreach ($statuses as $statusKey => $statusLabel): ?>
        <div><strong><?= (int) ($counts[$statusKey] ?? 0) ?></strong><span><?= admin_escape($statusLabel) ?></span></div>
      <?php endforeach; ?>
    </section>

    <form class="toolbar" method="get" action="anfragen.php">
      <input type="search" name="q" value="<?= admin_escape($queryFilter) ?>" placeholder="Name, E-Mail, Ort oder Inhalt">
      <select name="type" aria-label="Anfragentyp">
        <option value="">Alle Typen</option>
        <option value="project" <?= $typeFilter === 'project' ? 'selected' : '' ?>>Projekt</option>
        <option value="wedding" <?= $typeFilter === 'wedding' ? 'selected' : '' ?>>Hochzeit</option>
      </select>
      <select name="status" aria-label="Status">
        <option value="">Alle Status</option>
        <?php foreach ($statuses as $statusKey => $statusLabel): ?>
          <option value="<?= admin_escape($statusKey) ?>" <?= $statusFilter === $statusKey ? 'selected' : '' ?>><?= admin_escape($statusLabel) ?></option>
        <?php endforeach; ?>
      </select>
      <button type="submit">Filtern</button>
      <a href="?<?= admin_escape(http_build_query(['q' => $queryFilter, 'type' => $typeFilter, 'status' => $statusFilter, 'export' => 'csv'])) ?>">CSV</a>
    </form>

    <?php if ($notice !== ''): ?><p class="notice"><?= admin_escape($notice) ?></p><?php endif; ?>
    <?php if ($systemError !== ''): ?>
      <p class="system-error"><strong>Datenbank nicht erreichbar.</strong><br><?= admin_escape($systemError) ?></p>
    <?php else: ?>
      <section class="lead-list" aria-label="<?= (int) count($leads) ?> von <?= (int) $totalLeads ?> Anfragen">
        <?php if ($leads === []): ?><p class="empty">Für diese Auswahl gibt es noch keine Anfragen.</p><?php endif; ?>
        <?php foreach ($leads as $lead): ?>
          <?php
            $payload = json_decode((string) $lead['payload_json'], true);
            $payload = is_array($payload) ? $payload : [];
          ?>
          <article class="lead">
            <header class="lead-head">
              <div><span class="type"><?= $lead['form_type'] === 'wedding' ? 'Hochzeit' : 'Projekt' ?></span><br><small>#<?= (int) $lead['id'] ?></small></div>
              <div><small>Eingang</small><br><?= admin_escape(admin_format_date((string) $lead['created_at'])) ?></div>
              <h2><?= admin_escape($lead['name']) ?></h2>
              <div><a href="mailto:<?= admin_escape($lead['email']) ?>"><?= admin_escape($lead['email']) ?></a><br><small><?= (int) $lead['email_sent'] === 1 ? 'E-Mail versendet' : 'Nur intern gespeichert' ?></small></div>
            </header>
            <div class="lead-grid">
              <dl class="lead-data">
                <?php foreach ($payload as $label => $value): ?>
                  <?php
                    $displayValue = is_array($value) ? implode(', ', array_map('strval', $value)) : (string) $value;
                    if ($displayValue === '') { continue; }
                    $wide = strlen($displayValue) > 90 || in_array($label, ['Nachricht', 'Notizen'], true);
                  ?>
                  <div class="<?= $wide ? 'wide' : '' ?>">
                    <dt><?= admin_escape($label) ?></dt>
                    <dd><?= admin_escape($displayValue) ?></dd>
                  </div>
                <?php endforeach; ?>
                <?php if ((string) $lead['source_url'] !== ''): ?>
                  <div class="wide"><dt>Quelle</dt><dd><?= admin_escape($lead['source_url']) ?></dd></div>
                <?php endif; ?>
              </dl>
              <form class="lead-actions" method="post" action="anfragen.php">
                <input type="hidden" name="csrf" value="<?= admin_escape(admin_csrf_token()) ?>">
                <input type="hidden" name="lead_id" value="<?= (int) $lead['id'] ?>">
                <label><span class="eyebrow">Status</span>
                  <select name="status">
                    <?php foreach ($statuses as $statusKey => $statusLabel): ?>
                      <option value="<?= admin_escape($statusKey) ?>" <?= $lead['status'] === $statusKey ? 'selected' : '' ?>><?= admin_escape($statusLabel) ?></option>
                    <?php endforeach; ?>
                  </select>
                </label>
                <label><span class="eyebrow">Interne Notiz</span>
                  <textarea name="notes" rows="6" maxlength="5000"><?= admin_escape($lead['notes']) ?></textarea>
                </label>
                <button type="submit">Speichern</button>
              </form>
            </div>
          </article>
        <?php endforeach; ?>
      </section>
    <?php endif; ?>
  </main>
<?php endif; ?>
</body>
</html>
