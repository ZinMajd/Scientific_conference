<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    DB::connection()->getPdo();
    echo "Successfully connected to the database.\n";
} catch (\Exception $e) {
    echo "Could not connect to the database. Please check your configuration.\n";
    echo $e->getMessage() . "\n";
}
