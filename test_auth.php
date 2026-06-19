<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$email = 'admin@sabauni.edu.ye';
$passwords = ['password', 'password123', '12345678'];

$user = App\Models\User::where('email', $email)->first();
if (!$user) {
    echo "User not found\n";
    exit;
}

echo "User found: {$user->username} ({$user->email}) - Active: {$user->is_active}\n";

foreach ($passwords as $pwd) {
    if (Illuminate\Support\Facades\Hash::check($pwd, $user->password)) {
        echo "Password matches: {$pwd}\n";
    } else {
        echo "Password does NOT match: {$pwd}\n";
    }
}
