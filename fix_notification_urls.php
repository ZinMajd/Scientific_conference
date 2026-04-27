<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$notifications = Illuminate\Support\Facades\DB::table('notifications')->get();
foreach ($notifications as $n) {
    // Decode JSON, update, re-encode
    $data = json_decode($n->data, true);
    if (isset($data['url'])) {
        $data['url'] = str_replace('/researcher/papers/', '/researcher/research/', $data['url']);
        $data['url'] = str_replace('/committee/papers', '/committee/research', $data['url']);
        Illuminate\Support\Facades\DB::table('notifications')
            ->where('id', $n->id)
            ->update(['data' => json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
    }
}
echo "Done replacing URLs properly.\n";
