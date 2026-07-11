<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// List all tables in DB
$tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
echo "All tables:\n";
foreach ($tables as $t) {
    echo " - {$t->tablename}\n";
}

// Find the many-to-many pivot table for users<->roles
echo "\n\nLooking for user roles pivot:\n";
$user = \App\Models\User::with('roles')->find(31); // asihhh
echo "User: {$user->username}\n";
echo "Roles relation SQL: \n";
$rel = $user->roles();
echo get_class($rel) . "\n";
echo "Table: " . $rel->getTable() . "\n";
