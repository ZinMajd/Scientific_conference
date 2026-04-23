<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Conference;

try {
    $conferences = Conference::all();
    echo "Found " . $conferences->count() . " conferences.\n";
    foreach ($conferences as $c) {
        echo "- ID: {$c->id}, Title: {$c->title}, Status: {$c->status}\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
