<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;



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
            $headers = [];
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if ($ext === 'pdf') {
                $headers = [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"'
                ];
            } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                $headers = [
                    'Content-Type' => 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext),
                    'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"'
                ];
            }
            return response()->file($filePath, $headers);
        }
    }

    // Fallback: If path already contains 'public/' or 'private/'
    $directPath = storage_path('app/' . $path);
    if (file_exists($directPath) && !is_dir($directPath)) {
        $headers = [];
        $ext = strtolower(pathinfo($directPath, PATHINFO_EXTENSION));
        if ($ext === 'pdf') {
            $headers = [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($directPath) . '"'
            ];
        } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
            $headers = [
                'Content-Type' => 'image/' . ($ext === 'jpg' ? 'jpeg' : $ext),
                'Content-Disposition' => 'inline; filename="' . basename($directPath) . '"'
            ];
        }
        return response()->file($directPath, $headers);
    }

    \Illuminate\Support\Facades\Log::error("File not found in any storage base: " . $path);
    
    // Fallback for missing files in development/demo environments
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (in_array($ext, ['pdf', 'doc', 'docx'])) {
        $dummyPath = public_path('dummy.pdf');
        if (file_exists($dummyPath)) {
            return response()->file($dummyPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="fallback_document.pdf"'
            ]);
        }
    }

    abort(404, 'File not found');
})->where('path', '.*');

// Secure routes to run migrations in production (Vercel)
Route::get('/run-migrations-prod', function (Request $request) {
    if ($request->query('secret') !== 'saba2026') {
        abort(403, 'Unauthorized');
    }
    try {
        echo "Starting migrations on production database...<br>";
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        echo "<h3>Migrations Output:</h3><pre>" . \Illuminate\Support\Facades\Artisan::output() . "</pre>";
        echo "<strong>Successfully completed migrations!</strong>";
    } catch (\Exception $e) {
        echo "<strong>Error running migrations:</strong> " . $e->getMessage();
    }
});

Route::get('/migration-status-prod', function (Request $request) {
    if ($request->query('secret') !== 'saba2026') {
        abort(403, 'Unauthorized');
    }
    try {
        echo "Checking migrations status on production database...<br>";
        \Illuminate\Support\Facades\Artisan::call('migrate:status');
        echo "<h3>Migration Status:</h3><pre>" . \Illuminate\Support\Facades\Artisan::output() . "</pre>";
    } catch (\Exception $e) {
        echo "<strong>Error checking status:</strong> " . $e->getMessage();
    }
});

Route::get('/seed-users-prod', function (Request $request) {
    if ($request->query('secret') !== 'saba2026') {
        abort(403, 'Unauthorized');
    }
    try {
        echo "Starting role seeder and user accounts generation...<br>";
        
        // 1. Run RolesAndPermissionsSeeder to ensure roles table is fully populated
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'Database\Seeders\RolesAndPermissionsSeeder',
            '--force' => true
        ]);
        echo "Roles and permissions seeded successfully!<br><br>";

        // 2. Define our target users list
        $targetUsers = [
            [
                'username' => 'admin',
                'email' => 'admin@sabauni.edu.ye',
                'password' => 'password',
                'user_type' => 'chair', // matches the default type for admin in seeder
                'full_name' => 'مدير النظام',
                'role_slug' => 'system_admin'
            ],
            [
                'username' => 'sara',
                'email' => 'sara@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'author',
                'full_name' => 'الباحث سارة',
                'role_slug' => 'author'
            ],
            [
                'username' => 'muhmd',
                'email' => 'muhmd@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'office',
                'full_name' => 'مكتب التحرير محمد',
                'role_slug' => 'editorial_office'
            ],
            [
                'username' => 'sumia',
                'email' => 'sumia@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'reviewer',
                'full_name' => 'المحكم سمية',
                'role_slug' => 'reviewer'
            ],
            [
                'username' => 'majd',
                'email' => 'majd@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'committee',
                'full_name' => 'اللجنة العلمية مجد',
                'role_slug' => 'scientific_committee'
            ],
            [
                'username' => 'mohammed',
                'email' => 'mohammed@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'chair',
                'full_name' => 'رئيس المؤتمر محمد',
                'role_slug' => 'conference_chair'
            ],
            [
                'username' => 'مجد',
                'email' => 'majd_editor@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'editor',
                'full_name' => 'المحرر مجد',
                'role_slug' => 'editor'
            ],
            [
                'username' => 'production',
                'email' => 'production@sabauni.edu.ye',
                'password' => '12345678',
                'user_type' => 'production_office',
                'full_name' => 'مكتب الإنتاج والنشر',
                'role_slug' => 'production_office'
            ]
        ];

        foreach ($targetUsers as $uData) {
            // Find user by username or email
            $user = \App\Models\User::where('username', $uData['username'])
                ->orWhere('email', $uData['email'])
                ->first();

            if ($user) {
                // Update existing user
                $user->username = $uData['username'];
                $user->email = $uData['email'];
                $user->password = \Illuminate\Support\Facades\Hash::make($uData['password']);
                $user->user_type = $uData['user_type'];
                $user->full_name = $uData['full_name'];
                $user->is_active = true;
                $user->save();
                echo "Updated user: <strong>{$uData['username']}</strong> (Role: {$uData['role_slug']})<br>";
            } else {
                // Create new user
                $user = \App\Models\User::create([
                    'username' => $uData['username'],
                    'email' => $uData['email'],
                    'password' => \Illuminate\Support\Facades\Hash::make($uData['password']),
                    'user_type' => $uData['user_type'],
                    'full_name' => $uData['full_name'],
                    'is_active' => true,
                ]);
                echo "Created user: <strong>{$uData['username']}</strong> (Role: {$uData['role_slug']})<br>";
            }

            // Sync user role
            $role = \App\Models\Role::where('slug', $uData['role_slug'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
                echo "&nbsp;&nbsp;-> Role <em>{$uData['role_slug']}</em> assigned successfully.<br>";
            } else {
                echo "&nbsp;&nbsp;-> <span style='color:red;'>Role {$uData['role_slug']} not found!</span><br>";
            }
        }
        
        echo "<br><strong>All users configured and verified successfully!</strong>";
    } catch (\Exception $e) {
        echo "<strong>Error seeding users:</strong> " . $e->getMessage();
    }
});

