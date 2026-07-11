<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$notifications = DB::table('notifications')->latest()->limit(20)->get(['notifiable_id','type','data','created_at']);
foreach($notifications as $n) {
    $u = App\Models\User::find($n->notifiable_id);
    echo "Time: {$n->created_at} | Sent to Role: " . ($u ? $u->user_type : 'unknown') . " | Name: " . ($u ? $u->full_name : 'unknown') . "\n";
}
