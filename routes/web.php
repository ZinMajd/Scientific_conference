<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

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

// Consolidated API Routes in web.php to support sessions and avoid conflicts
Route::prefix('api')->group(function () {
    // Public Conference Routes (Now in web.php to use sessions if available)
    Route::get('/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'index']);
    Route::get('/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'show']);

    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::get('/topics', [\App\Http\Controllers\Api\TopicController::class, 'index']);
    Route::post('/conferences/{id}/register-attendance', [\App\Http\Controllers\Api\AttendeeController::class, 'register']);
    Route::get('/conferences/{id}/check-registration', [\App\Http\Controllers\Api\AttendeeController::class, 'checkRegistration']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Researcher Routes
        Route::get('/researcher/stats', [\App\Http\Controllers\Api\ResearcherController::class, 'stats']);
        Route::get('/researcher/papers', [\App\Http\Controllers\Api\ResearcherController::class, 'papers']);
        Route::get('/researcher/reviews', [\App\Http\Controllers\Api\ResearcherController::class, 'reviews']);
        Route::get('/researcher/reviewed-papers', [\App\Http\Controllers\Api\ResearcherController::class, 'reviewedPapers']);

        // Reviewer Routes
        Route::get('/reviewer/stats', [\App\Http\Controllers\Api\ReviewerController::class, 'stats']);
        Route::get('/reviewer/assignments', [\App\Http\Controllers\Api\ReviewerController::class, 'assignments']);
        Route::get('/reviewer/assignments/{id}', [\App\Http\Controllers\Api\ReviewerController::class, 'assignment']);
        Route::post('/reviewer/assignments/{id}/submit', [\App\Http\Controllers\Api\ReviewerController::class, 'submitReview']);
        Route::get('/reviewer/history', [\App\Http\Controllers\Api\ReviewerController::class, 'history']);

        // Committee Routes
        Route::get('/committee/stats', [\App\Http\Controllers\Api\CommitteeController::class, 'stats']);
        Route::get('/committee/papers', [\App\Http\Controllers\Api\CommitteeController::class, 'papers']);
        Route::get('/committee/papers/export', [\App\Http\Controllers\Api\CommitteeController::class, 'exportPapers']);
        Route::post('/committee/papers/{id}/assign', [\App\Http\Controllers\Api\CommitteeController::class, 'assignReviewer']);
        Route::post('/committee/papers/{id}/decision', [\App\Http\Controllers\Api\CommitteeController::class, 'decision']);
        Route::get('/committee/reviewers', [\App\Http\Controllers\Api\CommitteeController::class, 'reviewers']);
        Route::post('/committee/reviewers', [\App\Http\Controllers\Api\CommitteeController::class, 'addReviewer']);
        Route::put('/committee/reviewers/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'updateReviewer']);
        Route::delete('/committee/reviewers/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'deleteReviewer']);
        Route::post('/committee/papers/{id}/classify', [\App\Http\Controllers\Api\CommitteeController::class, 'classifyAndSchedule']);
        Route::post('/committee/papers/{id}/invite', [\App\Http\Controllers\Api\CommitteeController::class, 'sendInvitation']);

        // Conference Management
        Route::get('/committee/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'committeeIndex']);
        Route::post('/committee/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'store']);
        Route::put('/committee/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'update']);
        Route::delete('/committee/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'destroy']);

        // Reports
        Route::get('/committee/reports/papers', [\App\Http\Controllers\Api\ReportController::class, 'papers']);
        Route::get('/committee/reports/reviewers', [\App\Http\Controllers\Api\ReportController::class, 'reviewers']);
        Route::get('/committee/reports/attendees', [\App\Http\Controllers\Api\ReportController::class, 'attendees']);

        // Paper Submission & Management
        Route::get('/papers', [\App\Http\Controllers\Api\PaperController::class, 'index']);
        Route::post('/papers', [\App\Http\Controllers\Api\PaperController::class, 'store']);
        Route::get('/papers/{id}', [\App\Http\Controllers\Api\PaperController::class, 'show']);
        Route::get('/papers/{id}/download', [\App\Http\Controllers\Api\PaperController::class, 'download']);
        Route::post('/papers/{id}/screening', [\App\Http\Controllers\Api\PaperController::class, 'initialScreening']);
        Route::post('/papers/{id}/revision', [\App\Http\Controllers\Api\PaperController::class, 'submitRevision']);
        Route::post('/papers/{id}/finalize', [\App\Http\Controllers\Api\PaperController::class, 'finalAcceptance']);

        // Logout
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    });
});
