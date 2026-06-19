<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$admin = App\Models\User::where('email', 'admin@sabauni.edu.ye')->first();
if ($admin) {
    $admin->password = Illuminate\Support\Facades\Hash::make('12345678');
    $admin->save();
    echo "Password updated to 12345678 successfully.\n";
} else {
    echo "User not found.\n";
}
