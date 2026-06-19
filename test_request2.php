<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/storage_file/papers/test.pdf', 'GET');
$response = $kernel->handle($request);

echo "Class: " . get_class($response) . "\n";
echo "File: " . ($response instanceof \Symfony\Component\HttpFoundation\BinaryFileResponse ? $response->getFile()->getPathname() : 'Not a file response') . "\n";
