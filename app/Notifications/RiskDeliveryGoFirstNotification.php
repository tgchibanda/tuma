<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RiskDeliveryGoFirstNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $usd = number_format((float) $this->match->agreed_usd, 2);

        return (new MailMessage)
            ->subject('TuMa — Please deliver cash first (Risk Delivery)')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Both parties have agreed to Risk Delivery — you go first.')
            ->line("Please deliver USD \${$usd} cash to the recipient.")
            ->line('Once you upload delivery proof and the sender confirms receipt, the AUD will be deposited to your Australian bank account.')
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('Upload Delivery Proof', url('/matches/' . $this->match->ulid))
            ->line('Only proceed if you trust this transaction. You can raise a dispute if there are any issues.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => 'Risk Delivery: Please deliver USD $' . number_format((float) $this->match->agreed_usd, 2) . ' cash first.',
            'action_url'  => '/matches/' . $this->match->ulid,
            'amount_usd'  => (float) $this->match->agreed_usd,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'TuMa Risk Delivery: Please deliver USD $'
            . number_format((float) $this->match->agreed_usd, 2)
            . ' cash first. Ref: ' . $this->match->getDepositReference();
    }
}
