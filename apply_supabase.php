<?php
$host = 'db.epfpzgkzzqelrsjwpgqk.supabase.co';
$port = '5432';
$dbname = 'postgres';
$user = 'postgres';
$password = 'mubaraksufyan';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to Supabase successfully.\n";

    $sql = file_get_contents(__DIR__ . '/refactor_db_pgsql.sql');

    // Split SQL by semicolon, but be careful with functions/triggers if any.
    // For simple table creations it's usually fine to execute as one block if PDO supports it.
    $pdo->exec($sql);

    echo "Schema and data applied successfully to Supabase.\n";

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
