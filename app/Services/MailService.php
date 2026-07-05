<?php

namespace App\Services;

use App\Models\User;
use App\Models\Paper;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    /**
     * Subject lines for every workflow event
     */
    protected static array $subjects = [
        'PAPER_SUBMITTED'               => '✅ تم استلام بحثك العلمي بنجاح',
        'TECHNICAL_CHECK_PASS'          => '📋 بحثك يتقدم - اجتاز المراجعة التقنية',
        'TECHNICAL_CHECK_FAIL'          => '⚠️ بحثك يتطلب تعديلات تقنية',
        'DESK_REJECT'                   => '❌ نتيجة مراجعة بحثك العلمي',
        'INITIAL_SCREENING_REJECT'      => '❌ نتيجة مراجعة بحثك العلمي',
        'INITIAL_SCREENING_PASS'        => '🎯 بحثك مقبول مبدئياً — مبروك!',
        'PAPER_ANONYMIZED'              => '📤 بحثك جاهز للتحكيم العلمي',
        'REVIEWERS_ASSIGNED'            => '⚖️ بدأت عملية التحكيم على بحثك',
        'FINAL_ACCEPT'                  => '🎉 تهانينا! تم قبول بحثك نهائياً',
        'FINAL_REJECT'                  => '❌ نتيجة التحكيم النهائية لبحثك',
        'REVISION_REQUESTED'            => '📝 بحثك يتطلب تعديلات بناءً على التحكيم',
        'REVISION_SUBMITTED'            => '🔄 تم استلام نسخة البحث المعدَّلة',
        'SCHEDULED'                     => '📅 تم جدولة بحثك في المؤتمر',
        'SEND_TO_PRODUCTION'            => '🖨️ بحثك في مرحلة الإنتاج والنشر',
        'MARK_READY_FOR_PUBLISH'        => '📚 بحثك جاهز للنشر الرسمي',
        'RETURN_TO_AUTHOR'              => '✏️ بحثك يتطلب تعديلات إنتاجية',
        'PUBLISH'                       => '🌍 تم نشر بحثك رسمياً — مبروك!',
        'PUBLISHED'                     => '🌍 تم نشر بحثك رسمياً — مبروك!',
        'PAPER_WITHDRAWN'               => 'تم سحب بحثك من المؤتمر',
    ];

    /**
     * Send email when a paper transitions to a new status (to author)
     */
    public static function sendPaperStatusUpdate(Paper $paper, string $eventType, string $newStatus, ?string $notes = null): void
    {
        try {
            $author = $paper->author;
            if (!$author || !$author->email) return;

            $subject = self::$subjects[$eventType] ?? "تحديث حالة بحثك في المؤتمر العلمي";

            // First submission: use dedicated template
            if ($eventType === 'PAPER_SUBMITTED') {
                Mail::send('emails.paper_submitted', [
                    'user'  => $author,
                    'paper' => $paper->load('conference'),
                ], function ($msg) use ($author, $subject) {
                    $msg->to($author->email, $author->full_name)
                        ->subject($subject);
                });
                return;
            }

            // All other transitions
            Mail::send('emails.paper_status_update', [
                'user'      => $author,
                'paper'     => $paper->load('conference'),
                'newStatus' => $newStatus,
                'eventType' => $eventType,
                'notes'     => $notes,
            ], function ($msg) use ($author, $subject) {
                $msg->to($author->email, $author->full_name)
                    ->subject($subject);
            });

        } catch (\Exception $e) {
            Log::error('[MailService] sendPaperStatusUpdate failed', [
                'paper_id'  => $paper->id,
                'event'     => $eventType,
                'error'     => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send email when a reviewer is assigned to a paper
     */
    public static function sendReviewerAssigned(User $reviewer, Paper $paper, $assignment): void
    {
        try {
            if (!$reviewer->email) return;

            $dueDate = $assignment->due_date
                ? \Carbon\Carbon::parse($assignment->due_date)->format('Y/m/d')
                : 'خلال أسبوعين';

            Mail::send('emails.reviewer_assigned', [
                'reviewerName' => $reviewer->full_name,
                'paperTitle'   => $paper->title,
                'assignmentId' => $assignment->id,
                'dueDate'      => $dueDate,
            ], function ($msg) use ($reviewer) {
                $msg->to($reviewer->email, $reviewer->full_name)
                    ->subject('⚖️ تم تعيينك محكماً لبحث علمي جديد');
            });

        } catch (\Exception $e) {
            Log::error('[MailService] sendReviewerAssigned failed', [
                'reviewer_id' => $reviewer->id,
                'paper_id'    => $paper->id,
                'error'       => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send reviewer invitation email with registration link
     */
    public static function sendReviewerInvitation(string $toEmail, string $reviewerName, string $invitationLink, ?string $affiliation = null): void
    {
        try {
            Mail::send('emails.reviewer_invitation', [
                'reviewerName'   => $reviewerName,
                'invitationLink' => $invitationLink,
                'affiliation'    => $affiliation,
            ], function ($msg) use ($toEmail, $reviewerName) {
                $msg->to($toEmail, $reviewerName)
                    ->subject('🏛️ دعوة للانضمام كمحكم علمي — جامعة إقليم سبأ');
            });

        } catch (\Exception $e) {
            Log::error('[MailService] sendReviewerInvitation failed', [
                'email' => $toEmail,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
