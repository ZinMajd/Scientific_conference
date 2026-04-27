<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$logs = Illuminate\Support\Facades\DB::table('notifications')->get();
foreach ($logs as $log) {
    $data = json_decode($log->data, true);
    echo ($data['url'] ?? 'NO URL') . "\n";
}
