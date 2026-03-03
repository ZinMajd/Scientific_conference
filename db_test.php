<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

try {
    echo "Testing DB Connection...\n";
    $dbName = DB::connection()->getDatabaseName();
    echo "Database: " . $dbName . "\n";

    echo "Attempting to create a test user...\n";
    $testUsername = 'testuser_' . time();
    $user = User::create([
        'username' => $testUsername,
        'email' => $testUsername . '@example.com',
        'password' => Hash::make('password123'),
        'full_name' => 'Test User',
        'user_type' => 'author',
    ]);

    if ($user && $user->exists) {
        echo "SUCCESS! User created with ID: " . $user->id . "\n";
        // Clean up
        $user->delete();
        echo "Test user deleted.\n";
    } else {
        echo "FAILED to create user.\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    Log::error('DB Test Failed', ['error' => $e->getMessage()]);
}
