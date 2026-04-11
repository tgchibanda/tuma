<?php

namespace App\Services;

use App\Models\ExchangeRate;
use App\Models\MatchNegotiation;
use App\Models\SwapMatch;
use App\Models\SwapOrder;
use App\Models\SystemSetting;
use App\Models\User;
use App\Exceptions\TumaException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MatchingService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected FeeCalculationService $feeService,
        protected EscrowService $escrowService,
        protected AuditService $auditService
    ) {}

    /**
     * Propose a match between two orders.
     * Proposer must own one of the orders; the other must be owned by someone else.
     */
    public function proposeMatch(
        SwapOrder $targetOrder,
        User $proposer,
        float $proposedAud,
        float $proposedUsd,
        ?string $message = null
    ): SwapMatch {
        // Determine which order is proposer's and which is target's
        $proposerOrder = SwapOrder::where('user_id', $proposer->id)
            ->where('order_type', $this->oppositeType($targetOrder->order_type))
            ->where('status', 'open')
            ->where('zim_delivery_location_id', $targetOrder->zim_delivery_location_id)
            ->latest()
            ->first();

        if (! $proposerOrder) {
            throw new TumaException(
                'You need an open order for the opposite direction in the same Zimbabwe city to propose a match.',
                422
            );
        }

        if ($proposerOrder->user_id === $targetOrder->user_id) {
            throw new TumaException('You cannot match with your own order.', 422);
        }

        // Check max rounds setting
        $maxRounds = (int) SystemSetting::get('max_negotiation_rounds', 5);

        return DB::transaction(function () use ($targetOrder, $proposerOrder, $proposer, $proposedAud, $proposedUsd, $message, $maxRounds) {
            // Determine send/receive order based on type
            $sendOrder    = $proposerOrder->order_type === 'send_to_zim' ? $proposerOrder : $targetOrder;
            $receiveOrder = $proposerOrder->order_type === 'receive_from_zim' ? $proposerOrder : $targetOrder;

            $match = SwapMatch::create([
                'ulid'                  => (string) \Symfony\Component\Uid\Ulid::generate(),
                'send_order_id'         => $sendOrder->id,
                'receive_order_id'      => $receiveOrder->id,
                'proposed_aud'          => $proposedAud,
                'proposed_usd'          => $proposedUsd,
                'proposed_by'           => $proposer->id,
                'proposed_at'           => now(),
                'initiated_by'          => $proposer->id,
                'initiated_at'          => now(),
                'negotiation_rounds'    => 1,
                'max_negotiation_rounds'=> $maxRounds,
                'status'                => SwapMatch::STATUS_PROPOSED,
                'delivery_method'       => 'pending',
            ]);

            // Create negotiation record
            MatchNegotiation::create([
                'swap_match_id' => $match->id,
                'proposed_by'   => $proposer->id,
                'proposed_aud'  => $proposedAud,
                'proposed_usd'  => $proposedUsd,
                'message'       => $message,
                'status'        => 'pending',
            ]);

            // Lock both orders
            $sendOrder->update(['status' => 'negotiating']);
            $receiveOrder->update(['status' => 'negotiating']);

            return $match;
        });
    }

    /**
     * Accept, counter, or reject the current negotiation proposal.
     */
    public function negotiate(
        SwapMatch $match,
        User $responder,
        string $action,
        ?float $counterAud = null,
        ?float $counterUsd = null,
        ?string $message = null
    ): SwapMatch {
        if (! in_array($match->status, [SwapMatch::STATUS_PROPOSED, SwapMatch::STATUS_NEGOTIATING])) {
            throw new TumaException('This match is not in a negotiable state.', 422);
        }

        // Must be the other party (not the proposer of the last round)
        if ($match->proposed_by === $responder->id) {
            throw new TumaException('It is not your turn to respond.', 422);
        }

        return match ($action) {
            'accept'  => $this->acceptRate($match, $responder),
            'counter' => $this->counterOffer($match, $responder, $counterAud, $counterUsd, $message),
            'reject'  => $this->cancelMatch($match, $responder),
            default   => throw new TumaException('Invalid negotiation action.', 422),
        };
    }

    /**
     * Accept the current proposed rate.
     */
    private function acceptRate(SwapMatch $match, User $acceptor): SwapMatch
    {
        $rate = ExchangeRate::where('from_currency', 'AUD')
            ->where('to_currency', 'USD')
            ->where('is_active', 1)
            ->latest('created_at')
            ->first();

        if (! $rate) {
            throw new TumaException('No active exchange rate found.', 503);
        }

        $feeCalc = $this->feeService->calculateUsd($match->proposed_aud, $rate, $match->sendOrder->user);

        DB::transaction(function () use ($match, $acceptor, $rate, $feeCalc) {
            // Update the last negotiation record
            MatchNegotiation::where('swap_match_id', $match->id)
                ->latest()
                ->first()
                ?->update(['status' => 'accepted', 'responded_at' => now()]);

            $match->update([
                'status'           => SwapMatch::STATUS_RATE_AGREED,
                'agreed_aud'       => $match->proposed_aud,
                'agreed_usd'       => $feeCalc['amount_usd'],
                'exchange_rate_id' => $rate->id,
                'platform_fee_aud' => $feeCalc['fee_aud'],
                'agreed_by_send'   => 1,
                'agreed_by_receive'=> 1,
                'agreed_at'        => now(),
            ]);

            // Apply fee discount if any
            if ($feeCalc['discount_id']) {
                \App\Models\FeeDiscount::where('id', $feeCalc['discount_id'])
                    ->decrement('uses_remaining');
                $match->sendOrder->update([
                    'fee_discount_id'   => $feeCalc['discount_id'],
                    'discounted_fee_aud'=> $feeCalc['fee_aud'],
                ]);
            }
        });

        // Notify both parties to now select delivery method
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            $this->notificationService->notify(
                $party,
                new \App\Notifications\RateAgreedNotification($match),
                ['email', 'inapp']
            );
        }

        return $match->fresh();
    }

    /**
     * Counter-offer with new rates.
     */
    private function counterOffer(
        SwapMatch $match,
        User $proposer,
        ?float $newAud,
        ?float $newUsd,
        ?string $message
    ): SwapMatch {
        if (! $newAud || ! $newUsd) {
            throw new TumaException('Counter-offer requires both AUD and USD amounts.', 422);
        }

        $maxRounds = (int) SystemSetting::get('max_negotiation_rounds', 5);

        if ($match->negotiation_rounds >= $maxRounds) {
            throw new TumaException("Maximum negotiation rounds ({$maxRounds}) reached. Match cancelled.", 422);
        }

        DB::transaction(function () use ($match, $proposer, $newAud, $newUsd, $message) {
            MatchNegotiation::where('swap_match_id', $match->id)
                ->latest()
                ->first()
                ?->update(['status' => 'countered', 'responded_at' => now()]);

            MatchNegotiation::create([
                'swap_match_id' => $match->id,
                'proposed_by'   => $proposer->id,
                'proposed_aud'  => $newAud,
                'proposed_usd'  => $newUsd,
                'message'       => $message,
                'status'        => 'pending',
            ]);

            $match->update([
                'status'               => SwapMatch::STATUS_NEGOTIATING,
                'proposed_aud'         => $newAud,
                'proposed_usd'         => $newUsd,
                'proposed_by'          => $proposer->id,
                'proposed_at'          => now(),
                'negotiation_rounds'   => $match->negotiation_rounds + 1,
            ]);
        });

        // Notify the other party
        $other = $match->sendOrder->user_id === $proposer->id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $other,
            new \App\Notifications\NegotiationCounterNotification($match),
            ['email', 'inapp']
        );

        return $match->fresh();
    }

    /**
     * Cancel a match and return both orders to open.
     */
    public function cancelMatch(SwapMatch $match, ?User $cancelledBy = null): SwapMatch
    {
        DB::transaction(function () use ($match, $cancelledBy) {
            MatchNegotiation::where('swap_match_id', $match->id)
                ->where('status', 'pending')
                ->update(['status' => 'rejected', 'responded_at' => now()]);

            $match->update(['status' => SwapMatch::STATUS_CANCELLED]);
            $match->sendOrder->update(['status' => 'open']);
            $match->receiveOrder->update(['status' => 'open']);
        });

        // Notify other party
        if ($cancelledBy) {
            $other = $match->sendOrder->user_id === $cancelledBy->id
                ? $match->receiveOrder->user
                : $match->sendOrder->user;

            $this->notificationService->notify(
                $other,
                new \App\Notifications\MatchCancelledNotification($match, $cancelledBy),
                ['email', 'inapp']
            );
        }

        return $match->fresh();
    }

    /**
     * Propose or confirm a delivery method after rate has been agreed.
     */
    public function proposeDeliveryMethod(
        SwapMatch $match,
        User $proposer,
        string $method,
        ?string $riskPayoutMethod = null
    ): SwapMatch {
        if ($match->status !== SwapMatch::STATUS_RATE_AGREED) {
            throw new TumaException('Delivery method can only be set after the rate is agreed.', 422);
        }

        if (! in_array($method, ['secure', 'risk'])) {
            throw new TumaException('Invalid delivery method.', 422);
        }

        if ($method === 'risk' && SystemSetting::get('risk_delivery_enabled') === 'false') {
            throw new TumaException('Risk delivery is currently disabled on this platform.', 422);
        }

        $match->update([
            'delivery_method'            => $method,
            'risk_payout_method'         => $method === 'risk' ? ($riskPayoutMethod ?? 'platform_then_bank') : null,
            'delivery_method_proposed_by'=> $proposer->id,
            'delivery_method_proposed_at'=> now(),
            'status'                     => SwapMatch::STATUS_DELIVERY_METHOD_SELECTING,
        ]);

        $other = $match->sendOrder->user_id === $proposer->id
            ? $match->receiveOrder->user
            : $match->sendOrder->user;

        $this->notificationService->notify(
            $other,
            new \App\Notifications\DeliveryMethodProposedNotification($match),
            ['email', 'inapp']
        );

        return $match->fresh();
    }

    /**
     * Accept or reject the proposed delivery method.
     */
    public function confirmDeliveryMethod(SwapMatch $match, User $confirmer, bool $confirmed): SwapMatch
    {
        if ($match->status !== SwapMatch::STATUS_DELIVERY_METHOD_SELECTING) {
            throw new TumaException('Not in delivery method selection stage.', 422);
        }

        if ($match->delivery_method_proposed_by === $confirmer->id) {
            throw new TumaException('You cannot confirm your own delivery method proposal.', 422);
        }

        if (! $confirmed) {
            return $this->cancelMatch($match, $confirmer);
        }

        DB::transaction(function () use ($match, $confirmer) {
            $match->update([
                'delivery_method_confirmed_by' => $confirmer->id,
                'delivery_method_confirmed_at' => now(),
                'delivery_method_agreed'       => 1,
                'delivery_method_agreed_at'    => now(),
                'status'                       => SwapMatch::STATUS_AGREED,
            ]);
        });

        // Trigger the correct escrow flow
        if ($match->delivery_method === 'secure') {
            $this->escrowService->secureFlow_initiate($match->fresh());
        } else {
            $this->escrowService->riskFlow_initiate($match->fresh());
        }

        return $match->fresh();
    }

    /**
     * Find potential matches for an order.
     */
    public function findMatches(SwapOrder $order, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return SwapOrder::where('order_type', $this->oppositeType($order->order_type))
            ->where('status', 'open')
            ->where('zim_delivery_location_id', $order->zim_delivery_location_id)
            ->where('user_id', '!=', $order->user_id)
            ->orderByDesc('is_boosted')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Handle partial match splitting.
     */
    public function handlePartialMatch(SwapOrder $order, float $matchedAmount): SwapOrder
    {
        $remaining = $order->amount_aud - $matchedAmount;

        // Create a new order for the remaining amount
        return SwapOrder::create([
            'ulid'                     => (string) \Symfony\Component\Uid\Ulid::generate(),
            'user_id'                  => $order->user_id,
            'order_type'               => $order->order_type,
            'amount_aud'               => $remaining,
            'amount_usd'               => round($remaining * $order->amount_usd / $order->amount_aud, 2),
            'exchange_rate_id'         => $order->exchange_rate_id,
            'platform_fee_aud'         => round($remaining * $order->platform_fee_aud / $order->amount_aud, 2),
            'platform_fee_percent'     => $order->platform_fee_percent,
            'zim_recipient_name'       => $order->zim_recipient_name,
            'zim_recipient_phone'      => $order->zim_recipient_phone,
            'zim_delivery_location_id' => $order->zim_delivery_location_id,
            'zim_delivery_address'     => $order->zim_delivery_address,
            'zim_delivery_notes'       => $order->zim_delivery_notes,
            'aud_recipient_name'       => $order->aud_recipient_name,
            'aud_bank_account_id'      => $order->aud_bank_account_id,
            'status'                   => 'open',
            'expires_at'               => $order->expires_at,
            'template_id'              => $order->template_id,
        ]);
    }

    private function oppositeType(string $type): string
    {
        return $type === 'send_to_zim' ? 'receive_from_zim' : 'send_to_zim';
    }
}
