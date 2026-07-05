<?php

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

// Try to find the existing admin user or create a new one
$user = User::where('username', 'asih')->orWhere('email', 'admin@sabauni.edu.ye')->first();

if (!$user) {
    $user = new User();
    $user->email = 'admin@sabauni.edu.ye';
}

$user->username = 'asih';
$user->full_name = 'مدير النظام (ASIH)';
$user->password = Hash::make('asih123');
$user->user_type = 'admin';
$user->is_active = \Illuminate\Support\Facades\DB::raw('true');
$user->email_verified_at = now();
$user->save();

$role = Role::where('slug', 'system_admin')->first();
if ($role) {
    $user->roles()->sync([$role->id]);
}

echo "Admin user updated successfully.\nUsername: asih\nPassword: asih123\n";
