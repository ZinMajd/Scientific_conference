<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::with('roles')->where('username', 'asihhh')->first();
echo "Testing as user: {$user->full_name} (roles: " . $user->roles->pluck('slug')->join(',') . ")\n\n";

$request = \Illuminate\Http\Request::create('/api/committee/papers', 'GET', ['page' => 1]);
$request->headers->set('Accept', 'application/json');
$request->setUserResolver(function() use ($user) { return $user; });

app()->instance('request', $request);
\Illuminate\Support\Facades\Auth::setUser($user);

try {
    $controller = app(\App\Http\Controllers\Api\CommitteeController::class);
    $result = $controller->papers($request);
    
    // The result is a LengthAwarePaginator directly
    $data = $result->toArray();
    echo "Response total: " . ($data['total'] ?? 'N/A') . "\n";
    echo "Response last_page: " . ($data['last_page'] ?? 'N/A') . "\n";
    echo "Response count (current page): " . count($data['data'] ?? []) . "\n";
    if (!empty($data['data'])) {
        foreach (array_slice($data['data'], 0, 3) as $p) {
            echo " - Paper: {$p['title']} ({$p['status']})\n";
        }
    }
    echo "\nFULL JSON response (first 2000 chars):\n";
    echo substr(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), 0, 2000);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Line: " . $e->getLine() . " in " . $e->getFile() . "\n";
}
