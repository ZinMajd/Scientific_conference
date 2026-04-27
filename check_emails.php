<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- EMAIL LOGS ---\n";
$logs = App\Models\EmailLog::latest()->take(10)->get();
foreach ($logs as $log) {
    echo "To: {$log->to_email} | Status: {$log->status} | Error: {$log->error_message}\n";
}
echo "--- JOBS IN QUEUE ---\n";
echo Illuminate\Support\Facades\DB::table('jobs')->count() . " jobs pending.\n";
echo "--- FAILED JOBS ---\n";
echo Illuminate\Support\Facades\DB::table('failed_jobs')->count() . " failed jobs.\n";
