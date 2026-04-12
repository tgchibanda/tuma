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
        $grossAud   = number_format((float) $this->match->agreed_aud, 2);
        $feeAud     = number_format((float) ($this->match->platform_fee_aud ?? 0), 2);
        $netAud     = number_format((float) $this->match->agreed_aud - (float) ($this->match->platform_fee_aud ?? 0), 2);
        $isReceiver = $this->match->receiveOrder?->user_id === $notifiable->id;

        if ($isReceiver) {
            return (new MailMessage)
                ->subject("TuMa — AUD \${$netAud} has been released to your account")
                ->greeting('Hi ' . $notifiable->display_first_name . ',')
                ->line('Great news! Your transaction is complete and funds have been released.')
                ->line("Gross amount agreed: AUD \${$grossAud}")
                ->line("TuMa platform fee: AUD \${$feeAud}")
                ->line("**Net amount transferred to your bank: AUD \${$netAud}**")
                ->line('Reference: ' . $this->match->getDepositReference())
                ->line('Please allow 1–3 business days for the transfer to appear in your account.')
                ->action('View Transaction', url('/matches/' . $this->match->ulid))
                ->line('Thank you for using TuMa!');
        }

        return (new MailMessage)
            ->subject("TuMa — Transaction complete (Ref: " . $this->match->getDepositReference() . ")")
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your transaction is complete. AUD funds have been released to your partner.')
            ->line("Amount: AUD \${$grossAud}")
            ->line('Reference: ' . $this->match->getDepositReference())
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa!');
    }

    public function toDatabase(mixed $notifiable): array
    {
        $gross  = (float) $this->match->agreed_aud;
        $fee    = (float) ($this->match->platform_fee_aud ?? 0);
        $net    = round($gross - $fee, 2);
        $isReceiver = $this->match->receiveOrder?->user_id === $notifiable->id;

        $message = $isReceiver
            ? "AUD \${$net} released to your bank (after AUD \${$fee} platform fee from AUD \${$gross})."
            : "Transaction complete. AUD \$" . number_format($gross, 2) . " released to your partner.";

        return [
            'match_ulid' => $this->match->ulid,
            'message'    => $message,
            'action_url' => '/matches/' . $this->match->ulid,
            'amount_aud' => $gross,
            'net_aud'    => $net,
            'fee_aud'    => $fee,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        $gross = number_format((float) $this->match->agreed_aud, 2);
        $fee   = number_format((float) ($this->match->platform_fee_aud ?? 0), 2);
        $net   = number_format((float) $this->match->agreed_aud - (float) ($this->match->platform_fee_aud ?? 0), 2);
        $isReceiver = $this->match->receiveOrder?->user_id === $notifiable->id;
        return $isReceiver
            ? "TuMa: AUD \${$net} sent to your bank (fee AUD \${$fee} deducted from AUD \${$gross}). Ref: " . $this->match->getDepositReference()
            : "TuMa: Transaction complete. Ref: " . $this->match->getDepositReference();
    }
}
