<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NegotiationCounterNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $aud = number_format((float) $this->match->proposed_aud, 2);
        $usd = number_format((float) $this->match->proposed_usd, 2);

        return (new MailMessage)
            ->subject('eZimConnect — Counter-offer received')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your match partner has submitted a counter-offer on your transaction.')
            ->line("New proposal: AUD \${$aud} → USD \${$usd}")
            ->line('Log in to review and accept or counter the offer.')
            ->action('View Match', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using eZimConnect.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        $aud = number_format((float) $this->match->proposed_aud, 2);
        $usd = number_format((float) $this->match->proposed_usd, 2);

        return [
            'match_ulid'   => $this->match->ulid,
            'match_status' => $this->match->status,
            'message'      => "Counter-offer received: AUD \${$aud} → USD \${$usd}. Review and respond.",
            'action_url'   => '/matches/' . $this->match->ulid,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: Counter-offer received on your match. Log in to respond: ' .
               url('/matches/' . $this->match->ulid);
    }
}
