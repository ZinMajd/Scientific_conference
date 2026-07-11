<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$paper = App\Models\Paper::first();
if (!$paper) {
    echo "No paper found.\n";
    exit;
}

echo "Testing notification for paper: " . $paper->title . "\n";
echo "Clearing old notifications...\n";
DB::table('notifications')->truncate();

$workflow = app(App\Services\PaperWorkflowService::class);

echo "Triggering PAPER_SUBMITTED...\n";
$workflow->transition($paper, 'PAPER_SUBMITTED', 'تم تقديم البحث بنجاح');

echo "Notifications after PAPER_SUBMITTED (Should notify Author + Office):\n";
$notifications = DB::table('notifications')->get();
foreach ($notifications as $n) {
    $notifiable = DB::table('users')->where('id', $n->notifiable_id)->first();
    echo "- Sent to: {$notifiable->full_name} (Role: {$notifiable->user_type}) | Type: {$n->type}\n";
}
