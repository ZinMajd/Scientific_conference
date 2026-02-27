<?php
$pdo = new PDO("mysql:host=127.0.0.1", "root", "");
$stmt = $pdo->query("SHOW DATABASES");
while ($row = $stmt->fetch()) {
    $db = $row[0];
    if (in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']))
        continue;
    echo "DB: $db\n";
    $pdo->exec("USE `$db`Primitive" . substr("USE `$db`Primitive", 0, -9)); // STOPO. Why is this happening?
}
