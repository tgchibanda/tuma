<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RiskDeliveryPartnerGoingFirstNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $usd = number_format((float) $this->match->agreed_usd, 2);
        $aud = number_format((float) $this->match->agreed_aud, 2);

        return (new MailMessage)
            ->subject('eZimConnect — Your partner is delivering cash first (Risk Delivery)')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Both parties have agreed to Risk Delivery.')
            ->line("Your partner will deliver USD \${$usd} cash to your recipient first.")
            ->line("Once you confirm receipt, you will be asked to deposit AUD \${$aud} to complete the transaction.")
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('You will receive a notification once the cash has been delivered.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => 'Risk Delivery: Your partner is delivering USD $' . number_format((float) $this->match->agreed_usd, 2) . ' cash first.',
            'action_url'  => '/matches/' . $this->match->ulid,
            'amount_usd'  => (float) $this->match->agreed_usd,
            'amount_aud'  => (float) $this->match->agreed_aud,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: Your partner is delivering USD $'
            . number_format((float) $this->match->agreed_usd, 2)
            . ' first. Confirm receipt then deposit AUD. Ref: '
            . $this->match->getDepositReference();
    }
}
