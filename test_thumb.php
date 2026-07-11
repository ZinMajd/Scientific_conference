<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$paper = \App\Models\Paper::first();
if (!$paper) {
    echo "No paper found\n";
    exit;
}

echo "Current thumbnail: " . $paper->thumbnail_path . "\n";
$paper->thumbnail_path = 'test_path.jpg';
$paper->save();

$paper->refresh();
echo "New thumbnail: " . $paper->thumbnail_path . "\n";
