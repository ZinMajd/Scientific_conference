<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paper;
use App\Models\User;
use App\Services\PaperWorkflowService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductionController extends Controller
{
    protected $workflow;

    public function __construct(PaperWorkflowService $workflow)
    {
        $this->workflow = $workflow;
    }

    /**
     * List papers in production phase
     */
    public function papers(Request $request)
    {
        $query = Paper::with(['conference', 'author'])
            ->whereIn('status', [
                Paper::STATUS_IN_PRODUCTION, 
                Paper::STATUS_READY_TO_PUBLISH,
                Paper::STATUS_ACCEPTED,
                Paper::STATUS_SCHEDULED
            ]);


        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->paginate(15);
    }

    /**
     * Send paper to production office
     */
    public function sendToProduction(Request $request, $id)
    {
        $paper = Paper::findOrFail($id);
        
        $this->workflow->transition($paper, 'SEND_TO_PRODUCTION', 'تم تحويل البحث لمكتب الإنتاج والتنسيق النهائي.');

        // Notify production office users
        try {
            $productionStaff = User::where('user_type', 'production_office')->get();
            foreach ($productionStaff as $staff) {
                $staff->notify(new \App\Notifications\SystemNotification(
                    'بحث جديد للإنتاج 🖨️',
                    'تم تحويل البحث "' . $paper->title . '" إلى مكتب الإنتاج للتنسيق النهائي.',
                    url('/production'),
                    'info'
                ));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Production Send Notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'تم تحويل البحث للإنتاج بنجاح',
            'paper' => $paper
        ]);
    }

    /**
     * Update production details and upload final file
     */
    public function updateProduction(Request $request, $id)
    {
        $request->validate([
            'final_file' => 'nullable|file|mimes:pdf|max:20480',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'doi' => 'nullable|string',
            'page_numbers' => 'nullable|string',
            'publish_delay_days' => 'nullable|integer|min:0',
            'notes' => 'nullable|string'
        ]);

        $paper = Paper::findOrFail($id);

        if ($request->hasFile('final_file')) {
            $path = $request->file('final_file')->store('papers/final', 'public');
            $paper->final_file_path = $path;
        }

        if ($request->hasFile('thumbnail')) {
            $thumbPath = $request->file('thumbnail')->store('papers/thumbnails', 'public');
            $paper->thumbnail_path = $thumbPath;
        }

        if ($request->has('doi')) $paper->doi = $request->doi;
        if ($request->has('page_numbers')) $paper->page_numbers = $request->page_numbers;

        $paper->save();

        return response()->json([
            'message' => 'تم تحديث بيانات الإنتاج بنجاح',
            'paper' => $paper
        ]);
    }

    /**
     * Mark paper as ready for publish (start the timer)
     */
    public function markReadyForPublish(Request $request, $id)
    {
        $request->validate([
            'publish_delay_days' => 'nullable|integer|min:0'
        ]);

        $paper = Paper::findOrFail($id);
        
        $delayDays = $request->input('publish_delay_days', 2);
        $publishAt = now()->addDays($delayDays);

        $paper->publish_at = $publishAt;
        $paper->save();

        $this->workflow->transition($paper, 'MARK_READY_FOR_PUBLISH', "البحث جاهز للنشر. سيتم النشر تلقائياً بتاريخ: " . $publishAt->toDateString());

        return response()->json([
            'message' => 'تم وضع البحث في قائمة النشر المجدول',
            'publish_at' => $publishAt,
            'paper' => $paper
        ]);
    }

    /**
     * Manually publish now
     */
    public function publishNow($id)
    {
        $paper = Paper::findOrFail($id);
        
        $this->workflow->transition($paper, 'PUBLISH', 'تم النشر النهائي والمباشر للبحث.');
        
        $paper->publish_at = now();
        $paper->is_published = true;
        $paper->save();

        // Create Publication record
        DB::table('publications')->insert([
            'paper_id' => $paper->id,
            'conference_id' => $paper->conf_id,
            'doi' => $paper->doi,
            'page_numbers' => $paper->page_numbers,
            'file_path' => $paper->final_file_path ?? $paper->file_path,
            'published_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم نشر البحث بنجاح',
            'paper' => $paper
        ]);
    }

    /**
     * Return to author for production revisions (e.g. formatting issues)
     */
    public function returnToAuthor(Request $request, $id)
    {
        $request->validate([
            'notes' => 'required|string'
        ]);

        $paper = Paper::findOrFail($id);

        $this->workflow->transition($paper, 'RETURN_TO_AUTHOR', 'تمت الإعادة من قبل مكتب الإنتاج: ' . $request->notes);

        // Notify author
        try {
            $paper->author->notify(new \App\Notifications\SystemNotification(
                'طلب تعديلات إنتاجية ⚠️',
                'طلب مكتب الإنتاج بعض التعديلات على تنسيق بحثك: ' . $request->notes,
                url('/researcher/research/' . $paper->id),
                'warning'
            ));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Notification Error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'تم إعادة البحث للباحث لتعديل التنسيق',
            'paper' => $paper
        ]);
    }

    /**
     * Researcher re-submits corrected paper to production office
     */
    public function resubmitToProduction(Request $request, $id)
    {
        $request->validate([
            'revised_file' => 'required|file|mimes:pdf|max:20480',
            'notes'        => 'nullable|string',
        ]);

        $paper = Paper::findOrFail($id);

        if ($paper->author_id !== \Illuminate\Support\Facades\Auth::id()) {
            return response()->json(['message' => 'غير مصرح لك.'], 403);
        }

        if ($paper->status !== Paper::STATUS_PRODUCTION_REVISION_REQUIRED) {
            return response()->json(['message' => 'البحث ليس في مرحلة التعديلات الإنتاجية.'], 422);
        }

        // Store the revised file
        $path = $request->file('revised_file')->store('papers/production_revised', 'public');
        $paper->file_path = $path;
        $paper->save();

        // Transition back to in_production
        $this->workflow->transition(
            $paper,
            'REVISION_SUBMITTED',
            'أرسل الباحث النسخة المُصحَّحة بعد تعديل التنسيق. ' . ($request->notes ?? '')
        );

        // Notify production office users
        try {
            $productionStaff = User::where('user_type', 'production_office')->get();
            foreach ($productionStaff as $staff) {
                $staff->notify(new \App\Notifications\SystemNotification(
                    'تسليم نسخة مُعدَّلة للإنتاج 📄',
                    'أرسل الباحث ' . $paper->author->full_name . ' نسخة مُصحَّحة للبحث: "' . $paper->title . '".',
                    url('/production'),
                    'info'
                ));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Production Resubmit Notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'تم إرسال النسخة المُعدَّلة بنجاح لمكتب الإنتاج',
            'paper'   => $paper
        ]);
    }
}


