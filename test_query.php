<?php
try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    $res = \App\Models\Paper::where('is_published', 'true')->first();
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
