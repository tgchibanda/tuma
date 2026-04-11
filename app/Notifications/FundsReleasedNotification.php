<?php
// FILE: app/Notifications/FundsReleasedNotification.php

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
        $isSender = $this->match->sendOrder->user_id === $notifiable->id;

        return (new MailMessage)
            ->subject('TuMa — Transaction Completed! 🎉')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your TuMa transaction has been completed successfully.')
            ->line($isSender
                ? 'The USD cash has been confirmed as delivered to your recipient in Zimbabwe.'
                : 'The AUD funds have been released to your bank account.')
            ->line('**Transaction Reference:** ' . $this->match->getDepositReference())
            ->line('**Amount:** AUD $' . number_format($this->match->agreed_aud, 2) . ' ↔ USD $' . number_format($this->match->agreed_usd, 2))
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa!');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Transaction completed — AUD $' . $this->match->agreed_aud . ' ↔ USD $' . $this->match->agreed_usd,
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/ReadyToReleaseAdminNotification.php
// ────────────────────────────────────────────────────────────────────
class ReadyToReleaseAdminNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Ready to release: AUD $' . $this->match->agreed_aud . ' for match ' . $this->match->ulid,
            'action_url' => '/admin/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
            'type'       => 'release_ready',
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/DepositProofUploadedAdminNotification.php
// ────────────────────────────────────────────────────────────────────
class DepositProofUploadedAdminNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly mixed $subject) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        $ulid = method_exists($this->subject, 'getDepositReference')
            ? $this->subject->ulid
            : $this->subject->ulid ?? 'unknown';

        return [
            'message'    => 'Deposit proof uploaded — please verify for match ' . $ulid,
            'action_url' => '/admin/matches/' . $ulid,
            'match_ulid' => $ulid,
            'type'       => 'deposit_verify',
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/RateAgreedNotification.php
// ────────────────────────────────────────────────────────────────────
class RateAgreedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — Rate Agreed! Choose Your Delivery Method')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Great news! Both parties have agreed on the exchange rate for your transaction.')
            ->line('**Rate:** AUD $' . number_format($this->match->agreed_aud, 2) . ' ↔ USD $' . number_format($this->match->agreed_usd, 2))
            ->line('Next step: choose your preferred delivery method (Secure or Risk delivery).')
            ->action('Choose Delivery Method', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Rate agreed! Choose your delivery method to proceed.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/NegotiationCounterNotification.php
// ────────────────────────────────────────────────────────────────────
class NegotiationCounterNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'New counter-offer received: AUD $' . $this->match->proposed_aud . ' ↔ USD $' . $this->match->proposed_usd,
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/MatchCancelledNotification.php
// ────────────────────────────────────────────────────────────────────
class MatchCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly SwapMatch $match,
        public readonly mixed $cancelledBy = null
    ) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — Match Cancelled')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your match has been cancelled. Your order has been returned to the open queue.')
            ->action('Browse Orders', url('/browse'))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Your match was cancelled. Your order is back in the queue.',
            'action_url' => '/orders',
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/DeliveryMethodProposedNotification.php
// ────────────────────────────────────────────────────────────────────
class DeliveryMethodProposedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        $method = $this->match->delivery_method === 'secure' ? 'Secure Delivery' : 'Risk Delivery';

        return (new MailMessage)
            ->subject('TuMa — Delivery Method Proposed: ' . $method)
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your match partner has proposed **' . $method . '** for this transaction.')
            ->line($this->match->delivery_method === 'secure'
                ? 'Secure: sender deposits AUD first, then cash is delivered.'
                : 'Risk: deliverer sends cash first, then sender deposits AUD.')
            ->line('Please accept or propose an alternative.')
            ->action('Respond', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Delivery method proposed: ' . $this->match->delivery_method . '. Please respond.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/DeliveryProofUploadedNotification.php
// ────────────────────────────────────────────────────────────────────
class DeliveryProofUploadedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — Cash Delivered! Please Confirm Receipt')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('The deliverer has uploaded proof that the cash has been delivered in Zimbabwe.')
            ->line('Please confirm whether the recipient received the cash.')
            ->action('Confirm Receipt', url('/matches/' . $this->match->ulid))
            ->line('You have 24 hours to confirm. If no confirmation is received, a dispute will be raised automatically.')
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Cash delivered! Please confirm receipt to release funds.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/FundsSecuredNotification.php
// ────────────────────────────────────────────────────────────────────
class FundsSecuredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — AUD is Secured! Please Deliver Cash Now')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('The sender\'s AUD deposit has been verified and is secured in TuMa escrow.')
            ->line('Please deliver USD $' . number_format($this->match->agreed_usd, 2) . ' cash to the recipient in Zimbabwe.')
            ->line('Once delivered, upload the verification photos in the app.')
            ->action('Upload Delivery Proof', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'AUD secured! Please deliver USD $' . $this->match->agreed_usd . ' cash now.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/DisputeAutoRaisedNotification.php
// ────────────────────────────────────────────────────────────────────
class DisputeAutoRaisedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Auto-dispute raised for match ' . $this->match->ulid . ' — confirmation window expired.',
            'action_url' => '/admin/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
            'type'       => 'auto_dispute',
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/RiskDeliveryGoFirstNotification.php
// ────────────────────────────────────────────────────────────────────
class RiskDeliveryGoFirstNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — ⚠ Risk Delivery: Please Deliver Cash First')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Both parties have agreed on **Risk Delivery** for this transaction.')
            ->line('This means you deliver the USD cash first, and the sender will deposit AUD after delivery is confirmed.')
            ->line('Please deliver USD $' . number_format($this->match->agreed_usd, 2) . ' to the recipient in Zimbabwe.')
            ->line('⚠ Only proceed if you trust the sender. TuMa cannot guarantee payment before delivery in Risk mode.')
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => '⚠ Risk delivery: Please deliver USD $' . $this->match->agreed_usd . ' cash first.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/RiskDeliveryPartnerGoingFirstNotification.php
// ────────────────────────────────────────────────────────────────────
class RiskDeliveryPartnerGoingFirstNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['mail', 'database']; }

    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('TuMa — Risk Delivery: Partner is Delivering Cash First')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Both parties agreed on Risk Delivery. Your partner will deliver the USD cash first.')
            ->line('Once you confirm that the recipient received the cash, you will be asked to deposit AUD $' . number_format($this->match->agreed_aud, 2) . ' to complete the transaction.')
            ->line('⚠ Only confirm receipt if the cash was actually received. Your deposit will be required immediately after confirmation.')
            ->action('View Transaction', url('/matches/' . $this->match->ulid))
            ->line('Thank you for using TuMa.');
    }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Your partner is delivering cash first. Confirm receipt when it arrives.',
            'action_url' => '/matches/' . $this->match->ulid,
            'match_ulid' => $this->match->ulid,
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/NegotiationExpiredNotification.php
// ────────────────────────────────────────────────────────────────────
class NegotiationExpiredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly SwapMatch $match) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'Negotiation expired — maximum rounds reached. Your order is back in the queue.',
            'action_url' => '/orders',
        ];
    }
}


// ────────────────────────────────────────────────────────────────────
// FILE: app/Notifications/DisputeMessageNotification.php
// ────────────────────────────────────────────────────────────────────
class DisputeMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly \App\Models\Dispute $dispute,
        public readonly \App\Models\DisputeMessage $message
    ) {}

    public function via(mixed $notifiable): array { return ['database']; }

    public function toDatabase(mixed $notifiable): array
    {
        return [
            'message'    => 'New message in your dispute from ' . ($this->message->is_admin_message ? 'TuMa Admin' : 'the other party'),
            'action_url' => '/disputes/' . $this->dispute->id,
        ];
    }
}
