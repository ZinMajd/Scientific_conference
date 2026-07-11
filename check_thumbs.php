<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Paper;

$papers = Paper::whereNotNull('thumbnail_path')->get(['id', 'title', 'thumbnail_path']);
echo "Papers with thumbnails:\n";
foreach ($papers as $p) {
    echo "ID: {$p->id} | Path: {$p->thumbnail_path}\n";
}

if ($papers->isEmpty()) {
    echo "No papers have a thumbnail_path set.\n";
}
