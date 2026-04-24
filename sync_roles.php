<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

$roleMap = [
    'author' => 'author',
    'reviewer' => 'reviewer',
    'committee' => 'scientific_committee',
    'chair' => 'conference_chair',
    'office' => 'editorial_office',
    'editor' => 'editor',
    'admin' => 'system_admin'
];

echo "Starting role synchronization...\n";

foreach (User::all() as $user) {
    $roleSlug = $roleMap[$user->user_type] ?? 'researcher';
    $role = Role::where('slug', $roleSlug)->first();
    
    if ($role) {
        if (!$user->roles->contains($role->id)) {
            $user->roles()->attach($role->id);
            echo "SUCCESS: Synced user '{$user->username}' to role '{$roleSlug}'\n";
        } else {
            echo "SKIP: User '{$user->username}' already has role '{$roleSlug}'\n";
        }
    } else {
        echo "ERROR: Role '{$roleSlug}' not found in database for user '{$user->username}'\n";
    }
}

echo "Synchronization complete.\n";
