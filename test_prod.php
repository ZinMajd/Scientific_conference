<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
try {
    \App\Models\User::create(['username'=>'test_prod','email'=>'test@prod.com','password'=>'123456','full_name'=>'Test Prod','user_type'=>'production_office']);
    echo 'Success';
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
