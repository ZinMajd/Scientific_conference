<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check environment variables
$supabaseUrl  = rtrim(env('SUPABASE_URL', env('VITE_SUPABASE_URL', '')), '/');
$serviceKey   = env('SUPABASE_SERVICE_KEY');
$anonKey      = env('VITE_SUPABASE_ANON_KEY', '');
$bucket       = env('SUPABASE_BUCKET', 'papers');

echo "=== Supabase Config ===\n";
echo "URL: " . ($supabaseUrl ?: 'NOT SET') . "\n";
echo "SERVICE_KEY: " . ($serviceKey ? substr($serviceKey, 0, 20) . '...' : 'NOT SET') . "\n";
echo "ANON_KEY: " . ($anonKey ? substr($anonKey, 0, 20) . '...' : 'NOT SET') . "\n";
echo "BUCKET: $bucket\n";

// Check what key will be used
if (!$serviceKey || $serviceKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE') {
    $usedKey = $anonKey;
    echo "\n⚠️  Using ANON KEY (SERVICE_KEY not set)\n";
} else {
    $usedKey = $serviceKey;
    echo "\n✅ Using SERVICE_KEY\n";
}

// Test upload a small test image
echo "\n=== Testing Upload ===\n";
if ($supabaseUrl && $usedKey) {
    // Create a tiny test PNG (1x1 pixel)
    $imgData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    $tmpFile = tempnam(sys_get_temp_dir(), 'test_thumb_') . '.png';
    file_put_contents($tmpFile, $imgData);

    $fileName = 'papers/thumbnails/debug_test_' . time() . '.png';
    $response = \Illuminate\Support\Facades\Http::withHeaders([
        'Authorization' => 'Bearer ' . $usedKey,
        'apikey'        => $usedKey,
        'Content-Type'  => 'image/png',
        'x-upsert'      => 'true',
    ])->withBody($imgData, 'image/png')
      ->post("{$supabaseUrl}/storage/v1/object/{$bucket}/{$fileName}");

    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
    if ($response->successful()) {
        echo "✅ Upload SUCCESS!\n";
        echo "URL: {$supabaseUrl}/storage/v1/object/public/{$bucket}/{$fileName}\n";
    } else {
        echo "❌ Upload FAILED\n";
    }
    unlink($tmpFile);
} else {
    echo "❌ Supabase not configured\n";
}

// Check a paper with thumbnail
echo "\n=== Papers with thumbnail_path ===\n";
$papers = \App\Models\Paper::whereNotNull('thumbnail_path')->limit(3)->get(['id','title','thumbnail_path']);
foreach ($papers as $p) {
    echo "ID: {$p->id} | thumbnail_path: {$p->thumbnail_path}\n";
}
if ($papers->isEmpty()) {
    echo "No papers have thumbnail_path set\n";
}
