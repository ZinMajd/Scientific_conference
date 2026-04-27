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
use Illuminate\Support\Facades\Auth;
use App\Notifications\SystemNotification;

class CommitteeController extends Controller
{
    protected $workflow;

    public function __construct(\App\Services\PaperWorkflowService $workflow)
    {
        $this->workflow = $workflow;
    }

    protected function checkConflict($paper, $user)
    {
        if ($paper->author_id === $user->id) {
            return true;
        }
        return false;
    }

    protected function conflictResponse()
    {
        return response()->json([
            'message' => 'تضارب مصالح: لا يمكنك إدارة هذا البحث لأنك أنت المؤلف.',
            'error_type' => 'conflict_of_interest'
        ], 403);
    }

    public function stats()
    {
        return response()->json([
            'total_papers' => Paper::count(),
            'total_conferences' => Conference::count(),
            'total_reviewers' => User::where('user_type', 'reviewer')->count(),
            'total_attendees' => Attendee::count(),
            'technical_check_count' => Paper::whereIn('status', [Paper::STATUS_SUBMITTED, Paper::STATUS_UNDER_SCREENING, Paper::STATUS_RESUBMITTED])->count(),
            'with_editor_count' => Paper::where('status', Paper::STATUS_WITH_EDITOR)->count(),
            'under_review_count' => Paper::where('status', Paper::STATUS_UNDER_REVIEW)->count(),
        ]);
    }

