<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$users = App\Models\User::whereIn('user_type', ['chair','committee','editor'])->get();
foreach($users as $u) {
    echo $u->full_name . ' | ' . $u->user_type . PHP_EOL;
}
