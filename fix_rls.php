<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Adding RLS policy for papers bucket...\n";
    DB::statement("
        CREATE POLICY \"Give public access to papers bucket\" ON storage.objects
        FOR ALL USING (bucket_id = 'papers') WITH CHECK (bucket_id = 'papers');
    ");
    echo "Policy created!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
