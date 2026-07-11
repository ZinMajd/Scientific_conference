<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::where('user_type', 'author')->get();
foreach ($users as $u) {
    echo "Author: " . $u->full_name . " (ID: " . $u->id . ")\n";
    $papers = \App\Models\Paper::where('author_id', $u->id)->get();
    foreach ($papers as $p) {
        echo "  - Paper ID: " . $p->id . " | Status: " . $p->status . " | Title: " . $p->title . "\n";
    }
}
