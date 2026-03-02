<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('researcher')->name('researcher.')->group(function () {
    Route::resource('papers', \App\Http\Controllers\Researcher\PaperController::class);
});


// Temporary fix for serving files on Windows due to symlink issues
Route::get('/storage_file/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*');

Route::view('/{path?}', 'welcome')->where('path', '^(?!api).*$');

