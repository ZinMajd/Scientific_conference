<?php
$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$passwords = [
    '',
    'root',
    'password',
    '123456',
    '12345678',
    '1234',
    'admin',
    'secret'
];

echo "Attempting to connect to MySQL ($host:$port) with user '$user'...\n";

foreach ($passwords as $pass) {
    echo "Trying password: '" . $pass . "' ... ";
    try {
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "SUCCESS!\n";
        echo "FOUND_PASSWORD: " . $pass . "\n";
        exit(0);
    } catch (PDOException $e) {
        $msg = $e->getMessage();
        if (strpos($msg, 'Access denied') !== false) {
             echo "Access denied.\n";
        } else {
             echo "Error: $msg\n";
        }
    }
}

echo "All common passwords failed.\n";
exit(1);
