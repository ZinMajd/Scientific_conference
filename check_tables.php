<?php
$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = '';
$db = 'saba_conference_db';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
    echo "Connected to $db.\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    if (empty($tables)) {
        echo "[WARNING] No tables found in '$db'.\n";

        echo "\nListing all databases:\n";
        foreach ($pdo->query("SHOW DATABASES") as $row) {
            $dbname = $row[0];
            $tempPdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
            $count = $tempPdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$dbname'")->fetchColumn();
            echo " - $dbname ($count tables)\n";
        }
    } else {
        echo "Found " . count($tables) . " tables in '$db':\n";
        foreach ($tables as $table) {
            echo " - $table\n";
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
