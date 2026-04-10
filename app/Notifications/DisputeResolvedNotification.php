<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DisputeResolvedNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public function __construct(public readonly mixed $data = null, public readonly mixed $extra = null) {}
    public function via(mixed $notifiable): array { return ['mail', 'database']; }
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — Account Update')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('You have a new update on your TuMa account.')
            ->action('View on TuMa', url('/dashboard'))
            ->line('Thank you for using TuMa.');
    }
    public function toDatabase(mixed $notifiable): array
    {
        return ['message' => 'You have a new account update.', 'action_url' => '/dashboard'];
    }
    public function toSms(mixed $notifiable): string
    {
        return 'TuMa: You have a new account update. Log in to see details.';
    }
}
