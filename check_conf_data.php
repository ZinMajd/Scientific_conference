<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=saba_conference_db", "root", "");
    $stmt = $pdo->query("SELECT id, title, status FROM conferences");
    $conferences = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($conferences)) {
        echo "No conferences found in the table.\n";
    } else {
        echo "Found " . count($conferences) . " conferences:\n";
        foreach ($conferences as $conf) {
            echo " - ID: {$conf['id']}, Title: {$conf['title']}, Status: {$conf['status']}\n";
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
