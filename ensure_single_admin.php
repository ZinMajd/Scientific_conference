<?php

use App\Models\User;
use App\Models\Role;

// Find the committee role
$committeeRole = Role::where('slug', 'scientific_committee')->first();

if ($committeeRole) {
    // Find all users who are admins, but NOT asih
    $otherAdmins = User::where('user_type', 'admin')
        ->where('username', '!=', 'asih')
        ->get();

    foreach ($otherAdmins as $user) {
        $user->user_type = 'committee';
        $user->save();
        
        // Sync to committee role only
        $user->roles()->sync([$committeeRole->id]);
        
        echo "Demoted other admin: {$user->username} ({$user->email}) to Scientific Committee.\n";
    }

    if ($otherAdmins->isEmpty()) {
        echo "No other admin users found. 'asih' is the only administrator.\n";
    }
} else {
    echo "Error: scientific_committee role not found in database.\n";
}
