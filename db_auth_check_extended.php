<?php
$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$passwords = [
    '12345',
    'mysql',
    'admin123',
    'system',
    'toor',
    'dbpass',
    'laravel'
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
         echo "Access denied.\n";
    }
}

echo "All extended passwords failed.\n";
exit(1);