    public function papers(Request $request)
    {
        $query = Paper::with(['conference', 'author', 'reviewers', 'statusHistory']);

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
        if (!$request->user()->hasRole('editor') && !$request->user()->hasRole('scientific_committee') && !$request->user()->hasRole('system_admin')) {
            return response()->json(['message' => 'ليس لديك صلاحية تعيين المحكمين. هذه الصلاحية مخصصة للمحرر العلمي واللجنة العلمية.'], 403);
        }

        try {
            $request->validate([
                'reviewer_id' => 'required|exists:users,id',
                'due_date' => 'nullable|date'
            ]);

            $paper = Paper::findOrFail($id);

            // Lifecycle Guard: Only allow assignment if the paper is actually ready for review
            if (!in_array($paper->status, [Paper::STATUS_READY_FOR_REVIEW, Paper::STATUS_UNDER_REVIEW])) {
                return response()->json([
                    'message' => 'لا يمكن إسناد محكمين حالياً. البحث لا يزال في مرحلة: ' . $paper->status,
                    'error_type' => 'invalid_lifecycle_stage'
                ], 422);
            }

            if ($this->checkConflict($paper, $request->user())) {
                return $this->conflictResponse();
            }

            // Check for recorded conflicts (e.g. from the same institution)
            if (\App\Models\Conflict::where('paper_id', $id)->where('user_id', $request->reviewer_id)->exists()) {
                $conflict = \App\Models\Conflict::where('paper_id', $id)->where('user_id', $request->reviewer_id)->first();
                return response()->json([
                    'message' => 'تضارب مصالح: ' . $conflict->reason,
                    'error_type' => 'conflict_of_interest'
                ], 403);
            }

            // Check if already assigned and NOT declined
            if ($paper->paperAssignments()
                ->where('reviewer_id', $request->reviewer_id)
                ->whereIn('status', ['assigned', 'accepted', 'completed'])
                ->exists()) {
                return response()->json(['message' => 'Reviewer already assigned and active'], 422);
            }

            $dueDate = $request->due_date ? $request->due_date : null;

            $assignment = PaperAssignment::create([
                'paper_id' => $id,
                'reviewer_id' => $request->reviewer_id,
                'assigned_by' => $request->user()->id,
                'due_date' => $dueDate,
                'status' => 'assigned'
            ]);

            // ✅ ننتقل إلى under_review فقط في المرة الأولى (عند إسناد أول محكم)
            // إذا كانت الحالة already under_review نضيف المحكم بدون تغيير الحالة
            if ($paper->status === Paper::STATUS_READY_FOR_REVIEW) {
                $this->workflow->transition($paper, 'REVIEWERS_ASSIGNED', 'بدأت عملية التحكيم العلمي (تم إرسال البحث للمحكمين)');
            } elseif ($paper->status === Paper::STATUS_UNDER_REVIEW) {
                // البحث قيد التحكيم بالفعل — نضيف المحكم الإضافي فقط
                \Log::info('Additional reviewer assigned to paper already under review', [
                    'paper_id' => $paper->id,
                    'reviewer_id' => $request->reviewer_id,
                ]);
            }

            // إرسال إشعار للمحكم عبر الإيميل والنظام
            try {
                $reviewer = User::find($request->reviewer_id);
                $reviewer->notify(new SystemNotification(
                    'دعوة لتحكيم بحث علمي جديد ⚖️',
                    'تم اختياركم وتكليفكم بمراجعة البحث العلمي بعنوان: "' . $paper->title . '". يرجى الدخول للمنصة لقبول المهمة أو الاعتذار عنها.',
                    url('/reviewer/assignments'),
                    'info'
                ));
            } catch (\Exception $e) {
                \Log::error('Reviewer Notification Error: ' . $e->getMessage());
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

        $eventMap = [
            'accept' => 'FINAL_ACCEPT',
            'reject' => 'FINAL_REJECT',
            'revision_requested' => 'REVISION_REQUESTED'
        ];

        $paper = Paper::findOrFail($id);

        $this->workflow->transition($paper, $eventMap[$request->decision], $request->notes);

        // إرسال إشعار للمؤلف بالقرار
        try {
            $msg = [
                'accept' => [
                    'title' => 'تهانينا! تم قبول بحثك 🟢',
                    'msg' => 'يسرنا إبلاغكم بأنه تم قبول بحثكم المودع للمشاركة في جلسات المؤتمر.'
                ],
                'reject' => [
                    'title' => 'نعتذر: تم رفض البحث 🔴',
                    'msg' => 'نعتذر منكم، لم يتم قبول بحثكم للمشاركة في هذه الدورة بناءً على تقارير المحكمين.'
                ],
                'revision_requested' => [
                    'title' => 'مطلوب تعديل البحث ⚠️',
                    'msg' => 'يتطلب بحثكم بعض التعديلات العلمية المقترحة، يرجى مراجعة ملاحظات المحكمين وإعادة الإرسال.'
                ]
            ];
            $decision = $msg[$request->decision] ?? ['title' => 'تحديث بخصوص بحثك', 'msg' => 'تم اتخاذ قرار بخصوص بحثكم.'];
            $paper->author->notify(new SystemNotification(
                $decision['title'],
                $decision['msg'],
                url('/researcher/research/' . $paper->id),
                $request->decision === 'reject' ? 'error' : 'info'
            ));
        } catch (\Exception $e) {
            \Log::error('Author Notification Error: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Decision recorded successfully', 'paper' => $paper]);
    }

    public function submitDecisionLevel(Request $request, $id)
    {
        $request->validate([
            'level' => 'required|in:editor,committee,chair',
            'decision' => 'required|in:accept,reject,minor_fixes,major_fixes',
            'notes' => 'nullable|string'
        ]);

        $paper = Paper::findOrFail($id);
        
        $decision = \App\Models\PaperDecision::create([
            'paper_id' => $id,
            'user_id' => Auth::id(),
            'decision_level' => $request->level,
            'decision' => $request->decision,
            'notes' => $request->notes
        ]);

        // If it's a chair decision, it might trigger a final status change
        if ($request->level === 'chair') {
            $event = ($request->decision === 'accept' || $request->decision === 'minor_fixes') ? 'FINAL_ACCEPT' : 'FINAL_REJECT';
            $this->workflow->transition($paper, $event, $request->notes);
        }

        return response()->json([
            'message' => 'تم تسجيل القرار بنجاح (' . $request->level . ')',
            'decision' => $decision,
            'paper' => $paper->load('statusHistory')
        ]);
    }

    public function reviewsAggregation($id)
    {
        $paper = Paper::findOrFail($id);
        $aggregation = $this->workflow->aggregateReviews($paper);

        return response()->json([
            'paper_id' => $id,
            'title' => $paper->title,
            'aggregation' => $aggregation
        ]);
    }

    public function classifyAndSchedule(Request $request, $id)
    {
        $request->validate([
            'presentation_type' => 'required|in:oral,poster,keynote,none',
            'participation_mode' => 'required|in:physical,online,none',
            'publication_selected' => 'nullable|boolean',
            'access_link' => 'nullable|string|url',
            'session_id' => 'nullable|exists:scientific_sessions,id',
            'presentation_order' => 'nullable|integer',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $paper = Paper::findOrFail($id);

            // Use workflow to transition to SCHEDULED
            $this->workflow->transition($paper, 'SCHEDULED', 'تمت الجدولة في جلسة المؤتمر');

            $paper->update([
                'presentation_type' => $request->presentation_type,
                'participation_mode' => $request->participation_mode,
                'publication_selected' => $request->publication_selected ?? $paper->publication_selected,
                'access_link' => $request->access_link,
            ]);

            if ($request->session_id) {
                // Remove from other sessions first to ensure it's only in one
                DB::table('session_papers')->where('paper_id', $id)->delete();
                
                DB::table('session_papers')->insert([
                    'session_id' => $request->session_id,
                    'paper_id' => $id,
                    'presentation_order' => $request->presentation_order ?? 1,
                    'duration_minutes' => 15, // Default
                    'presentation_time' => null, // Can be calculated from session start + order
                ]);
            }

            return response()->json([
                'message' => 'تم تصنيف المشاركة وجدولتها بنجاح',
                'paper' => $paper->load('sessions')
            ]);
        });
    }

    public function markAsPublished(Request $request, $id)
    {
        $request->validate([
            'doi' => 'nullable|string',
            'page_numbers' => 'nullable|string',
        ]);

        $paper = Paper::findOrFail($id);

        $paper->update([
            'is_published' => true,
            'status' => 'published',
            'doi' => $request->doi,
            'page_numbers' => $request->page_numbers,
        ]);

        return response()->json([
            'message' => 'تم تمييز البحث كمنشور بنجاح',
            'paper' => $paper
        ]);
    }

    public function sendAuthorInvitation(Request $request, $id)
    {
        $paper = Paper::with(['conference', 'author', 'sessions'])->findOrFail($id);

        // Logic to generate and send official invitation
        // For now, mark as sent
        $paper->update([
            'invitation_sent_at' => now(),
        ]);

        $sessionInfo = "";
        if ($paper->sessions->isNotEmpty()) {
            $session = $paper->sessions->first();
            $sessionInfo = "في جلسة: {$session->title} بقاعة {$session->room} بتاريخ " . $session->start_time->format('Y-m-d H:i');
        }

        NotificationLog::create([
            'user_id' => $paper->author_id,
            'title' => 'Official Conference Invitation',
            'message' => "يسرنا دعوتكم رسمياً لتقديم بحثكم: '{$paper->title}' {$sessionInfo}. يرجى الحضور قبل الموعد بـ 15 دقيقة.",
            'notification_type' => 'conference',
            'related_id' => $id
        ]);

        return response()->json(['message' => 'تم إرسال الدعوة الرسمية بنجاح']);
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

            // Check if reviewer is linked to any paper assignments
            $hasAssignments = PaperAssignment::where('reviewer_id', $user->id)->exists();
            $hasReviews = DB::table('paper_reviews')->where('reviewer_id', $user->id)->exists();

            if ($hasAssignments || $hasReviews) {
                return response()->json([
                    'message' => 'لا يمكن حذف المحكم لارتباطه بتقييمات وأبحاث مسجلة في النظام. لحفظ السجل العلمي، يرجى إبقاء الحساب.'
                ], 400);
            }

            // Clean up safe-to-delete non-critical records if needed
            DB::table('paper_status_history')->where('changed_by', $user->id)->update(['changed_by' => null]);
            DB::table('paper_events')->where('user_id', $user->id)->update(['user_id' => null]);
            DB::table('reviewer_invitations')->where('email', $user->email)->delete();

            $user->delete();
            return response()->json(['message' => 'Reviewer deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Delete Reviewer Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete reviewer: ' . $e->getMessage()], 500);
        }
    }

    public function sendInvitation(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email|unique:reviewer_invitations,email',
            'name' => 'required|string|max:255',
            'affiliation' => 'nullable|string|max:255',
            'paper_id' => 'nullable|exists:papers,id',
        ]);

