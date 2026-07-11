<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$papers = \App\Models\Paper::all();
foreach($papers as $p) {
    echo "Paper: {$p->id} | Author_ID: {$p->author_id} | Status: {$p->status} | Title: {$p->title}\n";
}
