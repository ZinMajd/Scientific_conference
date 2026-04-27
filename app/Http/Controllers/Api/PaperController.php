<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Coauthor;
use App\Models\PaperVersion;
use App\Models\InitialScreening;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Notifications\SystemNotification;

class PaperController extends Controller
{
    protected $workflow;

    public function __construct(\App\Services\PaperWorkflowService $workflow)
    {
        $this->workflow = $workflow;
    }

    protected function checkConflict($paper)
    {
        if ($paper->author_id === Auth::id()) {
            return true;
        }
        return false;
    }

    protected function conflictResponse()
    {
        return response()->json([
            'message' => 'تضارب مصالح: لا يمكنك فحص أو تعديل هذا البحث لأنك أنت المؤلف.',
            'error_type' => 'conflict_of_interest'
        ], 403);
    }

    public function index()
    {
        $user = Auth::user();
        return Paper::where('author_id', $user->id)
            ->with(['conference:id,title', 'coauthors'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Paper submission attempt', [
            'has_files' => $request->hasFile('paper_files'),
            'files_count' => $request->file('paper_files') ? count($request->file('paper_files')) : 0,
            'all_data' => $request->except(['paper_files']),
        ]);

        try {
            $request->validate([
                'conf_id' => 'required|exists:conferences,id',
                'title' => 'required|string|max:500',
                'abstract' => 'required|string',
                'keywords' => 'required|string',
                'track' => 'nullable|string',
                'paper_files' => 'required|array|min:1',
                'paper_files.*' => 'required|file|mimes:pdf,doc,docx,zip,rar,xls,xlsx,csv|max:20480',
                'coauthors' => 'nullable|array',
                'coauthors.*.full_name' => 'required|string',
                'coauthors.*.email' => 'required|email',
                'coauthors.*.affiliation' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::warning('Paper validation failed', ['errors' => $e->errors()]);
            throw $e;
        }

        try {
            return DB::transaction(function () use ($request) {
                $files = $request->file('paper_files');
                $mainFile = $files[0]; // First file is considered the main manuscript

                $mainPath = $mainFile->store('papers');

                $paper = Paper::create([
                    'author_id' => Auth::id(),
                    'conf_id' => $request->conf_id,
                    'title' => $request->title,
                    'abstract' => $request->abstract,
                    'keywords' => $request->keywords,
                    'track' => $request->track,
                    'file_path' => $mainPath,
                    'file_name' => $mainFile->getClientOriginalName(),
                    'file_size' => $mainFile->getSize(),
                    'file_type' => $mainFile->getClientOriginalExtension(),
                    'status' => Paper::STATUS_SUBMITTED,
                ]);

                // Record Workflow Event
                $this->workflow->transition($paper, 'PAPER_SUBMITTED', 'Initial submission');

                // Record Conflict of Interest if the author has administrative roles
                $userRoles = Auth::user()->roles->pluck('slug')->toArray();
                $adminRoles = ['scientific_committee', 'editor', 'editorial_office', 'conference_chair', 'system_admin'];
                
                if (array_intersect($userRoles, $adminRoles)) {
                    \App\Models\Conflict::create([
                        'user_id' => Auth::id(),
                        'paper_id' => $paper->id,
                        'type' => 'author_conflict',
                        'reason' => 'المؤلف عضو في اللجنة العلمية أو إداري في النظام.'
                    ]);
                }

                // Record Version 1 for Main Manuscript
                PaperVersion::create([
                    'paper_id' => $paper->id,
                    'version_number' => 1,
                    'file_path' => $mainPath,
                    'type' => 'original',
                ]);

                // Store all attached files (including the main one in the attachments table for consistency)
                foreach ($files as $index => $file) {
                    $isMain = ($index === 0);
                    $path = $isMain ? $mainPath : $file->store('papers/attachments');

                    \App\Models\PaperAttachment::create([
                        'paper_id' => $paper->id,
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'file_type' => $file->getClientOriginalExtension(),
                        'is_main_manuscript' => $isMain,
                    ]);
                }

                if ($request->has('coauthors')) {
                    foreach ($request->coauthors as $coauthorData) {
                        Coauthor::create(array_merge($coauthorData, ['paper_id' => $paper->id]));
                    }
                }

                // إشعار للباحث (استلام البحث)
                try {
                    $paper->author->notify(new SystemNotification(
                        'تم استلام بحثك بنجاح 📝',
                        'تم استلام البحث بعنوان: "' . $paper->title . '" وهو الآن تحت الفحص الأولي.',
                        url('/researcher/research/' . $paper->id),
                        'success'
                    ));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Author Notification Error: ' . $e->getMessage());
                }

                // إشعار لمكتب التحرير (وصول بحث جديد)
                try {
                    $officeUsers = User::role('editorial_office')->get();
                    foreach ($officeUsers as $officeUser) {
                        $officeUser->notify(new SystemNotification(
                            'وصول بحث جديد يحتاج فحص 🆕',
                            'تم تقديم بحث جديد بعنوان: "' . $paper->title . '" من قبل ' . $paper->author->full_name,
                            url('/committee/research'),
                            'info'
                        ));
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Office Notification Error: ' . $e->getMessage());
                }

                return response()->json([
                    'message' => 'تم تقديم البحث بنجاح',
                    'paper' => $paper->load('coauthors'),
                    'tracking_number' => 'SABA-' . str_pad($paper->id, 5, '0', STR_PAD_LEFT)
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'فشل عملية التقديم: ' . $e->getMessage()], 500);
        }
    }

    public function archive(Request $request)
    {
        $query = Paper::where(function ($q) {
                $q->where('is_published', true)
                  ->orWhere('status', 'scheduled');
            })
            ->with(['conference', 'author'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('author', function($aq) use ($search) {
                      $aq->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        return $query->paginate(12);
    }

    public function show($id)
    {
        $paper = Paper::with(['conference', 'author', 'coauthors', 'assignments.review', 'statusHistory.user'])->findOrFail($id);
        return response()->json($paper);
    }

    public function download($id)
    {
        $paper = Paper::findOrFail($id);
        if (!Storage::exists($paper->file_path)) {
            return response()->json(['message' => 'الملف غير موجود'], 404);
        }
        return Storage::download($paper->file_path, $paper->file_name);
    }

    public function initialScreening(Request $request, $id)
    {
        \Illuminate\Support\Facades\Log::info('initialScreening Payload:', $request->all());

        $request->validate([
            'result' => 'required|in:technical_pass,technical_fail,scientific_pass,desk_reject',
            'notes' => 'nullable|string',
            'plagiarism_ratio' => 'nullable|numeric|min:0|max:100',
            'format_check' => 'nullable|boolean',
            'completeness_check' => 'nullable|boolean',
        ]);

        if ($request->result === 'scientific_pass') {
            if (!$request->user()->hasRole('editor') && !$request->user()->hasRole('scientific_committee') && !$request->user()->hasRole('system_admin')) {
                return response()->json(['message' => 'ليس لديك صلاحية لقبول البحث للتحكيم العلمي وإرساله للمحكمين. هذه الصلاحية مخصصة للمحرر العلمي واللجنة العلمية.'], 403);
            }
        }

        return DB::transaction(function () use ($request, $id) {
            $paper = Paper::findOrFail($id);

            if ($this->checkConflict($paper)) {
                return $this->conflictResponse();
            }

            // 1. Calculate Automated System Recommendation (The Decision Engine)
            $systemRecommendation = 'ACCEPT_PRELIMINARY';
            
            if (($request->plagiarism_ratio && $request->plagiarism_ratio > 30) || $request->result === 'desk_reject') {
                $systemRecommendation = 'REJECT';
            } elseif ($request->format_check === false || $request->completeness_check === false || $request->result === 'technical_fail') {
                $systemRecommendation = 'REVISION_REQUIRED';
            }

            // 2. Map Professional Result to Final Status
            $eventMap = [
                'technical_pass' => 'TECHNICAL_CHECK_PASS',
                'technical_fail' => 'TECHNICAL_CHECK_FAIL',
                'scientific_pass' => 'INITIAL_SCREENING_PASS',
                'desk_reject' => 'DESK_REJECT'
            ];

            $note = "قرار الفرز الأولي: " . ($request->notes ?: "لا توجد ملاحظات إضافية");

            // 3. Apply transition with history via Workflow Service
            $this->workflow->transition($paper, $eventMap[$request->result], $note);

            // 4. Store in Screening Decisions (The History Layer)
            DB::table('screening_decisions')->insert([
                'paper_id' => $paper->id,
                'system_recommendation' => $systemRecommendation,
                'editor_decision' => $request->result,
                'notes' => $request->notes,
                'decided_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 5. Update specific fields
            if ($request->has('plagiarism_ratio')) {
                $paper->update(['plagiarism_ratio' => $request->plagiarism_ratio]);
            }

            InitialScreening::create([
                'paper_id' => $paper->id,
                'screener_id' => Auth::id(),
                'plagiarism_score' => $request->plagiarism_ratio,
                'format_check_passed' => $request->format_check ?? true,
                'completeness_check_passed' => $request->completeness_check ?? true,
                'result' => $request->result,
                'comments' => $request->notes,
            ]);

            $paper->refresh(); // Refresh to get the latest status from DB

            // إرسال إشعار للمؤلف بالنتيجة
            try {
                $statusAr = [
                    'technical_pass' => [
                        'title' => 'تحديث: اجتياز الفحص الفني ✅',
                        'msg' => 'اجتاز بحثكم الفحص الفني وهو الآن تحت المراجعة العلمية.'
                    ],
                    'technical_fail' => [
                        'title' => 'مطلوب تعديل: الفحص الفني ⚠️',
                        'msg' => 'لم يجتز البحث الفحص الفني، يرجى مراجعة الملاحظات وتعديل البحث.'
                    ],
                    'scientific_pass' => [
                        'title' => 'تحديث: اجتياز الفرز الأولي 🟢',
                        'msg' => 'اجتاز بحثكم الفرز الأولي وتم إرساله للمحكمين.'
                    ],
                    'desk_reject' => [
                        'title' => 'نعتذر: تم رفض البحث 🔴',
                        'msg' => 'تم رفض البحث في مرحلة الفرز الأولي. نتمنى لكم التوفيق في مشاركات القادمة.'
                    ]
                ];
                $decision = $statusAr[$request->result] ?? ['title' => 'تحديث بخصوص بحثك', 'msg' => 'تم تحديث حالة بحثكم.'];
                $paper->author->notify(new SystemNotification(
                    $decision['title'],
                    $decision['msg'],
                    url('/researcher/research/' . $paper->id),
                    $request->result === 'desk_reject' ? 'error' : 'info'
                ));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Notification Error: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'تم تسجيل القرار الأولي بنجاح.',
                'system_recommendation' => $systemRecommendation,
                'final_status' => $paper->status,
                'paper' => $paper->load('versions')
            ]);
        });
    }

    public function anonymize(Request $request, $id)
    {
        $request->validate([
            'blind_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $paper = Paper::with('author')->findOrFail($id);
            
            // 1. Store the Blind Version
            $file = $request->file('blind_file');
            $path = $file->store('papers/blind', 'public');

            // 2. Register in paper_versions and update main paper record
            PaperVersion::create([
                'paper_id' => $paper->id,
                'version_number' => $paper->versions()->count() + 1,
                'file_path' => $path,
                'type' => 'blind',
                'notes' => $request->notes
            ]);

            $paper->update([
                'blind_file_path' => $path,
            ]);
            
            $this->workflow->transition($paper, 'PAPER_ANONYMIZED', 'تم رفع النسخة العمياء بنجاح. البحث جاهز الآن للتحكيم.');

            // 3. Automated Conflict Detection (Institutional)
            $authorInstitution = $paper->author->affiliation ?? null;
            if ($authorInstitution) {
                $reviewersWithConflict = User::where('user_type', 'reviewer')
                    ->where('affiliation', $authorInstitution)
                    ->get();

                foreach ($reviewersWithConflict as $reviewer) {
                    \App\Models\Conflict::updateOrCreate(
                        ['paper_id' => $paper->id, 'user_id' => $reviewer->id],
                        [
                            'type' => 'author_conflict',
                            'reason' => 'المحكم يعمل في نفس جهة عمل المؤلف: ' . $authorInstitution
                        ]
                    );
                }
            }

            // 4. Update Status to Ready for Review
            $paper->transitionStatus(Paper::STATUS_READY_FOR_REVIEW, 'تم تجهيز النسخة العمياء وكشف تضارب المصالح بنجاح. البحث جاهز الآن للتحكيم.');

            return response()->json([
                'message' => 'تم إنتاج النسخة العمياء وتفعيل نظام حماية النزاهة بنجاح.',
                'paper' => $paper->load('versions')
            ]);
        });
    }

    public function submitRevision(Request $request, $id)
    {
        \Illuminate\Support\Facades\Log::info('!!! REVISION_REQUEST_RECEIVED !!!', [
            'id' => $id,
            'user' => Auth::id(),
            'user_type' => Auth::user()?->user_type,
            'has_files' => $request->hasFile('revised_file')
        ]);

        $request->validate([
            'revised_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'response_letter' => 'required|file|mimes:pdf,doc,docx,txt|max:5120',
            'summary_of_changes' => 'required|string',
        ]);
        
        $paper = Paper::findOrFail($id);

        // Ensure the current user is the author
        if ($paper->author_id != Auth::id()) {
            \Illuminate\Support\Facades\Log::warning('REVISION_UNAUTHORIZED_ATTEMPT', [
                'paper_author' => $paper->author_id,
                'current_user' => Auth::id()
            ]);
            return response()->json(['message' => 'غير مصرح لك بتعديل هذا البحث'], 403);
        }

        try {
            $revisedFile = $request->file('revised_file');
            $responseLetter = $request->file('response_letter');

            $revisedPath  = $revisedFile->store('papers/revisions');
            $responsePath = $responseLetter->store('papers/response_letters');

            // Get latest version number
            $latestVersion = $paper->versions()->max('version_number') ?? 1;

            // Create new version record
            PaperVersion::create([
                'paper_id'             => $paper->id,
                'version_number'       => $latestVersion + 1,
                'file_path'            => $revisedPath,
                'response_letter_path' => $responsePath,
                'author_comments'      => $request->summary_of_changes,
                'type'                 => 'revised',
            ]);

            // Transition using the professional State Machine
            // This will automatically change status to 'resubmitted' and record in history
            $this->workflow->transition($paper, 'REVISION_SUBMITTED', 'تم تعديل البحث وإعادة إرساله للفحص الأولي من قبل الباحث');

            \Illuminate\Support\Facades\Log::info('STATE_MACHINE_TRANSITION_SUCCESS', [
                'new_status' => $paper->status,
                'paper_id' => $paper->id
            ]);

            // إشعار للمؤلف (تأكيد استلام التعديل)
            try {
                $paper->author->notify(new SystemNotification(
                    'تم استلام النسخة المعدلة بنجاح 🔄',
                    'تم استلام النسخة المعدلة من بحثكم بنجاح وهي قيد المراجعة الآن.',
                    url('/researcher/research/' . $paper->id),
                    'success'
                ));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Author Notification Error: ' . $e->getMessage());
            }

            // إشعار لمكتب التحرير (إعادة إرسال)
            try {
                $officeUsers = User::role('editorial_office')->get();
                foreach ($officeUsers as $officeUser) {
                    $officeUser->notify(new SystemNotification(
                        'إعادة إرسال من الباحث 🔄',
                        'قام الباحث ' . $paper->author->full_name . ' برفع نسخة معدلة من البحث: "' . $paper->title . '"',
                        url('/committee/research'),
                        'info'
                    ));
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Office Notification Error: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'تم إعادة إرسال البحث بنجاح. ستظهر الآن لمكتب التحرير كنسخة معدلة جاهزة للفحص.',
                'paper' => $paper
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('REVISION_SUBMIT_FAILED', [
                'error'    => $e->getMessage(),
                'paper_id' => $id,
            ]);
            return response()->json(['message' => 'فشل تقديم التعديلات: ' . $e->getMessage()], 500);
        }
    }

    public function finalAcceptance(Request $request, $id)
    {
        $request->validate([
            'publication_selected' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $paper = Paper::findOrFail($id);

        $this->workflow->transition($paper, 'FINAL_ACCEPT', $request->notes, [
            'publication_selected' => $request->publication_selected ?? false,
        ]);

        // إشعار بالقبول النهائي
        try {
            $paper->author->notify(new SystemNotification(
                'تهانينا! تم قبول بحثك قبولاً نهائياً 🎊',
                'مبارك! تم قبول بحثكم بعنوان "' . $paper->title . '" قبولاً نهائياً للمشاركة في المؤتمر.',
                url('/researcher/research/' . $paper->id),
                'success'
            ));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Notification Error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'تم إصدار قرار القبول النهائي للبحث بنجاح.',
            'paper' => $paper
        ]);
    }
}
