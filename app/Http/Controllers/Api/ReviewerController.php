<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaperAssignment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewerController extends Controller
{
    public function stats()
    {
        $user = Auth::user();
        return response()->json([
            'pending_reviews' => PaperAssignment::where('reviewer_id', $user->id)->where('status', 'assigned')->count(),
            'completed_reviews' => PaperAssignment::where('reviewer_id', $user->id)->where('status', 'completed')->count(),
            'total_assigned' => PaperAssignment::where('reviewer_id', $user->id)->count(),
        ]);
    }

    public function assignments()
    {
        $user = Auth::user();
        return PaperAssignment::where('reviewer_id', $user->id)
            ->where('status', 'assigned')
            ->with(['paper.conference', 'paper.author'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function assignment($id)
    {
        $user = Auth::user();
        return PaperAssignment::where('id', $id)
            ->where('reviewer_id', $user->id)
            ->with(['paper.conference', 'paper.author'])
            ->firstOrFail();
    }

    public function history()
    {
        $user = Auth::user();
        return PaperAssignment::where('reviewer_id', $user->id)
            ->where('status', 'completed')
            ->with(['paper.conference', 'paper.author', 'review'])
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function submitReview(Request $request, $id)
    {
        $user = Auth::user();
        $assignment = PaperAssignment::where('id', $id)
            ->where('reviewer_id', $user->id)
            ->firstOrFail();

        $validated = $request->validate([
            'overall_score' => 'required|numeric|min:0|max:10',
            'originality' => 'required|integer|min:1|max:5',
            'relevance' => 'required|integer|min:1|max:5',
            'methodology' => 'required|integer|min:1|max:5',
            'presentation' => 'required|integer|min:1|max:5',
            'quality' => 'required|integer|min:1|max:5',
            'comments_author' => 'required|string',
            'comments_chair' => 'nullable|string',
            'decision' => 'required|string|in:accept,minor_revision,major_revision,reject',
        ]);

        $review = Review::updateOrCreate(
            ['assignment_id' => $assignment->id],
            [
                'overall_score' => $validated['overall_score'],
                'originality' => $validated['originality'],
                'relevance' => $validated['relevance'],
                'methodology' => $validated['methodology'],
                'presentation' => $validated['presentation'],
                'technical_quality' => $validated['quality'],
                'comments_author' => $validated['comments_author'],
                'comments_chair' => $validated['comments_chair'] ?? '',
                'decision' => $validated['decision'],
                'is_submitted' => true,
                'submission_date' => now(),
            ]
        );

        $assignment->status = 'completed';
        $assignment->save();

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review]);
    }
}
