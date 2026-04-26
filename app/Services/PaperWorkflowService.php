<?php

namespace App\Services;

use App\Models\Paper;
use App\Models\PaperEvent;
use App\Models\PaperVersion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PaperWorkflowService
{
    /**
     * Transition a paper to a new status.
     */
    public function transition(Paper $paper, string $eventType, ?string $notes = null, array $metadata = [])
    {
        return DB::transaction(function () use ($paper, $eventType, $notes, $metadata) {
            $fromStatus = $paper->status;
            $toStatus = $this->determineNextStatus($eventType, $fromStatus, $metadata);
            
            if (!$toStatus) {
                throw new \Exception("انتقال غير مسموح: لا يمكن تحويل البحث من حالة ({$fromStatus}) عبر الحدث ({$eventType}). يجب اتباع التسلسل الإداري الصحيح ولا يسمح بتجاوز المراحل.");
            }

            if ($toStatus !== $fromStatus) {
                $paper->transitionStatus($toStatus, $notes);
            }

            $event = PaperEvent::create([
                'paper_id' => $paper->id,
                'event_type' => $eventType,
                'from_status' => $fromStatus,
                'to_status' => $toStatus ?? $fromStatus,
                'user_id' => Auth::id(),
                'notes' => $notes,
                'metadata' => $metadata,
            ]);

            // ✅ إذا وصل البحث إلى "مقبول مبدئياً" يتم إخفاء الهوية تلقائياً
            if ($toStatus === Paper::STATUS_PRELIMINARY_ACCEPTED) {
                $this->autoAnonymize($paper);
            }

            return $event;
        });
    }

    /**
     * ✅ إخفاء الهوية التلقائي عند القبول المبدئي.
     * يحفظ النسخة الأصلية ثم ينشئ نسخة عمياء ويُحوّل البحث لمرحلة جاهز للتحكيم.
     */
    public function autoAnonymize(Paper $paper): void
    {
        // 1. حفظ النسخة الأصلية إن لم تكن موجودة
        $existingOriginal = PaperVersion::where('paper_id', $paper->id)
            ->where('type', 'original')
            ->exists();

        if (!$existingOriginal && $paper->file_path) {
            PaperVersion::create([
                'paper_id'       => $paper->id,
                'version_number' => 1,
                'file_path'      => $paper->file_path,
                'type'           => 'original',
                'notes'          => 'النسخة الأصلية المحفوظة قبل إخفاء الهوية',
            ]);
        }

        // 2. نسخ الملف إلى مجلد الإخفاء
        $blindPath = null;
        if ($paper->file_path && Storage::exists($paper->file_path)) {
            $extension  = pathinfo($paper->file_path, PATHINFO_EXTENSION);
            $blindName  = 'blind_' . $paper->id . '_' . time() . '.' . $extension;
            $blindPath  = 'papers/blind/' . $blindName;
            Storage::copy($paper->file_path, $blindPath);
        } elseif ($paper->file_path) {
            // الملف في storage/app (بدون disk public)
            $blindPath = 'papers/blind/blind_' . $paper->id . '_' . time() . '.pdf';
            // محاولة النسخ من المسارات المختلفة
            $srcPath = storage_path('app/' . $paper->file_path);
            $destPath = storage_path('app/' . $blindPath);
            if (file_exists($srcPath)) {
                @mkdir(dirname($destPath), 0755, true);
                copy($srcPath, $destPath);
            } else {
                $blindPath = $paper->file_path; // fallback
            }
        }

        // 3. تسجيل النسخة العمياء
        if ($blindPath) {
            PaperVersion::create([
                'paper_id'       => $paper->id,
                'version_number' => 2,
                'file_path'      => $blindPath,
                'type'           => 'blind',
                'notes'          => 'نسخة عمياء - تم إخفاء هوية المؤلف تلقائياً بواسطة النظام',
            ]);

            $paper->blind_file_path = $blindPath;
            $paper->save();
        }

        // 4. الانتقال التلقائي إلى "جاهز للتحكيم"
        $paper->transitionStatus(
            Paper::STATUS_READY_FOR_REVIEW,
            'تم إخفاء هوية المؤلف تلقائياً. البحث جاهز الآن للتحكيم.'
        );

        PaperEvent::create([
            'paper_id'   => $paper->id,
            'event_type' => 'PAPER_ANONYMIZED',
            'from_status'=> Paper::STATUS_PRELIMINARY_ACCEPTED,
            'to_status'  => Paper::STATUS_READY_FOR_REVIEW,
            'user_id'    => Auth::id(),
            'notes'      => 'إخفاء هوية تلقائي بواسطة النظام',
            'metadata'   => ['auto' => true, 'blind_path' => $blindPath],
        ]);
    }

    /**
     * إخفاء الهوية اليدوي (احتياطي في حالة الحاجة).
     */
    public function anonymize(Paper $paper, string $blindPath, ?string $notes = null)
    {
        return DB::transaction(function () use ($paper, $blindPath, $notes) {
            $paper->blind_file_path = $blindPath;
            $paper->save();

            return $this->transition($paper, 'PAPER_ANONYMIZED', $notes, ['blind_path' => $blindPath]);
        });
    }

    /**
     * Aggregate reviews for a paper.
     */
    public function aggregateReviews(Paper $paper)
    {
        $reviews = $paper->paperAssignments()
            ->with('review')
            ->get()
            ->pluck('review')
            ->filter();

        if ($reviews->isEmpty()) {
            return [
                'count' => 0,
                'average_score' => 0,
                'decision_counts' => [],
                'suggested_decision' => 'waiting',
                'contradiction_detected' => false
            ];
        }

        $count = $reviews->count();
        $avgScore = $reviews->avg('total_avg_score');
        
        $recommendations = $reviews->pluck('recommendation')->toArray();
        $recommendationCounts = array_count_values($recommendations);
        
        // Advanced Scientific Suggestion Logic (Scale 1-10)
        $suggestion = 'reject';
        if ($avgScore >= 8.0) {
            $suggestion = 'accept';
        } elseif ($avgScore >= 6.0) {
            $suggestion = 'minor_revision';
        } elseif ($avgScore >= 4.0) {
            $suggestion = 'major_revision';
        }

        return [
            'count' => $count,
            'average_score' => round($avgScore, 2),
            'recommendation_counts' => $recommendationCounts,
            'suggested_decision' => $suggestion,
            'contradiction_detected' => (isset($recommendationCounts['accept']) && isset($recommendationCounts['reject'])),
            'details' => $reviews->map(function($r) {
                return [
                    'reviewer' => $r->reviewer->full_name,
                    'scores' => [
                        'originality' => $r->originality_score,
                        'methodology' => $r->methodology_score,
                        'results' => $r->results_score,
                        'clarity' => $r->clarity_score,
                    ],
                    'total' => $r->total_avg_score,
                    'recommendation' => $r->recommendation,
                    'comments_to_editor' => $r->comments_to_editor
                ];
            })
        ];
    }

    /**
     * Determine the next status based on the event and current state.
     * Enforces strict sequential workflow.
     */
    protected function determineNextStatus(string $eventType, string $currentStatus, array $metadata = []): ?string
    {
        // Define allowed transitions for each status
        $allowedTransitions = [
            Paper::STATUS_SUBMITTED => [
                'PAPER_SUBMITTED' => Paper::STATUS_UNDER_SCREENING,
            ],
            Paper::STATUS_UNDER_SCREENING => [
                'TECHNICAL_CHECK_PASS' => Paper::STATUS_WITH_EDITOR,
                'TECHNICAL_CHECK_FAIL' => Paper::STATUS_REVISION_REQUIRED,
                'DESK_REJECT' => Paper::STATUS_REJECTED,
                'INITIAL_SCREENING_REJECT' => Paper::STATUS_REJECTED,
            ],
            Paper::STATUS_REVISION_REQUIRED => [
                'REVISION_SUBMITTED' => Paper::STATUS_RESUBMITTED,
                'PAPER_WITHDRAWN' => Paper::STATUS_WITHDRAWN,
            ],
            Paper::STATUS_RESUBMITTED => [
                'PAPER_SUBMITTED' => Paper::STATUS_UNDER_SCREENING,
                'TECHNICAL_CHECK_PASS' => Paper::STATUS_WITH_EDITOR,
            ],
            Paper::STATUS_WITH_EDITOR => [
                'INITIAL_SCREENING_PASS' => Paper::STATUS_PRELIMINARY_ACCEPTED,
                'DESK_REJECT' => Paper::STATUS_REJECTED,
            ],
            Paper::STATUS_PRELIMINARY_ACCEPTED => [
                'PAPER_ANONYMIZED' => Paper::STATUS_READY_FOR_REVIEW,
            ],
            Paper::STATUS_READY_FOR_REVIEW => [
                'REVIEWERS_ASSIGNED' => Paper::STATUS_UNDER_REVIEW,
            ],
            Paper::STATUS_UNDER_REVIEW => [
                'FINAL_ACCEPT' => Paper::STATUS_ACCEPTED,
                'FINAL_REJECT' => Paper::STATUS_REJECTED,
                'REVISION_REQUESTED' => Paper::STATUS_REVISION_REQUIRED,
            ],
            Paper::STATUS_ACCEPTED => [
                'SCHEDULED' => Paper::STATUS_SCHEDULED,
            ],
            Paper::STATUS_SCHEDULED => [
                'PUBLISHED' => Paper::STATUS_PUBLISHED,
            ],
        ];

        // Handle Rejections - they can happen at almost any stage, but we define them explicitly
        if (str_contains($eventType, 'REJECT')) {
            return Paper::STATUS_REJECTED;
        }

        // Special case: Initial submission
        if ($currentStatus === Paper::STATUS_SUBMITTED && $eventType === 'PAPER_SUBMITTED') {
            return Paper::STATUS_UNDER_SCREENING;
        }

        // Check if the event is allowed for the current status
        if (isset($allowedTransitions[$currentStatus][$eventType])) {
            return $allowedTransitions[$currentStatus][$eventType];
        }

        // If no strict rule found, throw an error or return null to block skip
        return null;
    }
}
