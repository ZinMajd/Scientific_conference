<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = App\Models\User::whereIn('user_type', ['chair'])->get();
foreach($users as $user) {
    if (strpos($user->full_name, 'مجد') === false && strpos($user->full_name, 'majd') === false) {
        $user->user_type = 'editor';
        $user->save();
        echo "Changed " . $user->full_name . " to editor\n";
    }
}

$majdUsers = App\Models\User::where('full_name', 'like', '%مجد%')->orWhere('full_name', 'like', '%majd%')->get();
foreach($majdUsers as $majd) {
    $majd->user_type = 'chair';
    $majd->save();
    echo "Changed " . $majd->full_name . " to chair\n";
}
