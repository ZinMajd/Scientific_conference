<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$logs = Illuminate\Support\Facades\DB::table('notifications')->get();
foreach ($logs as $log) {
    $data = json_decode($log->data, true);
    if (isset($data['url']) && strpos($data['url'], '/researcher/papers') !== false) {
        $data['url'] = str_replace('/researcher/papers', '/researcher/research', $data['url']);
        Illuminate\Support\Facades\DB::table('notifications')
            ->where('id', $log->id)
            ->update(['data' => json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
    }
}
echo "Done replacing URLs properly.\n";
