<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Conference;
use App\Models\User;
use App\Models\Attendee;
use App\Models\PaperAssignment;
use App\Models\NotificationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommitteeController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_papers' => Paper::count(),
            'total_conferences' => Conference::count(),
            'total_reviewers' => User::where('user_type', 'reviewer')->count(),
            'total_attendees' => Attendee::count(),
        ]);
    }

    public function papers(Request $request)
    {
        $query = Paper::with(['conference', 'author', 'reviewers']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($aq) use ($search) {
                        $aq->where('full_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $allowedSortFields = ['created_at', 'title', 'status', 'plagiarism_ratio'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate(10);
    }

    public function exportPapers()
    {
        $papers = Paper::with(['conference', 'author', 'reviewers'])->get();
        $csvFileName = 'papers_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($papers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Title', 'Author', 'Conference', 'Status', 'Reviewers']);

            foreach ($papers as $paper) {
                $reviewers = $paper->reviewers->pluck('full_name')->implode(', ');
                fputcsv($file, [
                    $paper->id,
                    $paper->title,
                    $paper->author->full_name,
                    $paper->conference->title ?? 'N/A',
                    $paper->status,
                    $reviewers
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function assignReviewer(Request $request, $id)
    {
        try {
            $request->validate([
                'reviewer_id' => 'required|exists:users,id',
                'due_date' => 'nullable|date'
            ]);

            $paper = Paper::findOrFail($id);

            // Check if already assigned
            if ($paper->paperAssignments()->where('reviewer_id', $request->reviewer_id)->exists()) {
                return response()->json(['message' => 'Reviewer already assigned'], 422);
            }

            $dueDate = $request->due_date ? $request->due_date : null;

            $assignment = PaperAssignment::create([
                'paper_id' => $id,
                'reviewer_id' => $request->reviewer_id,
                'assigned_by' => $request->user()->id,
                'due_date' => $dueDate,
                'status' => 'assigned'
            ]);

            // Update paper status to under_review if not already
            if ($paper->status === Paper::STATUS_SUBMITTED || $paper->status === Paper::STATUS_REVISION_SUBMITTED) {
                $paper->update(['status' => Paper::STATUS_UNDER_REVIEW]);
            }

            // Create notification safely
            try {
                NotificationLog::create([
                    'user_id' => $request->reviewer_id,
                    'title' => 'New Paper Assignment',
                    'message' => 'You have been assigned a new paper: ' . $paper->title,
                    'notification_type' => 'paper',
                    'related_id' => $id
                ]);
            } catch (\Exception $e) {
                \Log::error('Notification Error: ' . $e->getMessage());
            }

            return response()->json(['message' => 'Reviewer assigned successfully', 'assignment' => $assignment]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Assignment Error: ' . $e->getMessage());
            return response()->json(['message' => 'Assignment failed: ' . $e->getMessage()], 500);
        }
    }

    public function decision(Request $request, $id)
    {
        $request->validate([
            'decision' => 'required|in:accept,reject,revision_requested',
            'notes' => 'nullable|string'
        ]);

        $statusMap = [
            'accept' => Paper::STATUS_ACCEPTED,
            'reject' => Paper::STATUS_REJECTED,
            'revision_requested' => Paper::STATUS_REVISION_REQUESTED
        ];

        $paper = Paper::findOrFail($id);

        $paper->update([
            'status' => $statusMap[$request->decision],
            'final_decision' => $request->decision === 'revision_requested' ? null : $request->decision,
            'decision_notes' => $request->notes,
            'decision_date' => now()
        ]);

        // Notification to author
        try {
            NotificationLog::create([
                'user_id' => $paper->author_id,
                'title' => 'Paper Decision: ' . ucfirst($request->decision),
                'message' => 'A decision has been made on your paper: ' . $paper->title,
                'notification_type' => 'paper',
                'related_id' => $id
            ]);
        } catch (\Exception $e) {
            \Log::error('Notification Error: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Decision recorded successfully', 'paper' => $paper]);
    }

    public function classifyAndSchedule(Request $request, $id)
    {
        $request->validate([
            'presentation_type' => 'required|in:oral,poster,keynote,none',
            'participation_mode' => 'required|in:physical,online,none',
            'publication_selected' => 'nullable|boolean',
            'access_link' => 'nullable|string|url',
        ]);

        $paper = Paper::findOrFail($id);

        $paper->update([
            'status' => Paper::STATUS_SCHEDULED,
            'presentation_type' => $request->presentation_type,
            'participation_mode' => $request->participation_mode,
            'publication_selected' => $request->publication_selected ?? $paper->publication_selected,
            'access_link' => $request->access_link,
        ]);

        return response()->json([
            'message' => 'تم تصنيف المشاركة وجدولتها بنجاح',
            'paper' => $paper
        ]);
    }

    public function sendInvitation(Request $request, $id)
    {
        $paper = Paper::findOrFail($id);

        // Logic to generate and send official invitation
        // For now, mark as sent
        $paper->update([
            'invitation_sent_at' => now(),
        ]);

        NotificationLog::create([
            'user_id' => $paper->author_id,
            'title' => 'Official Conference Invitation',
            'message' => 'You are officially invited to present your paper: ' . $paper->title,
            'notification_type' => 'conference',
            'related_id' => $id
        ]);

        return response()->json(['message' => 'تم إرسال الدعوة بنجاح']);
    }

    public function reviewers()
    {
        return User::where('user_type', 'reviewer')->get(['id', 'full_name', 'email', 'affiliation']);
    }

    public function addReviewer(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'affiliation' => 'nullable|string|max:255',
            ]);

            $username = explode('@', $request->email)[0] . rand(100, 999);
            // Ensure username uniqueness
            while (User::where('username', $username)->exists()) {
                $username = explode('@', $request->email)[0] . rand(100, 999);
            }

            $user = User::create([
                'username' => $username,
                'full_name' => $request->full_name,
                'email' => $request->email,
                'password' => bcrypt('password'), // Default password
                'user_type' => 'reviewer',
                'affiliation' => $request->affiliation,
            ]);

            return response()->json($user, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Add Reviewer Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to add reviewer: ' . $e->getMessage()], 500);
        }
    }

    public function updateReviewer(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'affiliation' => 'nullable|string|max:255',
            ]);

            $user->update([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'affiliation' => $request->affiliation,
            ]);

            return response()->json(['message' => 'Reviewer updated successfully', 'user' => $user]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Update Reviewer Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update reviewer: ' . $e->getMessage()], 500);
        }
    }

    public function deleteReviewer($id)
    {
        try {
            $user = User::findOrFail($id);
            if ($user->user_type !== 'reviewer') {
                return response()->json(['message' => 'User is not a reviewer'], 403);
            }

            $user->delete();
            return response()->json(['message' => 'Reviewer deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Delete Reviewer Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete reviewer: ' . $e->getMessage()], 500);
        }
    }
}
