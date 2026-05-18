<?php
/**
 * =============================================================================
 *  webhook-payload.php — HMAC-validated webhook receiver for Astro rebuilds.
 *
 *  Place this file in your public_html (or behind a non-guessable path) and
 *  configure Payload CMS + Medusa to POST to it on content changes. The
 *  request must be signed with HMAC-SHA-256 using the shared secret.
 *
 *  Env / config:
 *    - Define BUILD_WEBHOOK_SECRET in a `.env.php` placed OUTSIDE web root,
 *      e.g. /home/USER/private/honey-webhook.env.php (see bottom of file).
 *    - BUILD_SCRIPT must point at build_astro.sh on disk.
 *    - LOG_FILE captures every request (signature ok or not).
 *
 *  Why PHP? o2switch shared hosting runs Apache + PHP natively. A PHP
 *  endpoint avoids needing a long-running Node daemon (which is awkward
 *  on shared hosting) just to receive webhooks.
 * =============================================================================
 */

declare(strict_types=1);

// --- Configuration ----------------------------------------------------------
// Path to the rebuild script (adjust for your o2switch account).
$BUILD_SCRIPT = '/home/USER/repositories/honey-selling-site-frontend/build_astro.sh';
$LOG_FILE     = '/home/USER/logs/honey-webhook.log';

// Load shared secret from a file kept OUTSIDE the web root.
$SECRET_FILE  = '/home/USER/private/honey-webhook.env.php';
$SECRET       = '';
if (is_readable($SECRET_FILE)) {
    /** @var string $BUILD_WEBHOOK_SECRET */
    require $SECRET_FILE;
    $SECRET = isset($BUILD_WEBHOOK_SECRET) ? (string) $BUILD_WEBHOOK_SECRET : '';
}

// --- Helpers ----------------------------------------------------------------
function logLine(string $file, string $msg): void {
    @file_put_contents($file, '[' . date('c') . '] ' . $msg . PHP_EOL, FILE_APPEND);
}

function reject(int $code, string $reason, string $logFile): void {
    http_response_code($code);
    header('Content-Type: application/json');
    logLine($logFile, "REJECT $code $reason");
    echo json_encode(['ok' => false, 'error' => $reason]);
    exit;
}

// --- Method gate ------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reject(405, 'method_not_allowed', $LOG_FILE);
}
if ($SECRET === '') {
    reject(500, 'secret_not_configured', $LOG_FILE);
}

// --- Read body & header -----------------------------------------------------
$body = file_get_contents('php://input') ?: '';

$headerSig = $_SERVER['HTTP_X_HUB_SIGNATURE_256']
          ?? $_SERVER['HTTP_X_PAYLOAD_SIGNATURE']
          ?? $_SERVER['HTTP_X_MEDUSA_SIGNATURE']
          ?? '';
$headerSig = is_string($headerSig) ? preg_replace('/^sha256=/', '', $headerSig) : '';

if ($headerSig === '' || $headerSig === null) {
    reject(401, 'missing_signature', $LOG_FILE);
}

$expected = hash_hmac('sha256', $body, $SECRET);
if (!hash_equals($expected, $headerSig)) {
    reject(401, 'invalid_signature', $LOG_FILE);
}

// --- Spawn the build script (detached so we return 202 fast) ---------------
if (!is_file($BUILD_SCRIPT) || !is_executable($BUILD_SCRIPT)) {
    reject(500, 'build_script_missing', $LOG_FILE);
}

$cmd = escapeshellcmd($BUILD_SCRIPT) . ' >> ' . escapeshellarg($LOG_FILE) . ' 2>&1 &';
// On o2switch shared hosting, popen + pclose returns immediately for &-suffixed cmds.
$proc = popen($cmd, 'r');
if ($proc !== false) {
    pclose($proc);
}

logLine($LOG_FILE, 'OK build queued by webhook');

http_response_code(202);
header('Content-Type: application/json');
echo json_encode(['ok' => true, 'queued' => true]);

/* =============================================================================
 *  Example /home/USER/private/honey-webhook.env.php (OUTSIDE web root):
 *
 *      <?php
 *      $BUILD_WEBHOOK_SECRET = 'paste-a-long-random-string-here';
 *
 *  chmod 600 honey-webhook.env.php
 * ============================================================================= */
