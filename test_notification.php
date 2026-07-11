<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('user_type', 'author')->first();
$paper = App\Models\Paper::first();

if (!$user || !$paper) {
    echo "No user or paper found. Users: " . App\Models\User::count() . " Papers: " . App\Models\Paper::count() . "\n";
    exit;
}

echo "Testing notification for user: " . $user->full_name . " (" . $user->email . ")\n";
echo "Paper: " . $paper->title . "\n";
echo "Notifications before: " . DB::table('notifications')->count() . "\n";

try {
    $user->notify(new App\Notifications\PaperStatusNotification($paper, 'اختبار الإشعار - تم تحديث حالة البحث'));
    echo "SUCCESS! Notifications after: " . DB::table('notifications')->count() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
