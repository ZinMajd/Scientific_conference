<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::middleware(['auth:sanctum'])->prefix('researcher')->name('researcher.')->group(function () {
    Route::resource('papers', \App\Http\Controllers\Researcher\PaperController::class);
    Route::post('papers/{id}/revision', [\App\Http\Controllers\Api\PaperController::class, 'submitRevision']);
});


// Temporary fix for serving files on Windows due to symlink issues
Route::get('/storage_file/{path}', function ($path) {
    // List of possible base directories to check
    $bases = [
        storage_path('app/public/'),
        storage_path('app/private/'),
        storage_path('app/'),
    ];

    foreach ($bases as $base) {
        $filePath = $base . $path;
        if (file_exists($filePath) && !is_dir($filePath)) {
            return response()->file($filePath);
        }
    }

    // Fallback: If path already contains 'public/' or 'private/'
    $directPath = storage_path('app/' . $path);
    if (file_exists($directPath) && !is_dir($directPath)) {
        return response()->file($directPath);
    }

    \Illuminate\Support\Facades\Log::error("File not found in any storage base: " . $path);
    abort(404, 'File not found');
})->where('path', '.*');

Route::view('/{path?}', 'welcome')->where('path', '^(?!api).*$');

// Consolidated API Routes in web.php to support sessions and avoid conflicts
Route::prefix('api')->group(function () {
    // Public Conference Routes (Now in web.php to use sessions if available)
    Route::get('/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'index']);
    Route::get('/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'show']);
    Route::get('/archive', [\App\Http\Controllers\Api\PaperController::class, 'archive']);
    Route::get('/stats', [\App\Http\Controllers\Api\PublicStatsController::class, 'index']);

    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::get('/topics', [\App\Http\Controllers\Api\TopicController::class, 'index']);
    Route::post('/conferences/{id}/register-attendance', [\App\Http\Controllers\Api\AttendeeController::class, 'register']);
    Route::get('/conferences/{id}/check-registration', [\App\Http\Controllers\Api\AttendeeController::class, 'checkRegistration']);

    Route::get('/invitation/verify', [\App\Http\Controllers\Api\CommitteeController::class, 'verifyInvitation']);
    Route::post('/invitation/complete', [\App\Http\Controllers\Api\CommitteeController::class, 'registerFromInvitation']);
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store']);


Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
        Route::post('/notifications/mark-all-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

        // Researcher Routes (Available to all authenticated users)
        Route::get('/researcher/stats', [\App\Http\Controllers\Api\ResearcherController::class, 'stats']);
        Route::get('/researcher/papers', [\App\Http\Controllers\Api\ResearcherController::class, 'papers']);
        Route::get('/researcher/reviews', [\App\Http\Controllers\Api\ResearcherController::class, 'reviews']);
        Route::get('/researcher/reviewed-papers', [\App\Http\Controllers\Api\ResearcherController::class, 'reviewedPapers']);
        Route::post('/researcher/papers/{id}/camera-ready', [\App\Http\Controllers\Api\ResearcherController::class, 'submitCameraReady']);

        // Reviewer Routes (Available to all authenticated users who have assignments)
        Route::get('/reviewer/stats', [\App\Http\Controllers\Api\ReviewerController::class, 'stats']);
        Route::get('/reviewer/assignments', [\App\Http\Controllers\Api\ReviewerController::class, 'assignments']);
        Route::get('/reviewer/assignments/{id}', [\App\Http\Controllers\Api\ReviewerController::class, 'assignment']);
        Route::post('/reviewer/assignments/{id}/submit', [\App\Http\Controllers\Api\ReviewerController::class, 'submitReview']);
        Route::get('/reviewer/history', [\App\Http\Controllers\Api\ReviewerController::class, 'history']);


        // Committee Routes (Shared between all committee roles)
        Route::middleware(['role:scientific_committee,editor,editorial_office,conference_chair,production_office'])->group(function () {

            Route::get('/committee/stats', [\App\Http\Controllers\Api\CommitteeController::class, 'stats']);
            Route::get('/committee/papers', [\App\Http\Controllers\Api\CommitteeController::class, 'papers']);
            Route::get('/committee/papers/export', [\App\Http\Controllers\Api\CommitteeController::class, 'exportPapers']);
            Route::get('/committee/reviewers', [\App\Http\Controllers\Api\CommitteeController::class, 'reviewers']);
            Route::post('/committee/reviewers', [\App\Http\Controllers\Api\CommitteeController::class, 'addReviewer']);
            Route::delete('/committee/reviewers/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'deleteReviewer']);
            Route::post('/committee/reviewers/invite', [\App\Http\Controllers\Api\CommitteeController::class, 'sendInvitation']);
            Route::get('/committee/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'committeeIndex']);
            
            // Editor Specific
            Route::post('/committee/papers/{id}/assign', [\App\Http\Controllers\Api\CommitteeController::class, 'assignReviewer']);
            Route::get('/committee/papers/{id}/reviews-aggregation', [\App\Http\Controllers\Api\CommitteeController::class, 'reviewsAggregation']);
            
            // Scientific Committee Specific
            Route::post('/committee/papers/{id}/decision', [\App\Http\Controllers\Api\CommitteeController::class, 'decision']);
            Route::post('/committee/papers/{id}/decision-level', [\App\Http\Controllers\Api\CommitteeController::class, 'submitDecisionLevel']);
            Route::post('/committee/papers/{id}/classify-schedule', [\App\Http\Controllers\Api\CommitteeController::class, 'classifyAndSchedule']);
            Route::post('/committee/papers/{id}/send-invitation', [\App\Http\Controllers\Api\CommitteeController::class, 'sendAuthorInvitation']);
            
            Route::post('/committee/papers/{id}/mark-as-published', [\App\Http\Controllers\Api\CommitteeController::class, 'markAsPublished']);
            
            // Sessions
            Route::get('/committee/sessions', [\App\Http\Controllers\Api\CommitteeController::class, 'sessions']);
            Route::post('/committee/sessions', [\App\Http\Controllers\Api\CommitteeController::class, 'storeSession']);
            Route::put('/committee/sessions/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'updateSession']);
            Route::delete('/committee/sessions/{id}', [\App\Http\Controllers\Api\CommitteeController::class, 'deleteSession']);

            // Office Specific
            Route::get('/committee/reports/papers', [\App\Http\Controllers\Api\ReportController::class, 'papers']);
            Route::get('/committee/reports/reviewers', [\App\Http\Controllers\Api\ReportController::class, 'reviewers']);
            Route::get('/committee/reports/attendees', [\App\Http\Controllers\Api\ReportController::class, 'attendees']);

            // Production Office Routes
            Route::get('/production/papers', [\App\Http\Controllers\Api\ProductionController::class, 'papers']);
            Route::post('/production/papers/{id}/send', [\App\Http\Controllers\Api\ProductionController::class, 'sendToProduction']);
            Route::post('/production/papers/{id}/update', [\App\Http\Controllers\Api\ProductionController::class, 'updateProduction']);
            Route::post('/production/papers/{id}/ready', [\App\Http\Controllers\Api\ProductionController::class, 'markReadyForPublish']);
            Route::post('/production/papers/{id}/publish', [\App\Http\Controllers\Api\ProductionController::class, 'publishNow']);
            Route::post('/production/papers/{id}/return', [\App\Http\Controllers\Api\ProductionController::class, 'returnToAuthor']);
        });


        // Conference Management (Admin/Chair/Editor)
        Route::middleware(['role:conference_chair,editor,system_admin'])->group(function () {
            Route::post('/committee/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'store']);
            Route::put('/committee/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'update']);
            Route::delete('/committee/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'destroy']);
        });

        // Paper Submission & Management (General authenticated users)
        Route::get('/papers', [\App\Http\Controllers\Api\PaperController::class, 'index']);
        Route::post('/papers', [\App\Http\Controllers\Api\PaperController::class, 'store']);
        Route::get('/papers/{id}', [\App\Http\Controllers\Api\PaperController::class, 'show']);
        Route::get('/papers/{id}/download', [\App\Http\Controllers\Api\PaperController::class, 'download']);
        Route::post('/papers/{id}/screening', [\App\Http\Controllers\Api\PaperController::class, 'initialScreening']);
        Route::post('/papers/{id}/anonymize', [\App\Http\Controllers\Api\PaperController::class, 'anonymize']);
        Route::post('/papers/{id}/revision', [\App\Http\Controllers\Api\PaperController::class, 'submitRevision']);
        Route::post('/papers/{id}/finalize', [\App\Http\Controllers\Api\PaperController::class, 'finalAcceptance']);
        Route::post('/papers/{id}/resubmit-production', [\App\Http\Controllers\Api\ProductionController::class, 'resubmitToProduction']);


        // Logout
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
        // Reviewer Operations
        Route::prefix('reviewer')->group(function () {
            Route::get('/stats', [\App\Http\Controllers\Api\ReviewerController::class, 'stats']);
            Route::get('/assignments', [\App\Http\Controllers\Api\ReviewerController::class, 'assignments']);
            Route::post('/assignments/{id}/accept', [\App\Http\Controllers\Api\ReviewerController::class, 'acceptAssignment']);
            Route::post('/assignments/{id}/decline', [\App\Http\Controllers\Api\ReviewerController::class, 'declineAssignment']);
            Route::post('/assignments/{id}/review', [\App\Http\Controllers\Api\ReviewerController::class, 'submitReview']);
        });
    });
});
