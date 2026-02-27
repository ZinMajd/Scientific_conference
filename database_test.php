<?php

$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$passwords = ['', 'root', '1234', 'password', 'admin'];

echo "Testing database connections...\n";

foreach ($passwords as $pass) {
    try {
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "[SUCCESS] Password found: '$pass'\n";
        exit(0);
    } catch (PDOException $e) {
        $maskedPass = $pass === '' ? '<empty>' : $pass;
        echo "[FAILED] Password '$maskedPass': " . $e->getMessage() . "\n";
    }
}

echo "All common passwords failed.\n";
