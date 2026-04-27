<?php
// Script to check and fix user roles
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Role;

echo "=== فحص أدوار المستخدمين ===\n\n";

$users = User::with('roles')->get();
foreach ($users as $u) {
    $roles = $u->roles->pluck('slug')->implode(', ');
    echo "  [{$u->id}] {$u->username}: " . ($roles ?: 'بدون دور') . "\n";
}

echo "\n=== إصلاح الأدوار المفقودة ===\n\n";

// خريطة المستخدمين والأدوار المتوقعة
$fixMap = [
    'sumia'  => 'reviewer',
    'مجد'    => 'editor',
    'محمد'   => 'conference_chair',
    'sara'   => 'author',
    'muhmd'  => 'editorial_office',
    'majd'   => 'scientific_committee',
    'admin'  => 'system_admin',
];

foreach ($fixMap as $username => $roleSlug) {
    $user = User::where('username', $username)->with('roles')->first();
    if (!$user) {
        echo "  ❌ المستخدم '{$username}' غير موجود\n";
        continue;
    }

    $role = Role::where('slug', $roleSlug)->first();
    if (!$role) {
        echo "  ❌ الدور '{$roleSlug}' غير موجود\n";
        continue;
    }

    $hasRole = $user->roles->contains('slug', $roleSlug);
    if (!$hasRole) {
        $user->roles()->syncWithoutDetaching([$role->id]);
        echo "  ✅ تم تعيين دور '{$roleSlug}' للمستخدم '{$username}'\n";
    } else {
        echo "  ✓  '{$username}' لديه دور '{$roleSlug}' بالفعل\n";
    }
}

echo "\n=== النتيجة النهائية ===\n\n";
$users = User::with('roles')->get();
foreach ($users as $u) {
    $roles = $u->roles->pluck('slug')->implode(', ');
    echo "  [{$u->id}] {$u->username}: " . ($roles ?: 'بدون دور') . "\n";
}

echo "\n✅ اكتمل الفحص والإصلاح!\n";
