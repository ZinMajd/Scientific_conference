<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Coauthor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PaperController extends Controller
{
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
            'has_file' => $request->hasFile('paper_file'),
            'file_info' => $request->file('paper_file') ? [
                'name' => $request->file('paper_file')->getClientOriginalName(),
                'size' => $request->file('paper_file')->getSize(),
                'mime' => $request->file('paper_file')->getMimeType(),
            ] : 'No file found',
            'all_data' => $request->except(['paper_file']),
        ]);

        try {
            $request->validate([
                'conf_id' => 'required|exists:conferences,id',
                'title' => 'required|string|max:500',
                'abstract' => 'required|string',
                'keywords' => 'required|string',
                'track' => 'nullable|string',
                'paper_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
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
                $file = $request->file('paper_file');
                $path = $file->store('papers');

                $paper = Paper::create([
                    'author_id' => Auth::id(),
                    'conf_id' => $request->conf_id,
                    'title' => $request->title,
                    'abstract' => $request->abstract,
                    'keywords' => $request->keywords,
                    'track' => $request->track,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getClientOriginalExtension(),
                    'status' => 'submitted',
                ]);

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
        $paper = Paper::with(['conference', 'author', 'coauthors', 'assignments.review'])->findOrFail($id);

        // Authorization check if needed (only author, committee, or assigned reviewer)
        // For now, simple return
        return response()->json($paper);
    }

    public function initialScreening(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted_for_review,desk_rejection,incomplete',
            'notes' => 'nullable|string',
            'plagiarism_ratio' => 'nullable|numeric|min:0|max:100',
            'format_match' => 'nullable|boolean',
        ]);

        $paper = Paper::findOrFail($id);

        $statusMap = [
            'accepted_for_review' => 'under_review',
            'desk_rejection' => 'rejected',
            'incomplete' => 'incomplete'
        ];

        $paper->update([
            'status' => $statusMap[$request->status],
            'screening_notes' => $request->notes,
            'plagiarism_ratio' => $request->plagiarism_ratio,
            'format_match' => $request->format_match,
            'screening_date' => now()
        ]);

        // Notify author
        // NotificationLog::create([...]) - Assuming notification logic elsewhere

        return response()->json([
            'message' => 'تم تسجيل نتيجة الفحص الأولي بنجاح',
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

                $paper->update([
                    'file_path' => $revisedPath,
                    'file_name' => $revisedFile->getClientOriginalName(),
                    'status' => 'under_review',
                    'decision_notes' => $request->summary_of_changes,
                ]);

                return response()->json([
                    'message' => 'تم تقديم التعديلات بنجاح. سيتم إرسالها للمحكمين للمراجعة.',
                    'paper' => $paper
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'فشل تقديم التعديلات: ' . $e->getMessage()], 500);
        }
    }

    public function finalAcceptance(Request $request, $id)
    {
        $paper = Paper::findOrFail($id);

        // Authorization: ensure only committee can finalize
        // (Assuming middleware handles general access, but good to be explicit for logic)

        $paper->update([
            'status' => 'accepted',
            'acceptance_date' => now(),
            'is_final' => true,
        ]);

        // Trigger notification queue for author
        // Sending email with acceptance letter template...

        return response()->json([
            'message' => 'تم إصدار قرار القبول النهائي للبحث بنجاح.',
            'paper' => $paper
        ]);
    }
}
