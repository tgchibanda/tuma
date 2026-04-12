<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class DeliveryMethodConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly mixed $match,
        public readonly mixed $actor = null
    ) {}

    public function via(mixed $notifiable): array
    {
        return $this->channels ?? ['mail', 'database'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('eZimConnect — Transaction Update')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('You have a new update on your eZimConnect transaction.')
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using eZimConnect.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => 'You have a transaction update.',
            'action_url'  => '/matches/' . $this->match->ulid,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: You have a new transaction update. Ref: ' . $this->match->getDepositReference();
    }
}
