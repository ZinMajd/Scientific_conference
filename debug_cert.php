<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check the specific users and their user_type
$users = \App\Models\User::with('roles')->get();
foreach ($users as $u) {
    $roles = $u->roles->pluck('slug')->join(',');
    echo "ID: {$u->id} | user_type: {$u->user_type} | username: {$u->username} | roles: {$roles}\n";
}

echo "\n--- Papers that belong to our committee users ---\n";
// Simulate what happens when a committee user accesses /researcher/certificates
$committeeUser = \App\Models\User::where('username', 'asihhh')->first();
if ($committeeUser) {
    echo "\nCommittee user: {$committeeUser->full_name} | user_type: {$committeeUser->user_type}\n";
    $acceptedStatuses = [
        \App\Models\Paper::STATUS_ACCEPTED,
        \App\Models\Paper::STATUS_SCHEDULED,
        \App\Models\Paper::STATUS_IN_PRODUCTION,
        \App\Models\Paper::STATUS_READY_TO_PUBLISH,
        \App\Models\Paper::STATUS_PUBLISHED,
    ];
    $query = \App\Models\Paper::with(['conference', 'author'])->whereIn('status', $acceptedStatuses);
    if ($committeeUser->user_type === 'author') {
        $query->where('author_id', $committeeUser->id);
    }
    $papers = $query->get();
    echo "Papers found: " . $papers->count() . "\n";
    foreach ($papers as $p) {
        echo " - #{$p->id} | {$p->title} | {$p->status} | author: {$p->author?->full_name}\n";
    }
}
