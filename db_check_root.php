<?php
$host = '127.0.0.1';
$db   = 'system';
$user = 'root';
$pass = 'root';

echo "Testing specific connection: User='$user', Pass='$pass'...\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "SUCCESS: Connected with password 'root'!\n";
} catch (PDOException $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
