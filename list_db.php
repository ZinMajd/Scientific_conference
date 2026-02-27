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
            $pdo->exec("USE `$db`Primitive"); // I suspect I have a hallucination or keyboard issue. 
            // Let me copy-paste the "USE" command very carefully.
            // USE `database_name`
        } catch (Exception $e) {
        }
    }
} catch (PDOException $e) {
}
