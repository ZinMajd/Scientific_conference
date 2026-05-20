<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$rev = App\Models\User::where('user_type', 'reviewer')->count();
$prod = App\Models\User::where('user_type', 'production_office')->count();
echo "Reviewers: " . $rev . "\n";
echo "Production Office: " . $prod . "\n";
