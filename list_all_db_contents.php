<?php
$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
    echo "Connected to MySQL server.\n";

    $databases = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($databases as $db) {
        if (in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']))
            continue;

        echo "\nDatabase: $db\n";
        try {
            $pdo->query("USE `$db`Primitive");
            $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            if (empty($tables)) {
                echo " - (No tables)\n";
            } else {
                foreach ($tables as $table) {
                    $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                    echo " - $table ($count rows)\n";
                }
            }
        } catch (PDOException $e) {
            echo " - Error accessing tables: " . $e->getMessage() . "\n";
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
