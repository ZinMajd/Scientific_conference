<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\PaperAssignment;
use App\Models\PaperReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewerController extends Controller
{
    public function stats()
    {
        $user = Auth::user();
        return response()->json([
            'pending_invitations' => PaperAssignment::where('reviewer_id', $user->id)->where('status', 'assigned')->count(),
            'active_reviews' => PaperAssignment::where('reviewer_id', $user->id)->where('status', 'accepted')->count(),
            'completed_reviews' => PaperAssignment::where('reviewer_id', $user->id)->where('status', 'completed')->count(),
        ]);
    }

    public function assignments()
    {
        $user = Auth::user();
        return PaperAssignment::where('reviewer_id', $user->id)
            ->whereIn('status', ['assigned', 'accepted'])
            ->with(['paper.conference', 'paper.author'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function acceptAssignment($id)
    {
        $user = Auth::user();
        $assignment = PaperAssignment::where('id', $id)->where('reviewer_id', $user->id)->firstOrFail();
        
        $assignment->update(['status' => 'accepted']);
        
        // Update paper status to under_review if not already
        $paper = $assignment->paper;
        if ($paper->status !== Paper::STATUS_UNDER_REVIEW) {
            $paper->transitionStatus(Paper::STATUS_UNDER_REVIEW, 'بدأت عملية التحكيم بقبول المحكم للدعوة', $user->id);
        }

        return response()->json(['message' => 'تم قبول الدعوة بنجاح. يمكنك البدء في التحكيم الآن.']);
    }

    public function declineAssignment(Request $request, $id)
    {
        $user = Auth::user();
        $assignment = PaperAssignment::where('id', $id)->where('reviewer_id', $user->id)->firstOrFail();
        
        $assignment->update([
            'status' => 'declined',
            'decline_reason' => $request->reason
        ]);

        return response()->json(['message' => 'تم الاعتذار عن الدعوة. شكراً لوقتك.']);
    }

    public function submitReview(Request $request, $id)
    {
        $user = Auth::user();
        $assignment = PaperAssignment::where('id', $id)->where('reviewer_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'originality_score' => 'required|integer|min:1|max:10',
            'methodology_score' => 'required|integer|min:1|max:10',
            'results_score' => 'required|integer|min:1|max:10',
            'clarity_score' => 'required|integer|min:1|max:10',
            'comments_to_author' => 'required|string',
            'comments_to_editor' => 'nullable|string',
            'recommendation' => 'required|in:accept,minor_revision,major_revision,reject',
        ]);

        return DB::transaction(function () use ($validated, $assignment, $user) {
            // Calculate Average
            $avg = ($validated['originality_score'] + $validated['methodology_score'] + 
                    $validated['results_score'] + $validated['clarity_score']) / 4;

            $review = PaperReview::create([
                'paper_id' => $assignment->paper_id,
                'reviewer_id' => $user->id,
                'assignment_id' => $assignment->id,
                'originality_score' => $validated['originality_score'],
                'methodology_score' => $validated['methodology_score'],
                'results_score' => $validated['results_score'],
                'clarity_score' => $validated['clarity_score'],
                'total_avg_score' => $avg,
                'comments_to_author' => $validated['comments_to_author'],
                'comments_to_editor' => $validated['comments_to_editor'],
                'recommendation' => $validated['recommendation'],
            ]);

            $assignment->update(['status' => 'completed']);

            return response()->json([
                'message' => 'تم رفع التقييم العلمي بنجاح. شكراً لمساهمتك.',
                'review' => $review
            ]);
        });
    }

    public function history()
    {
        try {
            $user = Auth::user();
            \Log::info('Fetching history for reviewer: ' . $user->id);

            $assignments = PaperAssignment::where('reviewer_id', $user->id)
                ->where('status', 'completed')
                ->with(['paper.conference'])
                ->orderBy('updated_at', 'desc')
                ->get();

            \Log::info('Found assignments count: ' . $assignments->count());

            // Transform data to match frontend expectations
            return $assignments->map(function($assignment) {
                $review = DB::table('paper_reviews')
                    ->where('assignment_id', $assignment->id)
                    ->first();

                return [
                    'id' => $assignment->id,
                    'updated_at' => $assignment->updated_at,
                    'paper' => $assignment->paper,
                    'review' => $review ? [
                        'decision' => $review->recommendation,
                        'overall_score' => $review->total_avg_score,
                        'originality_score' => $review->originality_score,
                        'methodology_score' => $review->methodology_score,
                        'results_score' => $review->results_score,
                        'clarity_score' => $review->clarity_score,
                        'comments_to_author' => $review->comments_to_author,
                        'comments_to_editor' => $review->comments_to_editor,
                    ] : null
                ];
            });
        } catch (\Exception $e) {
            \Log::error('History Fetch Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
