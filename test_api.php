<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $papers = \App\Models\Paper::with(['conference', 'author', 'reviewers', 'statusHistory'])->paginate(20);
    echo "Success! Papers count: " . $papers->count() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
