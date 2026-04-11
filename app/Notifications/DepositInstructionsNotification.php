<?php

namespace App\Notifications;

use App\Models\SwapMatch;
use App\Models\SystemSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DepositInstructionsNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private array $channels = ['mail', 'database'];

    private string $reference;

    public function __construct(
        public readonly SwapMatch $match,
        ?string $reference = null
    ) {
        // Accept explicit reference or derive from match ULID automatically
        $this->reference = $reference ?? ('TM-' . strtoupper(substr($match->ulid, 0, 8)));
    }

    public function via(mixed $notifiable): array
    {
        return $this->channels;
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $bankName    = SystemSetting::get('tuma_bank_name', 'National Australia Bank');
        $accountName = SystemSetting::get('tuma_account_name', 'TuMa Pty Ltd Trust Account');
        $bsb         = SystemSetting::get('tuma_bsb', '000-000');
        $accountNum  = SystemSetting::get('tuma_account_number', '000000000');
        $amount      = number_format((float) $this->match->agreed_aud, 2);

        return (new MailMessage)
            ->subject("TuMa — Please deposit AUD \${$amount}")
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Both parties have agreed. Please make your AUD deposit to secure the transaction.')
            ->line('Bank: ' . $bankName)
            ->line('Account Name: ' . $accountName)
            ->line('BSB: ' . $bsb)
            ->line('Account Number: ' . $accountNum)
            ->line('Amount: AUD $' . $amount)
            ->line('Reference (IMPORTANT): ' . $this->reference)
            ->line('You MUST use the exact reference above so we can identify your deposit.')
            ->action('Upload Proof of Payment', url('/matches/' . $this->match->ulid))
            ->line('Once transferred, upload a screenshot of your bank receipt in the app.')
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'match_ulid'  => $this->match->ulid,
            'match_status'=> $this->match->status,
            'message'     => "Please deposit AUD \${$this->match->agreed_aud}. Reference: {$this->reference}",
            'action_url'  => '/matches/' . $this->match->ulid,
            'reference'   => $this->reference,
            'amount_aud'  => (float) $this->match->agreed_aud,
        ];
    }

    public function toSms(mixed $notifiable): string
    {
        return "TuMa: Please deposit AUD \${$this->match->agreed_aud} using ref {$this->reference}. Open the app for bank details.";
    }
}
