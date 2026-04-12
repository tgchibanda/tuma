<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FundsSecuredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $amount = number_format((float) $this->match->agreed_aud, 2);
        $usd    = number_format((float) $this->match->agreed_usd, 2);

        return (new MailMessage)
            ->subject('eZimConnect — Your AUD deposit is secured')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line("Your deposit of AUD \${$amount} has been verified and secured in escrow.")
            ->line("The cash deliverer has been notified to deliver USD \${$usd} to your recipient.")
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('You will be notified once the cash has been delivered.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => 'Your AUD deposit is secured. Cash delivery is in progress.',
            'action_url'  => '/matches/' . $this->match->ulid,
            'amount_aud'  => (float) $this->match->agreed_aud,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: Your AUD $' . number_format((float) $this->match->agreed_aud, 2)
            . ' is secured. Cash delivery is underway. Ref: ' . $this->match->getDepositReference();
    }
}
