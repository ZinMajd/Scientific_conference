<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResearcherController extends Controller
{
    public function stats()
    {
        $user = Auth::user();

        return response()->json([
            'papers_count' => Paper::where('author_id', $user->id)->count(),
            'accepted_count' => Paper::where('author_id', $user->id)->whereIn('status', ['accepted', 'scheduled'])->count(),
            'under_review' => Paper::where('author_id', $user->id)->where('status', 'under_review')->count(),
            'with_editor' => Paper::where('author_id', $user->id)->whereIn('status', ['technical_check', 'with_editor'])->count(),
            'active_conferences' => Conference::where('status', 'open')->count(),
        ]);
    }

    public function papers()
    {
        $user = Auth::user();
        return Paper::where('author_id', $user->id)
            ->with(['conference:id,title', 'sessions', 'statusHistory'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function reviews()
    {
        $user = Auth::user();
        $papers = Paper::where('author_id', $user->id)
            ->with([
                'assignments.review',
                'conference:id,title'
            ])
            ->get();

        $reviews = [];
        foreach ($papers as $paper) {
            foreach ($paper->assignments as $assignment) {
                if ($assignment->review) {
                    $reviews[] = [
                        'id' => $assignment->review->id,
                        'paper_title' => $paper->title,
                        'conference' => $paper->conference->title,
                        'decision' => $assignment->review->recommendation,
                        'score' => $assignment->review->total_avg_score,
                        'comments' => $assignment->review->comments_to_author,
                        'date' => $assignment->review->created_at ? $assignment->review->created_at->format('Y-m-d') : null,
                    ];
                }
            }
        }

        return response()->json($reviews);
    }

    public function reviewedPapers()
    {
        $user = Auth::user();
        return Paper::where('author_id', $user->id)
            ->where(function ($query) {
                $query->whereIn('status', ['accepted', 'rejected'])
                    ->orWhere(function ($sub) {
                        $sub->where('status', 'under_review')
                            ->whereHas('assignments', function ($q) {
                                $q->where('status', 'completed');
                            });
                    });
            })
            ->with('conference:id,title')
            ->orderBy('updated_at', 'desc')
            ->get();
    }
    public function submitCameraReady(Request $request, $id)
    {
        $request->validate([
            'camera_ready_file' => 'required|file|mimes:pdf|max:20480',
            'notes' => 'nullable|string',
        ]);

        $paper = Paper::findOrFail($id);

        if ($paper->author_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($paper->status !== Paper::STATUS_ACCEPTED && $paper->status !== Paper::STATUS_SCHEDULED) {
            return response()->json(['message' => 'البحث لم يتم قبوله نهائياً بعد.'], 422);
        }

        $file = $request->file('camera_ready_file');
        $path = $file->store('papers/camera_ready');

        // Create a new version
        \App\Models\PaperVersion::create([
            'paper_id' => $paper->id,
            'version_number' => $paper->versions()->count() + 1,
            'file_path' => $path,
            'type' => 'camera_ready',
            'author_comments' => $request->notes,
        ]);

        return response()->json(['message' => 'تم رفع النسخة النهائية (Camera Ready) بنجاح.']);
    }
}
