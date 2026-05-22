<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$papers = \Illuminate\Support\Facades\DB::table('papers')
    ->select('file_path', 'final_file_path', 'status', 'is_published')
    ->limit(5)
    ->get();

foreach ($papers as $p) {
    echo "file_path: " . $p->file_path . "\n";
    echo "final_file_path: " . $p->final_file_path . "\n";
    echo "status: " . $p->status . " | is_published: " . $p->is_published . "\n";
    
    // Check if file actually exists locally
    $bases = [
        storage_path('app/public/'),
        storage_path('app/private/'),
        storage_path('app/'),
    ];
    foreach ($bases as $base) {
        $fp = $base . $p->file_path;
        if (file_exists($fp)) {
            echo "  -> LOCAL EXISTS at: $fp\n";
        }
    }
    echo "---\n";
}
