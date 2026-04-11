<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FundsReleasedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $amount = number_format((float) $this->match->agreed_aud, 2);
        return (new MailMessage)
            ->subject("TuMa — AUD \${$amount} released to your account")
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line("AUD \${$amount} has been released to your bank account.")
            ->line('Reference: ' . $this->match->getDepositReference())
            ->line('Please allow 1-3 business days for the transfer to appear.')
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa!');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid' => $this->match->ulid,
            'message'    => 'AUD $' . number_format((float) $this->match->agreed_aud, 2) . ' released to your bank.',
            'action_url' => '/matches/' . $this->match->ulid,
            'amount_aud' => (float) $this->match->agreed_aud,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'TuMa: AUD $' . number_format((float) $this->match->agreed_aud, 2) . ' sent to your bank. Ref: ' . $this->match->getDepositReference();
    }
}
