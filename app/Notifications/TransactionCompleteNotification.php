<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionCompleteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly mixed $data = null, public readonly mixed $extra = null) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('eZimConnect — Transaction Update')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('You have a new update on your eZimConnect account.')
            ->action('View on eZimConnect', url('/dashboard'))
            ->line('Thank you for using eZimConnect.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return ['message' => 'You have a new notification.', 'action_url' => '/dashboard'];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: You have a new notification. Log in to see details.';
    }
}
