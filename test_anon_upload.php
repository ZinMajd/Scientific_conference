<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

$supabaseUrl  = rtrim(env('VITE_SUPABASE_URL', ''), '/');
$supabaseKey  = env('VITE_SUPABASE_ANON_KEY', '');
$bucket       = 'papers';

echo "URL: $supabaseUrl\n";

if ($supabaseUrl && $supabaseKey) {
    $fileName    = 'papers/thumbnails/' . Str::uuid() . '.txt';
    $fileContent = 'test content';
    $mimeType    = 'text/plain';

    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $supabaseKey,
        'apikey'        => $supabaseKey,
        'Content-Type'  => $mimeType,
        'x-upsert'      => 'true',
    ])->withBody($fileContent, $mimeType)
      ->post("{$supabaseUrl}/storage/v1/object/{$bucket}/{$fileName}");

    if ($response->successful()) {
        echo "Upload successful! URL: {$supabaseUrl}/storage/v1/object/public/{$bucket}/{$fileName}\n";
    } else {
        echo "Upload failed!\nStatus: " . $response->status() . "\nBody: " . $response->body() . "\n";
    }
} else {
    echo "Keys missing!\n";
}
