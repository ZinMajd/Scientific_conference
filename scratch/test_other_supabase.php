<?php
$host = 'db.epfpzgkzzqelrsjwpgqk.supabase.co';
$port = '5432';
$dbname = 'postgres';
$user = 'postgres';
$password = 'mubaraksufyan';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    echo "SUCCESS: Connected to other Supabase project.\n";
    
    $stmt = $pdo->query("SELECT id, title, status FROM conferences");
    $conferences = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Conferences found: " . count($conferences) . "\n";
    foreach ($conferences as $c) {
        echo "- [{$c['id']}] {$c['title']} ({$c['status']})\n";
    }
} catch (PDOException $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
