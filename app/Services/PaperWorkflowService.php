<?php

namespace App\Services;

use App\Models\Paper;
use App\Models\PaperEvent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

            if ($toStatus && $toStatus !== $fromStatus) {
                $paper->transitionStatus($toStatus, $notes);
            }

            return PaperEvent::create([
                'paper_id' => $paper->id,
                'event_type' => $eventType,
                'from_status' => $fromStatus,
                'to_status' => $toStatus ?? $fromStatus,
                'user_id' => Auth::id(),
                'notes' => $notes,
                'metadata' => $metadata,
            ]);
        });
    }

    /**
     * Set the blind version of a paper.
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
     * Determine the next status based on the event.
     */
    protected function determineNextStatus(string $eventType, string $currentStatus, array $metadata = []): ?string
    {
        switch ($eventType) {
            case 'PAPER_SUBMITTED':
                return Paper::STATUS_UNDER_SCREENING; // ينتقل لمكتب التحرير للفحص الأولي
            
            case 'TECHNICAL_CHECK_PASS':
                return Paper::STATUS_WITH_EDITOR; // نجح الفحص الفني، ينتقل للمحرر العلمي
            
            case 'TECHNICAL_CHECK_FAIL':
            case 'REVISION_REQUESTED':
                return Paper::STATUS_REVISION_REQUIRED; // مطلوب تعديلات من الباحث
            
            case 'REVISION_SUBMITTED':
                return Paper::STATUS_RESUBMITTED; // الباحث عدل البحث، يعود للفحص
            
            case 'DESK_REJECT':
            case 'INITIAL_SCREENING_REJECT':
            case 'FINAL_REJECT':
                return Paper::STATUS_REJECTED; 
            
            case 'INITIAL_SCREENING_PASS':
            case 'PAPER_ANONYMIZED':
            case 'REVIEWERS_ASSIGNED':
                return Paper::STATUS_UNDER_REVIEW; // البحث الآن قيد التحكيم الفعلي
            
            case 'FINAL_ACCEPT':
                return Paper::STATUS_ACCEPTED;
            
            case 'SCHEDULED':
                return Paper::STATUS_SCHEDULED;

            default:
                return null;
        }
    }
}
