<?php
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();


// Map user_type to role slug
$userTypeToRole = [
    'committee'       => 'scientific_committee',
    'chair'           => 'conference_chair',
    'editor'          => 'editor',
    'office'          => 'editorial_office',
    'admin'           => 'system_admin',
    'production_office' => 'production_office',
    'reviewer'        => 'reviewer',
    'author'          => 'author',
];

// Get all roles
$dbRoles = DB::table('roles')->get()->keyBy('slug');
echo "Available roles:\n";
foreach ($dbRoles as $slug => $role) {
    echo " - {$slug} (ID: {$role->id})\n";
}
echo "\n";

// Fix users that have user_type but no role
$users = \App\Models\User::with('roles')->get();
$fixed = 0;

foreach ($users as $user) {
    $expectedRoleSlug = $userTypeToRole[$user->user_type] ?? null;
    if (!$expectedRoleSlug) continue;
    
    $hasRole = $user->roles->where('slug', $expectedRoleSlug)->isNotEmpty();
    if (!$hasRole) {
        $role = $dbRoles[$expectedRoleSlug] ?? null;
        if (!$role) {
            echo "⚠ Role '{$expectedRoleSlug}' not found in DB for user: {$user->username}\n";
            continue;
        }
        
        // Check if already exists in pivot
        $exists = DB::table('role_user')
            ->where('user_id', $user->id)
            ->where('role_id', $role->id)
            ->exists();
        
        if (!$exists) {
            DB::table('role_user')->insert([
                'user_id' => $user->id,
                'role_id' => $role->id,
            ]);
            echo "✅ Assigned role '{$expectedRoleSlug}' to user: {$user->username} ({$user->user_type})\n";
            $fixed++;
        }
    }
}

echo "\nTotal users fixed: {$fixed}\n";
echo "\n=== After fix ===\n";
$users = \App\Models\User::with('roles')->get();
foreach ($users as $user) {
    $userRolesString = $user->fresh()->roles->pluck('slug')->join(', ');
    echo "{$user->username} ({$user->user_type}): [{$userRolesString}]\n";
}

