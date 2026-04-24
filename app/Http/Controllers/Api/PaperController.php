<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Coauthor;
use App\Models\PaperVersion;
use App\Models\InitialScreening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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

        return DB::transaction(function () use ($request, $id) {
            $paper = Paper::findOrFail($id);

            if ($this->checkConflict($paper)) {
                return $this->conflictResponse();
            }

            $eventMap = [
                'technical_pass' => 'TECHNICAL_CHECK_PASS',
                'technical_fail' => 'TECHNICAL_CHECK_FAIL',
                'scientific_pass' => 'INITIAL_SCREENING_PASS',
                'desk_reject' => 'DESK_REJECT'
            ];

            $this->workflow->transition($paper, $eventMap[$request->result], $request->notes);

            InitialScreening::create([
                'paper_id' => $paper->id,
                'screener_id' => Auth::id(),
                'plagiarism_score' => $request->plagiarism_ratio,
                'format_check_passed' => $request->format_check ?? true,
                'completeness_check_passed' => $request->completeness_check ?? true,
                'result' => $request->result,
                'comments' => $request->notes,
            ]);

            return response()->json([
                'message' => 'تم تسجيل نتيجة الفرز الأولي بنجاح',
                'paper' => $paper
            ]);
        });
    }

    public function anonymize(Request $request, $id)
    {
        $request->validate([
            'blind_file' => 'required|file|mimes:pdf|max:10240',
            'notes' => 'nullable|string',
        ]);

        $paper = Paper::findOrFail($id);
        $path = $request->file('blind_file')->store('papers/blind');

        $this->workflow->anonymize($paper, $path, $request->notes);

        return response()->json([
            'message' => 'تم إنشاء النسخة المخفية (Blind Version) بنجاح',
            'paper' => $paper
        ]);
    }

    public function submitRevision(Request $request, $id)
    {
        $request->validate([
            'revised_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'response_letter' => 'required|file|mimes:pdf,doc,docx,txt|max:5120',
            'summary_of_changes' => 'required|string',
        ]);
        
        \Illuminate\Support\Facades\Log::info('SUBMIT_REVISION_START', ['paper_id' => $id, 'user_id' => Auth::id()]);
        
        $paper = Paper::findOrFail($id);

        if ($paper->author_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح لك بتعديل هذا البحث'], 403);
        }

        try {
            return DB::transaction(function () use ($request, $paper) {
                $revisedFile = $request->file('revised_file');
                $responseLetter = $request->file('response_letter');

                $revisedPath = $revisedFile->store('papers/revisions');
                $responsePath = $responseLetter->store('papers/response_letters');

                // Get latest version number
                $latestVersion = $paper->versions()->max('version_number') ?? 1;

                // Create new version
                PaperVersion::create([
                    'paper_id' => $paper->id,
                    'version_number' => $latestVersion + 1,
                    'file_path' => $revisedPath,
                    'response_letter_path' => $responsePath,
                    'author_comments' => $request->summary_of_changes,
                    'type' => 'revised',
                ]);

                \Illuminate\Support\Facades\Log::info('TRANSITIONING_STATUS', ['from' => $paper->status, 'to' => 'resubmitted']);

                $this->workflow->transition($paper, 'REVISION_SUBMITTED', $request->summary_of_changes, [
                    'file_path' => $revisedPath,
                    'file_name' => $revisedFile->getClientOriginalName(),
                ]);

                // Force status update to be absolutely sure
                $paper->status = Paper::STATUS_RESUBMITTED;
                $paper->save();

                \Illuminate\Support\Facades\Log::info('STATUS_UPDATED_SUCCESSFULLY', ['new_status' => $paper->status]);

                return response()->json([
                    'message' => 'تم تقديم التعديلات بنجاح. سيتم مراجعتها من قبل المحرر أو المحكمين.',
                    'paper' => $paper
                ]);
            });
        } catch (\Exception $e) {
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

        return response()->json([
            'message' => 'تم إصدار قرار القبول النهائي للبحث بنجاح.',
            'paper' => $paper
        ]);
    }
}
