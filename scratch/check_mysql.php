<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1', 'root', '');
    echo "Connected to MySQL.\n";
    $databases = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Databases: " . implode(', ', $databases) . "\n";
    
    if (in_array('saba_conference_db', $databases)) {
        $pdo->exec("USE saba_conference_db");
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "Tables in saba_conference_db: " . implode(', ', $tables) . "\n";
        
        if (in_array('conferences', $tables)) {
            $conferences = $pdo->query("SELECT id, title, status FROM conferences")->fetchAll(PDO::FETCH_ASSOC);
            echo "Conferences found: " . count($conferences) . "\n";
            foreach ($conferences as $c) {
                echo "- [{$c['id']}] {$c['title']} ({$c['status']})\n";
            }
        } else {
            echo "Table 'conferences' not found.\n";
        }
    } else {
        echo "Database 'saba_conference_db' not found.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
