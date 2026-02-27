<?php
$pdo = new PDO("mysql:host=127.0.0.1", "root", "");
$dbs = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);

foreach ($dbs as $db) {
    if (in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']))
        continue;

    echo "DATABASE: " . $db . "\n";
    try {
        $pdo2 = new PDO("mysql:host=127.0.0.1;dbname=" . $db, "root", "");
        $tables = $pdo2->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        if (empty($tables)) {
            echo "  (No tables found)\n";
        } else {
            foreach ($tables as $table) {
                $count = $pdo2->query("SELECT COUNT(*) FROM `" . $table . "`")->fetchColumn();
                echo "  - " . $table . " (" . $count . " rows)\n";
            }
        }
    } catch (Exception $e) {
        echo "  Error: " . $e->getMessage() . "\n";
    }
    echo "\n";
}
