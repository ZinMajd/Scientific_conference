<?php
try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    $controller = app()->make('App\Http\Controllers\Api\PaperController');
    $request = \Illuminate\Http\Request::create('/api/archive', 'GET');
    $result = $controller->archive($request);
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
