<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$log = Illuminate\Support\Facades\DB::table('notifications')->latest('created_at')->first();
echo $log->data;