// Seed sample published papers into all conferences (for production Supabase)
Route::get('/seed-papers-prod', function (Request $request) {
    if ($request->query('secret') !== 'saba2026') {
        abort(403, 'Unauthorized');
    }
    try {
        ob_start();
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'Database\\Seeders\\SamplePapersSeeder',
            '--force' => true,
        ]);
        $output = ob_get_clean() . \Illuminate\Support\Facades\Artisan::output();
        echo "<h3>Sample Papers Seeder Output:</h3><pre>" . htmlspecialchars($output) . "</pre>";
        echo "<strong>Done! Published papers have been added to all conferences.</strong>";
    } catch (\Exception $e) {
        echo "<strong>Error:</strong> " . $e->getMessage();
    }
});

Route::view('/{path?}', 'welcome')->where('path', '^(?!api).*$');

// Consolidated API Routes in web.php to support sessions and avoid conflicts
Route::prefix('api')->group(function () {
    // Public Conference Routes (Now in web.php to use sessions if available)
    Route::get('/conferences', [\App\Http\Controllers\Api\ConferenceController::class, 'index']);
    Route::get('/conferences/{id}', [\App\Http\Controllers\Api\ConferenceController::class, 'show']);
    Route::get('/archive', [\App\Http\Controllers\Api\PaperController::class, 'archive']);
    Route::get('/article/{id}', [\App\Http\Controllers\Api\PaperController::class, 'publicShow']);
    Route::post('/article/{id}/download-stat', [\App\Http\Controllers\Api\PaperController::class, 'recordDownload']);
    
    // Journal Specific Routes
    Route::get('/journal/announcements', [\App\Http\Controllers\Api\PublicJournalController::class, 'announcements']);
    Route::get('/journal/editorial-team', [\App\Http\Controllers\Api\PublicJournalController::class, 'editorialTeam']);
    Route::get('/journal/topical-collections', [\App\Http\Controllers\Api\PublicJournalController::class, 'topicalCollections']);
    Route::get('/stats', [\App\Http\Controllers\Api\PublicStatsController::class, 'index']);

    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::get('/topics', [\App\Http\Controllers\Api\TopicController::class, 'index']);
    Route::post('/conferences/{id}/register-attendance', [\App\Http\Controllers\Api\AttendeeController::class, 'register']);
    Route::get('/conferences/{id}/check-registration', [\App\Http\Controllers\Api\AttendeeController::class, 'checkRegistration']);

    Route::get('/invitation/verify', [\App\Http\Controllers\Api\CommitteeController::class, 'verifyInvitation']);
    Route::post('/invitation/complete', [\App\Http\Controllers\Api\CommitteeController::class, 'registerFromInvitation']);
    Route::post('/support', [\App\Http\Controllers\SupportController::class, 'store']);

    // Password Reset Routes (public)
    Route::post('/forgot-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'resetPassword']);

Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Profile Update
        Route::post('/profile/update', [\App\Http\Controllers\Api\ProfileController::class, 'update']);

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

            // Archive - Published papers for production office
            Route::get('/production/archive', function () {
                $papers = \App\Models\Paper::with(['author', 'conference'])
                    ->where(function($q) {
                        $q->where('is_published', 'true')
                          ->orWhere('status', 'published');
                    })
                    ->orderBy('updated_at', 'desc')
                    ->paginate(20);
                return $papers;
            });
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
