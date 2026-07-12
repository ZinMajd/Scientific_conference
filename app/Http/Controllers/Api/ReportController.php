<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\User;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function analytics(Request $request)
    {
        $papersQuery = Paper::query();
        if ($request->has('conference_id') && $request->conference_id) {
            $papersQuery->where('conf_id', $request->conference_id);
        }

        $totalPapers = $papersQuery->count();
        $acceptedPapers = (clone $papersQuery)->whereIn('status', ['accepted', 'scheduled', 'in_production', 'ready_to_publish'])->count();
        $rejectedPapers = (clone $papersQuery)->where('status', 'rejected')->count();
        $underReviewPapers = (clone $papersQuery)->where('status', 'under_review')->count();
        $underScreeningPapers = (clone $papersQuery)->where('status', 'under_screening')->count();
        $revisionRequiredPapers = (clone $papersQuery)->whereIn('status', ['revision_required', 'resubmitted'])->count();
        $publishedPapers = (clone $papersQuery)->where('status', 'published')->orWhere('is_published', 'true')->count();

        $usersCount = User::count();
        $reviewersCount = User::where('user_type', 'reviewer')->count();
        $authorsCount = User::where('user_type', 'author')->count();

        // By Conference
        $byConference = Conference::withCount('papers')->get()->map(function($conf) {
            return ['name' => $conf->title, 'count' => $conf->papers_count];
        });

        // Reviewers stats
        $reviewersStats = User::where('user_type', 'reviewer')->withCount([
            'paperAssignments as completed_reviews' => function($q) { $q->where('status', 'completed'); },
            'paperAssignments as assigned_reviews',
        ])->get()->map(function($r) {
            return [
                'name' => $r->full_name,
                'completed' => $r->completed_reviews,
                'assigned' => $r->assigned_reviews,
                'pending' => $r->assigned_reviews - $r->completed_reviews
            ];
        });

        return response()->json([
            'cards' => [
                ['title' => 'إجمالي المستخدمين', 'value' => $usersCount, 'icon' => '👥', 'color' => 'blue'],
                ['title' => 'إجمالي الأبحاث', 'value' => $totalPapers, 'icon' => '📄', 'color' => 'indigo'],
                ['title' => 'المحكمون', 'value' => $reviewersCount, 'icon' => '👨‍🏫', 'color' => 'emerald'],
                ['title' => 'الباحثون', 'value' => $authorsCount, 'icon' => '🧑‍🎓', 'color' => 'amber'],
                ['title' => 'الأبحاث المقبولة', 'value' => $acceptedPapers, 'icon' => '✅', 'color' => 'emerald'],
                ['title' => 'الأبحاث المرفوضة', 'value' => $rejectedPapers, 'icon' => '❌', 'color' => 'red'],
                ['title' => 'قيد التحكيم', 'value' => $underReviewPapers, 'icon' => '⏳', 'color' => 'orange'],
                ['title' => 'منشورة', 'value' => $publishedPapers, 'icon' => '📚', 'color' => 'purple'],
            ],
            'paper_stats' => [
                'total' => $totalPapers,
                'accepted' => $acceptedPapers,
                'rejected' => $rejectedPapers,
                'under_review' => $underReviewPapers,
                'under_screening' => $underScreeningPapers,
                'revision' => $revisionRequiredPapers,
                'published' => $publishedPapers
            ],
            'by_conference' => $byConference,
            'reviewers' => $reviewersStats
        ]);
    }

    public function papers(Request $request)
    {
        $papers = Paper::with(['author', 'conference'])->get();

        $csvHeader = ['ID', 'Title', 'Author', 'Conference', 'Status', 'Submission Date'];
        $csvData = [];

        foreach ($papers as $paper) {
            $csvData[] = [
                $paper->id,
                $paper->title,
                $paper->author->full_name ?? 'N/A',
                $paper->conference->title ?? 'N/A',
                $paper->status,
                $paper->created_at->format('Y-m-d H:i:s'),
            ];
        }

        return $this->exportCsv($csvHeader, $csvData, 'papers_report.csv');
    }

    public function reviewers(Request $request)
    {
        $reviewers = User::where('user_type', 'reviewer')->withCount('reviews')->get();

        $csvHeader = ['ID', 'Name', 'Email', 'Affiliation', 'Completed Reviews'];
        $csvData = [];

        foreach ($reviewers as $reviewer) {
            $csvData[] = [
                $reviewer->id,
                $reviewer->full_name,
                $reviewer->email,
                $reviewer->affiliation,
                $reviewer->reviews_count,
            ];
        }

        return $this->exportCsv($csvHeader, $csvData, 'reviewers_report.csv');
    }

    public function attendees(Request $request)
    {
        // Assuming attendees are Users with 'registration_type' not null or derived from Attendees model if exists
        // checking migration: table 'attendees' exists according to Conference model relation but need to check migration content to be sure.
        // For now, let's just dump all users as a basic report if 'attendees' table isn't easily accessible or just use Users
        $users = User::all();

        $csvHeader = ['ID', 'Name', 'Email', 'Type', 'Joined At'];
        $csvData = [];

        foreach ($users as $user) {
            $csvData[] = [
                $user->id,
                $user->full_name,
                $user->email,
                $user->user_type,
                $user->created_at->format('Y-m-d'),
            ];
        }

        return $this->exportCsv($csvHeader, $csvData, 'users_report.csv');
    }

    private function exportCsv($header, $data, $filename)
    {
        $handle = fopen('php://temp', 'w+');

        // Add BOM for Excel UTF-8 compatibility
        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

        fputcsv($handle, $header);

        foreach ($data as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return Response::make($content, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ]);
    }
}
