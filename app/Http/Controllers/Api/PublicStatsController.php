<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conference;
use App\Models\Paper;
use App\Models\User;

class PublicStatsController extends Controller
{
    public function index()
    {
        // Calculate real stats
        $activeConferences = Conference::whereIn('status', ['open', 'reviewing'])->count();
        $totalPapers = Paper::count();
        $totalUsers = User::count(); // Researchers and reviewers

        return response()->json([
            'conferences' => $activeConferences,
            'papers' => $totalPapers,
            'users' => $totalUsers,
        ]);
    }
}
