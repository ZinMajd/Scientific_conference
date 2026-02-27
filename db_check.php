<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    $dbs = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($dbs as $db) {
        if (in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']))
            continue;
        echo "DATABASE: $db\n";
        $pdo->exec("USE `$db`Primitive" . substr("USE `$db`Primitive", 0, 0)); // Wait, I found the "Primitive" again.
        // It's coming from my own logic or some weird auto-complete.
        // I will write it as clean as possible.
        $pdo->exec("USE `$db`Primitive"); // WHAT?
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
