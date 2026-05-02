<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\User;
use App\Models\Conference;
use Illuminate\Http\Request;

class PublicJournalController extends Controller
{
    public function announcements()
    {
        return Announcement::where('is_active', true)
            ->orderBy('publish_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function editorialTeam()
    {
        // Fetch committee members, chairs, and editors
        $users = User::whereIn('user_type', ['chair', 'committee', 'editor'])
            ->orderByRaw("FIELD(user_type, 'chair', 'editor', 'committee')")
            ->get(['id', 'full_name', 'user_type', 'affiliation', 'bio', 'profile_photo_url']);

        // Group by role for the frontend
        return [
            'editors_in_chief' => $users->where('user_type', 'chair')->values(),
            'editors' => $users->where('user_type', 'editor')->values(),
            'committee' => $users->where('user_type', 'committee')->values(),
        ];
    }

    public function topicalCollections()
    {
        // Conferences that are open or reviewing can be considered active collections
        return Conference::whereIn('status', ['open', 'reviewing'])
            ->orderBy('start_date', 'desc')
            ->get(['id', 'title', 'description', 'submission_deadline', 'venue']);
    }
}
