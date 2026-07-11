<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(14);
$acceptedStatuses = [
    \App\Models\Paper::STATUS_ACCEPTED,
    \App\Models\Paper::STATUS_SCHEDULED,
    \App\Models\Paper::STATUS_IN_PRODUCTION,
    \App\Models\Paper::STATUS_READY_TO_PUBLISH,
    \App\Models\Paper::STATUS_PUBLISHED,
];
$papers = \App\Models\Paper::with(['conference'])
    ->where('author_id', $user->id)
    ->whereIn('status', $acceptedStatuses)
    ->get();

echo "User: {$user->full_name}\n";
echo "Found " . $papers->count() . " papers.\n";
foreach($papers as $paper) {
    echo "Paper ID: {$paper->id} | Status: {$paper->status} | Title: {$paper->title}\n";
}
