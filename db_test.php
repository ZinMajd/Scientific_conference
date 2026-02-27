<?php
$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$passwords = ['', 'root', 'password', '12345678', '1234'];

echo "Testing MySQL credentials...\n";

foreach ($passwords as $pass) {
    try {
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        echo "[SUCCESS] Connected with password: '" . $pass . "'\n";
        
        // Check if database exists
        $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'system'");
        if ($stmt->fetch()) {
            echo "[INFO] Database 'system' exists.\n";
        } else {
            echo "[WARNING] Database 'system' NOT found.\n";
        }
        exit(0);
    } catch (PDOException $e) {
        echo "[FAILED] Password '" . $pass . "': " . $e->getMessage() . "\n";
    }
}

echo "All common passwords failed.\n";