        $token = \Illuminate\Support\Str::random(40);

        $invitation = \DB::table('reviewer_invitations')->insert([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'affiliation' => $validated['affiliation'],
            'paper_id' => $validated['paper_id'] ?? null,
            'token' => $token,
            'invited_by' => Auth::id(),
            'expires_at' => now()->addDays(7),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Generate invitation link (This would be sent via email in production)
        $invitationLink = url("/register/reviewer?token={$token}");

        return response()->json([
            'message' => 'تم إنشاء دعوة التسجيل بنجاح.',
            'invitation_link' => $invitationLink
        ]);
    }

    public function verifyInvitation(Request $request)
    {
        $token = $request->query('token');
        $invitation = DB::table('reviewer_invitations')->where('token', $token)->first();

        if (!$invitation || $invitation->status !== 'pending') {
            return response()->json(['message' => 'هذا الرابط غير صالح أو منتهي الصلاحية.'], 404);
        }

        return response()->json($invitation);
    }

    public function registerFromInvitation(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed',
            'expertise' => 'nullable|string',
        ]);

        $invitation = DB::table('reviewer_invitations')->where('token', $request->token)->first();

        if (!$invitation || $invitation->status !== 'pending') {
            return response()->json(['message' => 'حدث خطأ في التحقق من الدعوة.'], 422);
        }

