<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\UploadedFile;

$file = UploadedFile::fake()->image('test_local.jpg');
$path = $file->store('papers/thumbnails', 'public');
echo "Stored Path: $path\n";

$fullPath = storage_path('app/public/' . ltrim($path, '/'));
echo "Full Path: $fullPath\n";
echo "Exists? " . (file_exists($fullPath) ? "Yes" : "No") . "\n";

// Test the web.php logic
$bases = [
    storage_path('app/public/'),
    storage_path('app/private/'),
    storage_path('app/'),
];

$targetFile = null;
foreach ($bases as $base) {
    $filePath = $base . ltrim($path, '/');
    if (file_exists($filePath) && !is_dir($filePath)) {
        $targetFile = $filePath;
        break;
    }
}
echo "Target File resolved: $targetFile\n";
