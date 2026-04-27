<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaperStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $paper;
    protected $statusMessage;
    protected $actionUrl;

    /**
     * Create a new notification instance.
     */
    public function __construct($paper, $statusMessage, $actionUrl = null)
    {
        $this->paper = $paper;
        $this->statusMessage = $statusMessage;
        $this->actionUrl = $actionUrl ?? url('/researcher/papers/' . $paper->id);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('تحديث جديد بخصوص بحثك العلمي')
                    ->greeting('مرحباً ' . $notifiable->full_name)
                    ->line('هناك تحديث جديد بخصوص بحثك المودع بعنوان: ' . $this->paper->title)
                    ->line($this->statusMessage)
                    ->action('عرض تفاصيل البحث', $this->actionUrl)
                    ->line('شكراً لاستخدامك منصة المؤتمر العلمي لجامعة إقليم سبأ.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'paper_id' => $this->paper->id,
            'title' => $this->paper->title,
            'message' => $this->statusMessage,
            'url' => $this->actionUrl,
        ];
    }
}
