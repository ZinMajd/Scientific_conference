<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$credentials = [
    'email' => 'admin@sabauni.edu.ye',
    'password' => 'password'
];

if (Illuminate\Support\Facades\Auth::attempt($credentials)) {
    echo "Auth::attempt successful!\n";
    $user = Illuminate\Support\Facades\Auth::user();
    echo "Logged in user: {$user->username} (Type: {$user->user_type})\n";
} else {
    echo "Auth::attempt failed!\n";
}
