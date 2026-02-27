<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=saba_conference_db", "root", "");
    $stmt = $pdo->query("DESCRIBE conferences");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Columns in 'conferences' table:\n";
    foreach ($columns as $col) {
        echo " - {$col['Field']} ({$col['Type']})\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
