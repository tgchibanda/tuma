<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryProofUploadedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $usd = number_format((float) $this->match->agreed_usd, 2);

        return (new MailMessage)
            ->subject('eZimConnect — Cash delivery proof uploaded')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line("The deliverer has uploaded proof that USD \${$usd} cash has been delivered.")
            ->line('Please confirm that your recipient received the money.')
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('Confirm Receipt', url('/matches/' . $this->match->ulid))
            ->line('If there is an issue, you can raise a dispute from the transaction page.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => 'Cash delivery proof uploaded. Please confirm receipt.',
            'action_url'  => '/matches/' . $this->match->ulid,
            'amount_usd'  => (float) $this->match->agreed_usd,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return 'eZimConnect: USD $' . number_format((float) $this->match->agreed_usd, 2)
            . ' delivery proof uploaded. Open the app to confirm receipt. Ref: '
            . $this->match->getDepositReference();
    }
}
