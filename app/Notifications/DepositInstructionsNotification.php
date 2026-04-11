<?php
// FILE: app/Notifications/DepositInstructionsNotification.php

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

    public function __construct(
        public readonly SwapMatch $match,
        public readonly string $flow = 'secure'
    ) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $bankName   = SystemSetting::get('tuma_bank_name', 'National Australia Bank');
        $accountName= SystemSetting::get('tuma_account_name', 'TuMa Pty Ltd Trust Account');
        $bsb        = SystemSetting::get('tuma_bsb', '000-000');
        $accountNo  = SystemSetting::get('tuma_account_number', '000000000');
        $ref        = $this->match->getDepositReference();

        $subject = $this->flow === 'risk'
            ? 'TuMa — Action Required: Deposit AUD After Delivery Confirmation'
            : 'TuMa — Deposit Instructions for Your Transaction';

        $intro = $this->flow === 'risk'
            ? 'The cash has been delivered and confirmed. Please deposit the AUD amount now to complete the transaction.'
            : 'Your match has been agreed. Please deposit the AUD amount to our escrow account to proceed.';

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line($intro)
            ->line('**Bank:** ' . $bankName)
            ->line('**Account Name:** ' . $accountName)
            ->line('**BSB:** ' . $bsb)
            ->line('**Account Number:** ' . $accountNo)
            ->line('**Amount:** AUD $' . number_format($this->match->agreed_aud, 2))
            ->line('**Reference:** ' . $ref . ' *(use this exact reference)*')
            ->line('Once deposited, upload your payment screenshot in the app.')
            ->action('Upload Deposit Proof', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Please deposit AUD $' . $this->match->agreed_aud . ' to complete your transaction.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
            'reference'  => $this->match->getDepositReference(),
        ];
    }
}
