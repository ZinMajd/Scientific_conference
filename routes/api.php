<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ConferenceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResearcherController;
use App\Http\Controllers\Api\ReviewerController;
use App\Http\Controllers\Api\CommitteeController;

// Public Routes
Route::get('/conferences', [ConferenceController::class, 'index']);
Route::get('/conferences/{id}', [ConferenceController::class, 'show']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Researcher Routes
    Route::get('/researcher/stats', [ResearcherController::class, 'stats']);
    Route::get('/researcher/papers', [ResearcherController::class, 'papers']);
    Route::get('/researcher/reviews', [ResearcherController::class, 'reviews']);
    Route::get('/researcher/reviewed-papers', [ResearcherController::class, 'reviewedPapers']);

    // Reviewer Routes
    Route::get('/reviewer/stats', [ReviewerController::class, 'stats']);
    Route::get('/reviewer/assignments', [ReviewerController::class, 'assignments']);
    Route::get('/reviewer/assignments/{id}', [ReviewerController::class, 'assignment']);
    Route::post('/reviewer/assignments/{id}/submit', [ReviewerController::class, 'submitReview']);
    Route::get('/reviewer/history', [ReviewerController::class, 'history']);

    // Committee Routes
    Route::get('/committee/stats', [CommitteeController::class, 'stats']);
    Route::get('/committee/papers', [CommitteeController::class, 'papers']);
    Route::get('/committee/papers/export', [CommitteeController::class, 'exportPapers']);
    Route::post('/committee/papers/{id}/assign', [CommitteeController::class, 'assignReviewer']);
    Route::post('/committee/papers/{id}/decision', [CommitteeController::class, 'decision']);
    Route::get('/committee/reviewers', [CommitteeController::class, 'reviewers']);
    Route::post('/committee/reviewers', [CommitteeController::class, 'addReviewer']);
    Route::put('/committee/reviewers/{id}', [CommitteeController::class, 'updateReviewer']);
    Route::delete('/committee/reviewers/{id}', [CommitteeController::class, 'deleteReviewer']);

    // Conference Management
    Route::get('/committee/conferences', [ConferenceController::class, 'committeeIndex']);
    Route::post('/committee/conferences', [ConferenceController::class, 'store']);
    Route::put('/committee/conferences/{id}', [ConferenceController::class, 'update']);
    Route::delete('/committee/conferences/{id}', [ConferenceController::class, 'destroy']);

    // Reports
    Route::get('/committee/reports/papers', [App\Http\Controllers\Api\ReportController::class, 'papers']);
    Route::get('/committee/reports/reviewers', [App\Http\Controllers\Api\ReportController::class, 'reviewers']);
    Route::get('/committee/reports/attendees', [App\Http\Controllers\Api\ReportController::class, 'attendees']);

    // Paper Submission & Management
    Route::get('/papers', [App\Http\Controllers\Api\PaperController::class, 'index']);
    Route::post('/papers', [App\Http\Controllers\Api\PaperController::class, 'store']);
    Route::get('/papers/{id}', [App\Http\Controllers\Api\PaperController::class, 'show']);
    Route::get('/papers/{id}/download', [App\Http\Controllers\Api\PaperController::class, 'download']);
    Route::post('/papers/{id}/screening', [App\Http\Controllers\Api\PaperController::class, 'initialScreening']);
    Route::post('/papers/{id}/revision', [App\Http\Controllers\Api\PaperController::class, 'submitRevision']);
    Route::post('/papers/{id}/finalize', [App\Http\Controllers\Api\PaperController::class, 'finalAcceptance']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
