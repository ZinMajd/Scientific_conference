<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    $dbs = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($dbs as $db) {
        if (in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']))
            continue;
        echo "DATABASE: $db\n";
        $pdo->exec("USE `$db`");
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
