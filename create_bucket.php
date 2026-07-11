<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $buckets = DB::select("SELECT * FROM storage.buckets");
    echo "Buckets in Supabase:\n";
    foreach ($buckets as $b) {
        echo "- " . $b->id . " (Public: " . ($b->public ? 'Yes' : 'No') . ")\n";
    }

    $hasPapers = false;
    foreach ($buckets as $b) {
        if ($b->id === 'papers') $hasPapers = true;
    }

    if (!$hasPapers) {
        echo "\nAttempting to create 'papers' bucket directly in DB...\n";
        DB::statement("INSERT INTO storage.buckets (id, name, public) VALUES ('papers', 'papers', true)");
        echo "Created 'papers' bucket!\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
