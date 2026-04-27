<?php

namespace App\Http\Controllers\Researcher;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\Coauthor;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaperController extends Controller
{
    protected $workflow;
    
    public function __construct(\App\Services\PaperWorkflowService $workflow)
    {
        $this->workflow = $workflow;
    }

    public function index()
    {
        $papers = Paper::where('author_id', Auth::id())
            ->with('conference')
            ->latest()
            ->get()
            ->map(function ($paper) {
                return [
                    'id' => $paper->id,
                    'title' => $paper->title,
                    'conf' => $paper->conference ? $paper->conference->title : 'N/A',
                    'status' => $paper->status,
                    'date' => $paper->created_at->format('Y-m-d'),
                ];
            });

        return response()->json(['papers' => $papers]);
    }

    public function create()
    {
        Log::info('PaperController: create method called');
        // Debug: Return all conferences temporarily to rule out query issues
        $conferences = Conference::select('id', 'title')->get();
        Log::info('PaperController: conferences found: ' . $conferences->count());

        return response()->json(['conferences' => $conferences]);
    }

    public function store(Request $request)
    {
        Log::info('PaperController: store method called', $request->all());

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:300',
                'abstract' => 'required|string',
                'keywords' => 'required|string',
                'conference_id' => 'required|exists:conferences,id',
                'file' => 'required|file|mimes:pdf,doc,docx|max:10240',
                'coauthors' => 'nullable|array',
                'coauthors.*.name' => 'required|string',
                'coauthors.*.email' => 'nullable|email',
                'coauthors.*.affiliation' => 'nullable|string',
            ]);

            DB::transaction(function () use ($validated, $request) {
                $file = $request->file('file');
                $path = $file->store('papers', 'public');

                $paper = Paper::create([
                    'author_id' => Auth::id(),
                    'conf_id' => $validated['conference_id'],
                    'title' => $validated['title'],
                    'abstract' => $validated['abstract'],
                    'keywords' => $validated['keywords'],
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getClientMimeType(),
                    'status' => 'submitted',
                ]);

                if (!empty($validated['coauthors'])) {
                    foreach ($validated['coauthors'] as $index => $coauthorData) {
                        if (!empty($coauthorData['name'])) {
                            Coauthor::create([
                                'paper_id' => $paper->id,
                                'full_name' => $coauthorData['name'],
                                'email' => $coauthorData['email'] ?? '',
                                'affiliation' => $coauthorData['affiliation'] ?? '',
                                'author_order' => $index + 2,
                            ]);
                        }
                    }
                }

                // Initialize workflow
                $this->workflow->transition($paper, 'PAPER_SUBMITTED', 'تقديم البحث لأول مرة');
                
                // إرسال إشعار وايميل للباحث بتأكيد الاستلام
                Auth::user()->notify(new \App\Notifications\SystemNotification(
                    'تأكيد استلام البحث',
                    'تم استلام بحثك بعنوان "' . $paper->title . '" بنجاح ضمن مؤتمر: ' . $paper->conference->title,
                    '/researcher/research/' . $paper->id,
                    'success'
                ));
            });

            Log::info('PaperController: Paper submitted successfully');
            return response()->json(['message' => 'Paper submitted successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('PaperController: Validation failed', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('PaperController: Error submitting paper: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }
    public function show($id)
    {
        Log::info('Researcher Paper Show Request', ['paper_id' => $id, 'user_id' => Auth::id()]);
        
        $paper = Paper::find($id);

        if (!$paper) {
            return response()->json(['message' => "البحث رقم {$id} غير موجود في النظام."], 404);
        }

        if ($paper->author_id != Auth::id()) {
            return response()->json([
                'message' => "غير مصرح لك بعرض هذا البحث. هذا البحث يخص باحثاً آخر.",
                'debug' => [
                    'current_user' => Auth::id(),
                    'paper_author' => $paper->author_id
                ]
            ], 403);
        }

        $paper->load([
            'conference',
            'coauthors',
            'statusHistory', // Load audit trail for status timeline
            'sessions',
            'assignments' => function ($query) {
                $query->where('status', 'completed')
                    ->with('review');
            }
        ]);

        // Remap statusHistory to status_history for frontend compatibility
        $paperData = $paper->toArray();
        $paperData['status_history'] = $paperData['status_history'] ?? [];

        return response()->json(['paper' => $paperData]);
    }

    public function update(Request $request, $id)
    {
        Log::info('PaperController: update method called for ID ' . $id, $request->all());

        $paper = Paper::where('author_id', Auth::id())->findOrFail($id);

        // Optional: Check status before allowing update
        if ($paper->status !== 'submitted' && $paper->status !== 'rejected') {
            // Depending on rules, maybe allow editing only when submitted
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:300',
                'abstract' => 'required|string',
                'keywords' => 'required|string',
                'conference_id' => 'required|exists:conferences,id',
                'file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // File is optional on update
                'coauthors' => 'nullable|array',
                'coauthors.*.name' => 'required|string',
                'coauthors.*.email' => 'nullable|email',
                'coauthors.*.affiliation' => 'nullable|string',
            ]);

            DB::transaction(function () use ($validated, $request, $paper) {
                $updateData = [
                    'conf_id' => $validated['conference_id'],
                    'title' => $validated['title'],
                    'abstract' => $validated['abstract'],
                    'keywords' => $validated['keywords'],
                ];

                if ($request->hasFile('file')) {
                    $file = $request->file('file');
                    $path = $file->store('papers', 'public');
                    $updateData['file_path'] = $path;
                    $updateData['file_name'] = $file->getClientOriginalName();
                    $updateData['file_size'] = $file->getSize();
                    $updateData['file_type'] = $file->getClientMimeType();
                }

                $paper->update($updateData);

                // Professional State Machine: If paper was "revision_required", change it to "resubmitted" automatically
                if ($paper->status === Paper::STATUS_REVISION_REQUIRED) {
                    $this->workflow->transition($paper, 'REVISION_SUBMITTED', 'تم تحديث بيانات البحث من قبل الباحث (تعديل مباشر)');
                }

                // Sync Coauthors: Delete existing and recreate
                $paper->coauthors()->delete();
                if (!empty($validated['coauthors'])) {
                    foreach ($validated['coauthors'] as $index => $coauthorData) {
                        if (!empty($coauthorData['name'])) {
                            Coauthor::create([
                                'paper_id' => $paper->id,
                                'full_name' => $coauthorData['name'],
                                'email' => $coauthorData['email'] ?? '',
                                'affiliation' => $coauthorData['affiliation'] ?? '',
                                'author_order' => $index + 2,
                            ]);
                        }
                    }
                }
            });

            return response()->json(['message' => 'Paper updated successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('PaperController: Update validation failed', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('PaperController: Error updating paper: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    public function destroy($id)
    {
        $paper = Paper::where('author_id', Auth::id())->findOrFail($id);

        // Prevent deleting if under review or accepted
        if ($paper->status === 'under_review' || $paper->status === 'accepted') {
            return response()->json(['message' => 'Cannot delete paper that is under review or accepted'], 403);
        }

        $paper->delete();
        // Optionally delete file from storage: Storage::disk('public')->delete($paper->file_path);

        return response()->json(['message' => 'Paper deleted successfully']);
    }
}
