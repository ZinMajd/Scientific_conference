<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/storage_file/papers/test.pdf', 'GET');
$response = $kernel->handle($request);

ob_start();
$response->sendContent();
$content = ob_get_clean();

echo "Content length: " . strlen($content) . "\n";
echo "First 10 bytes: " . substr($content, 0, 10) . "\n";
