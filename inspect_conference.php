<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$conf = \App\Models\Conference::first();
if ($conf) {
    echo "ID: " . $conf->id . "\n";
    echo "Title: " . $conf->title . "\n";
    echo "Status: " . $conf->status . "\n";
    echo "Deadline: " . $conf->submission_deadline . "\n";
    echo "Now: " . now() . "\n";
} else {
    echo "No conferences found.\n";
}