        return DB::transaction(function () use ($request, $invitation) {
            // Generate a unique username
            $username = explode('@', $invitation->email)[0] . rand(100, 999);
            while (User::where('username', $username)->exists()) {
                $username = explode('@', $invitation->email)[0] . rand(100, 999);
            }

            // Create user
            $user = User::create([
                'username' => $username,
                'full_name' => $invitation->name,
                'email' => $invitation->email,
                'password' => bcrypt($request->password),
                'user_type' => 'reviewer',
                'affiliation' => $invitation->affiliation,
                'expertise' => $request->expertise,
            ]);

            // Update invitation status
            DB::table('reviewer_invitations')->where('token', $request->token)->update([
                'status' => 'accepted',
                'updated_at' => now()
            ]);

            // If the invitation was linked to a specific paper, assign it automatically
            if ($invitation->paper_id) {
                $paper = Paper::find($invitation->paper_id);
                if ($paper && in_array($paper->status, [Paper::STATUS_READY_FOR_REVIEW, Paper::STATUS_UNDER_REVIEW])) {
                    \App\Models\PaperAssignment::create([
                        'paper_id' => $paper->id,
                        'reviewer_id' => $user->id,
                        'assigned_by' => $invitation->invited_by,
                        'due_date' => now()->addDays(14),
                        'status' => 'assigned'
                    ]);

                    \App\Models\PaperEvent::create([
                        'paper_id' => $paper->id,
                        'user_id' => $invitation->invited_by,
                        'event_type' => 'reviewer_assigned',
                        'notes' => 'تم تعيين المحكم الخارجي تلقائياً بعد التسجيل'
                    ]);

                    if ($paper->status === Paper::STATUS_READY_FOR_REVIEW) {
                        app(\App\Services\PaperWorkflowService::class)->transition($paper, 'REVIEWERS_ASSIGNED', 'بدأت عملية التحكيم العلمي عبر تسجيل محكم خارجي');
                    }
                }
            }

            return response()->json(['message' => 'تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.']);
        });
    }
    public function sessions()
    {
        return \App\Models\ScientificSession::with(['conference', 'chair', 'papers.author'])->get();
    }

    public function storeSession(Request $request)
    {
        $validated = $request->validate([
            'conf_id' => 'required|exists:conferences,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'session_type' => 'required|in:oral,poster,keynote,workshop',
            'room' => 'nullable|string|max:100',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'chair_id' => 'nullable|exists:users,id',
        ]);

        $session = \App\Models\ScientificSession::create($validated);
        return response()->json($session, 201);
    }

    public function updateSession(Request $request, $id)
    {
        $session = \App\Models\ScientificSession::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'session_type' => 'required|in:oral,poster,keynote,workshop',
            'room' => 'nullable|string|max:100',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'chair_id' => 'nullable|exists:users,id',
        ]);

        $session->update($validated);
        return response()->json($session);
    }

    public function deleteSession($id)
    {
        $session = \App\Models\ScientificSession::findOrFail($id);
        $session->delete();
        return response()->json(['message' => 'Session deleted successfully']);
    }
}
