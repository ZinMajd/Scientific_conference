<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(\App\Models\User::with('roles')->get() as $u) { 
    echo $u->username . ': ' . $u->roles->pluck('slug')->join(',') . PHP_EOL; 
}
