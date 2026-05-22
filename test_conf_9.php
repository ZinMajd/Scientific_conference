<?php
try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    $controller = app()->make('App\Http\Controllers\Api\ConferenceController');
    $result = $controller->show(9);
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
