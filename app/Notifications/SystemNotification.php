<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\EmailLog;

class SystemNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $title;
    protected $message;
    protected $actionUrl;
    protected $type;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $message, $actionUrl = null, $type = 'info')
    {
        $this->title = $title;
        $this->message = $message;
        $this->actionUrl = $actionUrl;
        $this->type = $type;
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
        try {
            $mail = (new MailMessage)
                ->subject($this->title)
                ->greeting('مرحباً ' . ($notifiable->full_name ?? ''))
                ->line($this->message);

            if ($this->actionUrl) {
                $mail->action('عرض التفاصيل', $this->actionUrl);
            }

            $mail->line('شكراً لاستخدامك منصة المؤتمر العلمي.');

            // Log the email
            EmailLog::create([
                'to_email' => $notifiable->email,
                'subject' => $this->title,
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return $mail;
        } catch (\Exception $e) {
            EmailLog::create([
                'to_email' => $notifiable->email,
                'subject' => $this->title,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'sent_at' => now(),
            ]);
            throw $e;
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->actionUrl,
            'type' => $this->type,
        ];
    }
}
