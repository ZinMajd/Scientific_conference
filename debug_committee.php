<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing Committee Papers Access ===\n\n";

// Test each committee-type user
$committeeUsernames = ['asihhh', 'ssss', 'mohammed', 'zin ali', 'مجد', 'muhmd'];

foreach ($committeeUsernames as $username) {
    $user = \App\Models\User::with('roles')->where('username', $username)->first();
    if (!$user) continue;
    
    $roles = $user->roles->pluck('slug')->join(', ');
    $allowedRoles = ['scientific_committee', 'editor', 'editorial_office', 'conference_chair', 'production_office', 'system_admin'];
    
    $hasAccess = false;
    foreach ($allowedRoles as $role) {
        if ($user->hasRole($role)) {
            $hasAccess = true;
            break;
        }
    }
    
    echo "User: {$user->username} | user_type: {$user->user_type} | roles: [{$roles}] | Has Committee Access: " . ($hasAccess ? 'YES ✓' : 'NO ✗') . "\n";
}

echo "\n=== Checking Papers API data ===\n";
$papers = \App\Models\Paper::with(['conference', 'author', 'reviewers', 'statusHistory'])->paginate(20);
echo "Total papers in paginated response: " . $papers->count() . " (total: " . $papers->total() . ")\n";
echo "Has data key: " . (isset($papers->toArray()['data']) ? 'YES' : 'NO') . "\n";
echo "Has last_page key: " . (isset($papers->toArray()['last_page']) ? 'YES' : 'NO') . "\n";
