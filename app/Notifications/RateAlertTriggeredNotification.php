<?php

namespace App\Notifications;

use App\Models\RateAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RateAlertTriggeredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly RateAlert $alert,
        public readonly float $currentRate
    ) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $direction = $this->alert->direction === 'above' ? 'risen above' : 'dropped below';
        $pair      = $this->alert->from_currency . '/' . $this->alert->to_currency;

        return (new MailMessage)
            ->subject("eZimConnect Rate Alert — {$pair} has {$direction} {$this->alert->target_rate}")
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line("Your rate alert has been triggered!")
            ->line("The {$pair} exchange rate has {$direction} your target of {$this->alert->target_rate}.")
            ->line("Current rate: {$this->currentRate}")
            ->action('Create an Order Now', url('/orders/create'))
            ->line('Thank you for using eZimConnect.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        $pair = $this->alert->from_currency . '/' . $this->alert->to_currency;
        return [
            'message'      => "Rate alert: {$pair} is now {$this->currentRate} (target was {$this->alert->target_rate})",
            'action_url'   => '/orders/create',
            'current_rate' => $this->currentRate,
            'target_rate'  => (float) $this->alert->target_rate,
            'pair'         => $pair,
        ];
    }
}
