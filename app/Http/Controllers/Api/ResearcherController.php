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
            ->with('conference:id,title')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function reviews()
    {
        $user = Auth::user();
        $papers = Paper::where('author_id', $user->id)
            ->with([
                'assignments.review' => function ($q) {
                    $q->where('is_submitted', true);
                },
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
                        'decision' => $assignment->review->decision,
                        'score' => $assignment->review->overall_score,
                        'comments' => $assignment->review->comments_author,
                        'date' => $assignment->review->submission_date ? $assignment->review->submission_date->format('Y-m-d') : $assignment->review->updated_at->format('Y-m-d'),
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
}
