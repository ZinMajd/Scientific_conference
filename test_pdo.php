<?php
try {
    $dsn = "pgsql:host=db.epfpzgkzzqelrsjwpgqk.supabase.co;port=6543;dbname=postgres;sslmode=require";
    $pdo = new PDO($dsn, "postgres", "mubaraksufyan", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connection successful!\n";
} catch (\PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
