<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$admin = App\Models\User::where('email', 'admin@sabauni.edu.ye')->first();
if ($admin) {
    $admin->password = Illuminate\Support\Facades\Hash::make('password');
    $admin->save();
    echo "Password updated successfully.\n";
} else {
    echo "User not found.\n";
}
