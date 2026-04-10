<?php

namespace App\Services;

use App\Exceptions\TumaException;
use App\Models\ExchangeRate;
use App\Models\MatchNegotiation;
use App\Models\PlatformDeposit;
use App\Models\SwapMatch;
use App\Models\SwapOrder;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class MatchingService
{
    public function __construct(
        protected FeeCalculationService $feeService,
        protected NotificationService $notificationService,
        protected AuditService $auditService
    ) {}

    /**
     * Find compatible open orders that can be matched against the given order.
     *
     * Filters:
     * - Opposite order_type
     * - Same zim_delivery_location_id  ← primary location filter
     * - Status = open
     * - Not the same user
     * - Not already in an active negotiation
     */
    public function findMatches(SwapOrder $order): Collection
    {
        return SwapOrder::where('order_type', $order->oppositeType())
            ->where('zim_delivery_location_id', $order->zim_delivery_location_id)
            ->where('status', SwapOrder::STATUS_OPEN)
            ->where('user_id', '!=', $order->user_id)
            ->where('expires_at', '>', now())
            ->with(['user', 'deliveryLocation'])
            ->orderByDesc('is_boosted')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Create a match proposal between two orders.
     *
     * The proposing user provides opening AUD/USD amounts.
     * Creates a SwapMatch (status = proposed) and first MatchNegotiation record.
     */
    public function proposeMatch(
        SwapOrder $orderA,
        SwapOrder $orderB,
        User $proposedBy,
        float $proposedAud,
        float $proposedUsd,
        ?string $message = null
    ): SwapMatch {
        // Validate same location
        if ($orderA->zim_delivery_location_id !== $orderB->zim_delivery_location_id) {
            throw new TumaException('Orders must be for the same Zimbabwe delivery location.', 422);
        }

        // Validate opposite types
        if ($orderA->order_type === $orderB->order_type) {
            throw new TumaException('Cannot match two orders of the same type.', 422);
        }

        // Validate user is not matching with themselves
        if ($orderA->user_id === $orderB->user_id) {
            throw new TumaException('You cannot match with your own order.', 422);
        }

        // Validate proposer owns one of the orders
        if ($proposedBy->id !== $orderA->user_id && $proposedBy->id !== $orderB->user_id) {
            throw new TumaException('You must own one of the orders to propose a match.', 403);
        }

        // Validate user can only have one active negotiation per order
        $sendOrderId    = $orderA->order_type === SwapOrder::TYPE_SEND_TO_ZIM ? $orderA->id : $orderB->id;
        $receiveOrderId = $orderA->order_type === SwapOrder::TYPE_RECEIVE_FROM_ZIM ? $orderA->id : $orderB->id;

        $existingMatch = SwapMatch::where(function ($q) use ($sendOrderId, $receiveOrderId) {
            $q->where('send_order_id', $sendOrderId)
              ->orWhere('receive_order_id', $receiveOrderId);
        })->whereIn('status', [SwapMatch::STATUS_PROPOSED, SwapMatch::STATUS_NEGOTIATING])->exists();

        if ($existingMatch) {
            throw new TumaException('One of these orders already has an active negotiation.', 422);
        }

        $maxRounds = (int) SystemSetting::get('max_negotiation_rounds', 5);

        return DB::transaction(function () use (
            $sendOrderId, $receiveOrderId, $proposedBy,
            $proposedAud, $proposedUsd, $message, $maxRounds,
            $orderA, $orderB
        ) {
            $match = SwapMatch::create([
                'send_order_id'       => $sendOrderId,
                'receive_order_id'    => $receiveOrderId,
                'proposed_aud'        => $proposedAud,
                'proposed_usd'        => $proposedUsd,
                'proposed_by'         => $proposedBy->id,
                'proposed_at'         => now(),
                'negotiation_rounds'  => 1,
                'max_negotiation_rounds' => $maxRounds,
                'status'              => SwapMatch::STATUS_PROPOSED,
                'initiated_by'        => $proposedBy->id,
                'initiated_at'        => now(),
            ]);

            // First negotiation record
            MatchNegotiation::create([
                'swap_match_id' => $match->id,
                'proposed_by'   => $proposedBy->id,
                'proposed_aud'  => $proposedAud,
                'proposed_usd'  => $proposedUsd,
                'message'       => $message,
                'status'        => MatchNegotiation::STATUS_PENDING,
            ]);

            // Update order statuses to negotiating
            $orderA->update(['status' => SwapOrder::STATUS_NEGOTIATING]);
            $orderB->update(['status' => SwapOrder::STATUS_NEGOTIATING]);

            // Notify the OTHER party (not the proposer)
            $otherUser = $proposedBy->id === $orderA->user_id ? $orderB->user : $orderA->user;

            $this->notificationService->notify(
                $otherUser,
                new \App\Notifications\MatchProposedNotification($match, $proposedBy),
                ['email', 'inapp']
            );

            $this->auditService->log('match.proposed', $proposedBy, $match);

            return $match;
        });
    }

    /**
     * Handle a negotiation action: accept or counter.
     *
     * accept  → locks rate, calculates fee, creates deposit record, notifies sender.
     * counter → saves new amounts, increments rounds, notifies other party.
     */
    public function negotiate(
        SwapMatch $match,
        User $user,
        string $action,
        ?float $proposedAud = null,
        ?float $proposedUsd = null,
        ?string $message = null
    ): SwapMatch {
        // Only the non-proposing party can respond
        if ($match->proposed_by === $user->id) {
            throw new TumaException('You cannot respond to your own proposal. Wait for the other party.', 422);
        }

        // Must be one of the two matched parties
        if (! $match->involvesUser($user)) {
            throw new TumaException('You are not part of this match.', 403);
        }

        // Can only negotiate in valid statuses
        if (! in_array($match->status, [SwapMatch::STATUS_PROPOSED, SwapMatch::STATUS_NEGOTIATING])) {
            throw new TumaException(
                "Cannot negotiate when match status is '{$match->status}'.",
                422
            );
        }

        // Check max rounds
        if ($match->negotiation_rounds >= $match->max_negotiation_rounds && $action === 'counter') {
            $this->cancelMatch($match, $user);
            throw new TumaException(
                'Maximum negotiation rounds reached. The match has been cancelled. Your orders are open again.',
                422
            );
        }

        return DB::transaction(function () use ($match, $user, $action, $proposedAud, $proposedUsd, $message) {
            if ($action === 'accept') {
                return $this->acceptNegotiation($match, $user);
            }
            return $this->counterNegotiation($match, $user, $proposedAud, $proposedUsd, $message);
        });
    }

    /**
     * Cancel a match during negotiation.
     * Both orders return to 'open' status.
     */
    public function cancelMatch(SwapMatch $match, User $cancelledBy): void
    {
        if (! in_array($match->status, [
            SwapMatch::STATUS_PROPOSED,
            SwapMatch::STATUS_NEGOTIATING,
            SwapMatch::STATUS_RATE_AGREED,
            SwapMatch::STATUS_DELIVERY_METHOD_SELECTING,
        ])) {
            throw new TumaException(
                "Cannot cancel a match with status '{$match->status}'.",
                422
            );
        }

        DB::transaction(function () use ($match, $cancelledBy) {
            $match->update(['status' => SwapMatch::STATUS_CANCELLED]);

            // Return both orders to open
            $match->sendOrder->update(['status' => SwapOrder::STATUS_OPEN]);
            $match->receiveOrder->update(['status' => SwapOrder::STATUS_OPEN]);

            // Mark latest negotiation as rejected
            $latest = $match->negotiations()->latest('created_at')->first();
            $latest?->update(['status' => MatchNegotiation::STATUS_REJECTED]);

            // Notify both parties
            $otherUser = $cancelledBy->id === $match->sendOrder->user_id
                ? $match->receiveOrder->user
                : $match->sendOrder->user;

            $this->notificationService->notify(
                $otherUser,
                new \App\Notifications\MatchCancelledNotification($match, $cancelledBy),
                ['email', 'inapp']
            );

            $this->auditService->log('match.cancelled', $cancelledBy, $match);
        });
    }

    /**
     * Select the delivery method after rate is agreed.
     * One party proposes; the other must confirm.
     */
    public function proposeDeliveryMethod(
        SwapMatch $match,
        User $proposedBy,
        string $method,
        ?string $riskPayoutMethod = null
    ): SwapMatch {
        if ($match->status !== SwapMatch::STATUS_RATE_AGREED) {
            throw new TumaException(
                'Delivery method can only be selected after both parties agree on the rate.',
                422
            );
        }

        if (! $match->involvesUser($proposedBy)) {
            throw new TumaException('You are not part of this match.', 403);
        }

        if ($method === SwapMatch::DELIVERY_RISK
            && ! (bool) SystemSetting::get('risk_delivery_enabled', true)) {
            throw new TumaException('Risk delivery is currently disabled on this platform.', 422);
        }

        $match->update([
            'delivery_method'             => $method,
            'risk_payout_method'          => $method === 'risk' ? $riskPayoutMethod : null,
            'delivery_method_proposed_by' => $proposedBy->id,
            'delivery_method_proposed_at' => now(),
            'status'                      => SwapMatch::STATUS_DELIVERY_METHOD_SELECTING,
        ]);

        // Notify the other party
        $otherUser = $proposedBy->id === $match->sendOrder->user_id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $otherUser,
            new \App\Notifications\DeliveryMethodProposedNotification($match, $proposedBy),
            ['email', 'inapp']
        );

        $this->auditService->log('match.delivery_method_proposed', $proposedBy, $match);

        return $match->fresh();
    }

    /**
     * Confirm or reject the proposed delivery method.
     */
    public function confirmDeliveryMethod(SwapMatch $match, User $confirmedBy, bool $confirmed): SwapMatch
    {
        if ($match->status !== SwapMatch::STATUS_DELIVERY_METHOD_SELECTING) {
            throw new TumaException('No delivery method proposal is pending confirmation.', 422);
        }

        // Only the non-proposing party can confirm
        if ($match->delivery_method_proposed_by === $confirmedBy->id) {
            throw new TumaException('You cannot confirm your own delivery method proposal.', 422);
        }

        if (! $match->involvesUser($confirmedBy)) {
            throw new TumaException('You are not part of this match.', 403);
        }

        if (! $confirmed) {
            // Rejected — cancel the match
            $this->cancelMatch($match, $confirmedBy);
            return $match->fresh();
        }

        return DB::transaction(function () use ($match, $confirmedBy) {
            $match->update([
                'delivery_method_confirmed_by'  => $confirmedBy->id,
                'delivery_method_confirmed_at'  => now(),
                'delivery_method_agreed'        => true,
                'delivery_method_agreed_at'     => now(),
                'status'                        => SwapMatch::STATUS_AGREED,
            ]);

            // Now proceed to the appropriate flow
            if ($match->delivery_method === SwapMatch::DELIVERY_SECURE) {
                $this->initiateSecureDeposit($match);
            } else {
                $this->initiateRiskDelivery($match);
            }

            // Notify both parties
            foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $user) {
                $this->notificationService->notify(
                    $user,
                    new \App\Notifications\DeliveryMethodConfirmedNotification($match),
                    ['email', 'inapp']
                );
            }

            $this->auditService->log('match.delivery_method_confirmed', $confirmedBy, $match);

            return $match->fresh();
        });
    }

    /**
     * Handle partial match — if agreed amounts differ from the full order amount,
     * split the order and create a remainder.
     * This is called after agreement is reached.
     */
    public function handlePartialMatch(SwapMatch $match): void
    {
        $sendOrder    = $match->sendOrder;
        $agreedAud    = (float) $match->agreed_aud;
        $orderAud     = (float) $sendOrder->amount_aud;

        if (abs($agreedAud - $orderAud) < 0.01) {
            return; // Full match — no split needed
        }

        $remainder = $orderAud - $agreedAud;
        if ($remainder <= 0) return;

        // Create a remainder order
        $rate        = ExchangeRate::currentRate('AUD', 'USD');
        $feeCalc     = $this->feeService->calculateUsd($remainder, $rate, $sendOrder->user);
        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);

        SwapOrder::create([
            'user_id'                  => $sendOrder->user_id,
            'order_type'               => $sendOrder->order_type,
            'amount_aud'               => $remainder,
            'amount_usd'               => $feeCalc['amount_usd'],
            'exchange_rate_id'         => $rate->id,
            'platform_fee_aud'         => $feeCalc['fee_aud'],
            'platform_fee_percent'     => $feeCalc['fee_percent'],
            'zim_recipient_name'       => $sendOrder->zim_recipient_name,
            'zim_recipient_phone'      => $sendOrder->zim_recipient_phone,
            'zim_delivery_location_id' => $sendOrder->zim_delivery_location_id,
            'zim_delivery_address'     => $sendOrder->zim_delivery_address,
            'zim_delivery_notes'       => $sendOrder->zim_delivery_notes,
            'aud_recipient_name'       => $sendOrder->aud_recipient_name,
            'aud_bank_account_id'      => $sendOrder->aud_bank_account_id,
            'status'                   => SwapOrder::STATUS_OPEN,
            'expires_at'               => now()->addHours($expiryHours),
        ]);

        $this->auditService->log('match.partial_split', $sendOrder->user, $match, [], [
            'original_aud' => $orderAud,
            'agreed_aud'   => $agreedAud,
            'remainder'    => $remainder,
        ]);
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private function acceptNegotiation(SwapMatch $match, User $user): SwapMatch
    {
        // Mark the latest negotiation as accepted
        $latest = $match->negotiations()->latest('created_at')->first();
        $latest?->update([
            'status'       => MatchNegotiation::STATUS_ACCEPTED,
            'responded_at' => now(),
        ]);

        // Lock the exchange rate
        $rate = ExchangeRate::currentRate('AUD', 'USD');

        // Determine agreed amounts from the latest proposal
        $agreedAud = $match->proposed_aud;
        $agreedUsd = $match->proposed_usd;

        // Calculate final fee on agreed amount
        $depositorUser = $match->sendOrder->user;
        $feeCalc       = $this->feeService->calculateUsd((float) $agreedAud, $rate, $depositorUser);

        $match->update([
            'agreed_aud'        => $agreedAud,
            'agreed_usd'        => $agreedUsd,
            'exchange_rate_id'  => $rate->id,
            'platform_fee_aud'  => $feeCalc['effective_fee_aud'],
            'agreed_by_send'    => true,
            'agreed_by_receive' => true,
            'agreed_at'         => now(),
            'status'            => SwapMatch::STATUS_RATE_AGREED,
        ]);

        // Both orders move to agreed status
        $match->sendOrder->update(['status' => SwapOrder::STATUS_AGREED]);
        $match->receiveOrder->update(['status' => SwapOrder::STATUS_AGREED]);

        // Notify both parties to now choose delivery method
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\RateAgreedNotification($match),
                ['email', 'inapp']
            );
        }

        $this->auditService->log('match.rate_agreed', $user, $match);

        return $match->fresh();
    }

    private function counterNegotiation(
        SwapMatch $match,
        User $user,
        float $proposedAud,
        float $proposedUsd,
        ?string $message
    ): SwapMatch {
        // Mark current proposal as countered
        $latest = $match->negotiations()->latest('created_at')->first();
        $latest?->update([
            'status'       => MatchNegotiation::STATUS_COUNTERED,
            'responded_at' => now(),
        ]);

        // Create new negotiation record
        MatchNegotiation::create([
            'swap_match_id' => $match->id,
            'proposed_by'   => $user->id,
            'proposed_aud'  => $proposedAud,
            'proposed_usd'  => $proposedUsd,
            'message'       => $message,
            'status'        => MatchNegotiation::STATUS_PENDING,
        ]);

        $newRounds = $match->negotiation_rounds + 1;

        $match->update([
            'proposed_aud'        => $proposedAud,
            'proposed_usd'        => $proposedUsd,
            'proposed_by'         => $user->id,
            'proposed_at'         => now(),
            'negotiation_rounds'  => $newRounds,
            'status'              => SwapMatch::STATUS_NEGOTIATING,
        ]);

        // Notify the other party
        $otherUser = $user->id === $match->sendOrder->user_id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $otherUser,
            new \App\Notifications\CounterOfferNotification($match, $user),
            ['email', 'inapp']
        );

        $this->auditService->log('match.counter_offered', $user, $match);

        // Auto-cancel if max rounds reached
        if ($newRounds >= $match->max_negotiation_rounds) {
            $this->notificationService->notify(
                $otherUser,
                new \App\Notifications\NegotiationExpiredNotification($match),
                ['inapp']
            );
            $this->notificationService->notify(
                $user,
                new \App\Notifications\NegotiationExpiredNotification($match),
                ['inapp']
            );
            // The job AutoCancelMaxRounds will pick this up and cancel
        }

        return $match->fresh();
    }

    private function initiateSecureDeposit(SwapMatch $match): void
    {
        $reference = 'TM-' . strtoupper(substr($match->ulid, 0, 8));

        // Create platform deposit record
        PlatformDeposit::create([
            'swap_match_id'      => $match->id,
            'depositor_user_id'  => $match->sendOrder->user_id,
            'amount_aud'         => $match->agreed_aud,
            'our_bank_reference' => $reference,
            'status'             => PlatformDeposit::STATUS_PENDING,
        ]);

        $match->update(['status' => SwapMatch::STATUS_AWAITING_DEPOSIT]);

        // Notify the sender with deposit instructions
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\DepositInstructionsNotification($match, $reference),
            ['email', 'inapp']
        );
    }

    private function initiateRiskDelivery(SwapMatch $match): void
    {
        $match->update(['status' => SwapMatch::STATUS_AWAITING_RISK_DELIVERY]);

        // Notify deliverer to proceed with cash delivery
        $deliverer = $match->receiveOrder->user;
        $this->notificationService->notify(
            $deliverer,
            new \App\Notifications\RiskDeliveryProceedNotification($match),
            ['email', 'inapp']
        );

        // Notify sender that deliverer is going first
        $this->notificationService->notify(
            $match->sendOrder->user,
            new \App\Notifications\RiskDeliveryNoticeNotification($match),
            ['email', 'inapp']
        );
    }
}
