<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\Api\ProductionController;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

$file = UploadedFile::fake()->image('test_thumbnail.jpg');

$controller = app()->make(ProductionController::class);
$reflector = new ReflectionClass($controller);
$method = $reflector->getMethod('uploadToSupabase');
$method->setAccessible(true);

echo "Uploading to Supabase...\n";
$ext = strtolower($file->getClientOriginalExtension());
$path = $method->invoke($controller, $file, 'papers/thumbnails', $ext);

echo "Returned Path from uploadToSupabase: " . $path . "\n";
