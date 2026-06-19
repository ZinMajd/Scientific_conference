<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$admin = App\Models\User::where('email', 'admin@sabauni.edu.ye')->first();
if ($admin) {
    $admin->user_type = 'admin';
    $admin->save();
    echo "Successfully updated admin@sabauni.edu.ye to user_type 'admin'\n";
} else {
    echo "Admin user not found\n";
}
