<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\User;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicJournalController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function announcements(): JsonResponse
    {
        $announcements = Announcement::query()
            ->where('is_active', true)
            ->orderBy('publish_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($announcements);
    }

    /**
     * @return JsonResponse
     */
    public function editorialTeam(): JsonResponse
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
        $users = User::query()
            ->whereIn('user_type', ['chair', 'committee', 'editor', 'office', 'production_office', 'reviewer'])
            ->get(['id', 'full_name', 'user_type', 'affiliation', 'bio', 'profile_image']);

        return response()->json([
            'editors_in_chief' => $users->where('user_type', 'chair')->values(),
            'editors' => $users->where('user_type', 'editor')->values(),
            'office' => $users->where('user_type', 'office')->values(),
            'production' => $users->where('user_type', 'production_office')->values(),
            'reviewers' => $users->where('user_type', 'reviewer')->values(),
            'advisory' => $users->where('user_type', 'committee')->values(),
        ]);
    }

    /**
     * @return JsonResponse
     */
    public function topicalCollections(): JsonResponse
    {
        // Conferences that are open or reviewing can be considered active collections
        $collections = Conference::query()
            ->whereIn('status', ['open', 'reviewing'])
            ->orderBy('start_date', 'desc')
            ->get(['id', 'title', 'description', 'submission_deadline', 'venue']);

        return response()->json($collections);
    }
}
