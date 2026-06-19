<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'admin@sabauni.edu.ye')->first();
if ($user) {
    $user->is_active = true;
    $user->save();
    echo "Account activated.\n";
} else {
    echo "User not found\n";
}
