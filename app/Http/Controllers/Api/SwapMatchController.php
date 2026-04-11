<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\TumaException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DeliveryMethodRequest;
use App\Http\Requests\Api\NegotiateRequest;
use App\Http\Requests\Api\ProposeMatchRequest;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\SwapOrder;
use App\Models\TransactionMessage;
use App\Services\MatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SwapMatchController extends Controller
{
    use ApiResponse;

    public function __construct(protected MatchingService $matchingService) {}

    /**
     * List the authenticated user's matches.
     * GET /api/v1/matches
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $query = SwapMatch::where(function ($q) use ($userId) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $userId))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $userId));
        })
        ->with(['sendOrder.user', 'receiveOrder.user', 'sendOrder.deliveryLocation'])
        ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $matches = $query->paginate(15);

        // Attach unread message count per match
        $matchIds   = $matches->pluck('id');
        $unreadCounts = TransactionMessage::whereIn('swap_match_id', $matchIds)
            ->where('is_read', false)
            ->where('sender_id', '!=', $userId)
            ->selectRaw('swap_match_id, count(*) as unread_count')
            ->groupBy('swap_match_id')
            ->pluck('unread_count', 'swap_match_id');

        $formatted = $matches->getCollection()->map(function ($match) use ($userId, $unreadCounts) {
            $data = $this->formatMatch($match, $userId);
            $data['unread_messages'] = $unreadCounts[$match->id] ?? 0;
            return $data;
        });

        return $this->paginated($matches, 'Matches retrieved.', $formatted);
    }

    /**
     * Get full match detail.
     * GET /api/v1/matches/{ulid}
     */
    public function show(Request $request, string $ulid): JsonResponse
    {
        $userId = $request->user()->id;
        $match  = $this->findMatchForUser($ulid, $userId);

        $match->load([
            'sendOrder.user', 'sendOrder.deliveryLocation', 'sendOrder.bankAccount',
            'receiveOrder.user', 'receiveOrder.deliveryLocation',
            'negotiations.proposedBy',
            'deposit',
            'delivery.deliveryLocation',
            'dispute',
            'exchangeRate',
        ]);

        return $this->success(
            $this->formatMatch($match, $userId, detailed: true),
            'Match retrieved.'
        );
    }

    /**
     * Get full negotiation history for a match.
     * GET /api/v1/matches/{ulid}/negotiations
     */
    public function negotiations(Request $request, string $ulid): JsonResponse
    {
        $userId = $request->user()->id;
        $match  = $this->findMatchForUser($ulid, $userId);

        $negotiations = $match->negotiations()
            ->with('proposedBy')
            ->orderBy('created_at')
            ->get()
            ->map(fn($n) => [
                'id'           => $n->id,
                'proposed_by'  => [
                    'ulid'         => $n->proposedBy->ulid,
                    'display_name' => $n->proposedBy->display_name,
                    'is_me'        => $n->proposed_by === $userId,
                ],
                'proposed_aud' => (float) $n->proposed_aud,
                'proposed_usd' => (float) $n->proposed_usd,
                'message'      => $n->message,
                'status'       => $n->status,
                'responded_at' => $n->responded_at?->toIso8601String(),
                'created_at'   => $n->created_at->toIso8601String(),
                'created_human'=> $n->created_at->diffForHumans(),
            ]);

        return $this->success([
            'match_status'       => $match->status,
            'negotiation_rounds' => $match->negotiation_rounds,
            'max_rounds'         => $match->max_negotiation_rounds,
            'rounds_remaining'   => max(0, $match->max_negotiation_rounds - $match->negotiation_rounds),
            'is_my_turn'         => $match->proposed_by !== $userId,
            'negotiations'       => $negotiations,
        ], 'Negotiation history retrieved.');
    }

    /**
     * Propose a match on an order.
     * POST /api/v1/orders/{ulid}/propose-match
     */
    public function proposeMatch(ProposeMatchRequest $request, string $ulid): JsonResponse
    {
        $user = $request->user();

        // {ulid} in the URL is the TARGET order (the one you clicked "Propose" on in Browse).
        // The MatchingService auto-finds the proposer's matching order using $user->id + same city.
        $targetOrder = SwapOrder::where('ulid', $ulid)
            ->where('status', SwapOrder::STATUS_OPEN)
            ->where('user_id', '!=', $user->id)
            ->firstOrFail();

        try {
            // Service signature: proposeMatch($targetOrder, $proposer, $aud, $usd, $message)
            // The service finds the proposer's own open order of the opposite type internally.
            $match = $this->matchingService->proposeMatch(
                $targetOrder,
                $user,
                (float) $request->proposed_aud,
                (float) $request->proposed_usd,
                $request->message
            );
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->created(
            $this->formatMatch($match->load(['sendOrder.user', 'receiveOrder.user']), $user->id),
            'Match proposed successfully. Waiting for the other party to respond.'
        );
    }

    /**
     * Submit a counter-offer or accept the current proposal.
     * POST /api/v1/matches/{ulid}/negotiate
     */
    public function negotiate(NegotiateRequest $request, string $ulid): JsonResponse
    {
        $user  = $request->user();
        $match = $this->findMatchForUser($ulid, $user->id);

        try {
            $updated = $this->matchingService->negotiate(
                $match,
                $user,
                $request->action,
                $request->proposed_aud ? (float) $request->proposed_aud : null,
                $request->proposed_usd ? (float) $request->proposed_usd : null,
                $request->message
            );
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        $message = $request->action === 'accept'
            ? 'Rate agreed. Now choose your delivery method.'
            : 'Counter-offer sent. Waiting for the other party.';

        return $this->success(
            $this->formatMatch($updated->load(['sendOrder.user', 'receiveOrder.user']), $user->id),
            $message
        );
    }

    /**
     * Cancel a match during negotiation.
     * PUT /api/v1/matches/{ulid}/cancel
     */
    public function cancel(Request $request, string $ulid): JsonResponse
    {
        $user  = $request->user();
        $match = $this->findMatchForUser($ulid, $user->id);

        try {
            $this->matchingService->cancelMatch($match, $user);
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success(null, 'Match cancelled. Your order is open again.');
    }

    /**
     * Propose a delivery method (after rate is agreed).
     * POST /api/v1/matches/{ulid}/delivery-method
     */
    public function selectDeliveryMethod(DeliveryMethodRequest $request, string $ulid): JsonResponse
    {
        $user  = $request->user();
        $match = $this->findMatchForUser($ulid, $user->id);

        try {
            $updated = $this->matchingService->proposeDeliveryMethod(
                $match,
                $user,
                $request->method,
                $request->risk_payout_method
            );
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success(
            $this->formatMatch($updated, $user->id),
            'Delivery method proposed. Waiting for the other party to confirm.'
        );
    }

    /**
     * Confirm or reject the proposed delivery method.
     * POST /api/v1/matches/{ulid}/delivery-method/confirm
     */
    public function confirmDeliveryMethod(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'confirmed' => ['required', 'boolean'],
            'reason'    => ['nullable', 'string', 'max:500'],
        ]);

        $user  = $request->user();
        $match = $this->findMatchForUser($ulid, $user->id);

        try {
            $updated = $this->matchingService->confirmDeliveryMethod(
                $match,
                $user,
                (bool) $request->confirmed
            );
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        $message = $request->confirmed
            ? 'Delivery method confirmed. Proceeding with the transaction.'
            : 'Delivery method rejected. Match has been cancelled.';

        return $this->success($this->formatMatch($updated, $user->id), $message);
    }

    /**
     * Get the current delivery method status.
     * GET /api/v1/matches/{ulid}/delivery-method
     */
    public function getDeliveryMethod(Request $request, string $ulid): JsonResponse
    {
        $userId = $request->user()->id;
        $match  = $this->findMatchForUser($ulid, $userId);

        return $this->success([
            'delivery_method'             => $match->delivery_method,
            'risk_payout_method'          => $match->risk_payout_method,
            'delivery_method_agreed'      => (bool) $match->delivery_method_agreed,
            'delivery_method_proposed_by' => $match->delivery_method_proposed_by,
            'delivery_method_agreed_at'   => $match->delivery_method_agreed_at?->toIso8601String(),
            'proposed_by_me'              => $match->delivery_method_proposed_by === $userId,
            'awaiting_my_confirmation'    => $match->status === SwapMatch::STATUS_DELIVERY_METHOD_SELECTING
                                             && $match->delivery_method_proposed_by !== $userId,
            'match_status'                => $match->status,
        ], 'Delivery method status retrieved.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Find a match that involves the given user. Throws 404 if not found.
     */
    private function findMatchForUser(string $ulid, int $userId): SwapMatch
    {
        $match = SwapMatch::where('ulid', $ulid)->first();

        if (! $match) {
            abort(404, 'Match not found.');
        }

        $sendUserId    = $match->sendOrder?->user_id;
        $receiveUserId = $match->receiveOrder?->user_id;
        if ($sendUserId !== $userId && $receiveUserId !== $userId) {
            abort(403, 'You are not part of this match.');
        }

        return $match;
    }

    private function formatMatch(SwapMatch $match, int $myUserId, bool $detailed = false): array
    {
        $amISender   = $match->sendOrder->user_id === $myUserId;
        $amIReceiver = $match->receiveOrder->user_id === $myUserId;

        $data = [
            'id'                          => $match->id,
            'ulid'                        => $match->ulid,
            'status'                      => $match->status,
            'my_role'                     => $amISender ? 'sender' : 'receiver',
            'delivery_method'             => $match->delivery_method,
            'risk_payout_method'          => $match->risk_payout_method,
            'delivery_method_agreed'      => (bool) $match->delivery_method_agreed,
            'delivery_method_proposed_by' => $match->delivery_method_proposed_by,
            'agreed_aud'                  => $match->agreed_aud ? (float) $match->agreed_aud : null,
            'agreed_usd'                  => $match->agreed_usd ? (float) $match->agreed_usd : null,
            'platform_fee_aud'            => $match->platform_fee_aud ? (float) $match->platform_fee_aud : null,
            'proposed_aud'                => $match->proposed_aud ? (float) $match->proposed_aud : null,
            'proposed_usd'                => $match->proposed_usd ? (float) $match->proposed_usd : null,
            'is_my_turn_to_negotiate'     => ($match->proposed_by && $match->proposed_by !== $myUserId),
            'negotiation_rounds'          => $match->negotiation_rounds,
            'max_negotiation_rounds'      => $match->max_negotiation_rounds,
            'deposit_reference'           => $match->getDepositReference(),
            'initiated_at'                => $match->initiated_at?->toIso8601String(),
            'agreed_at'                   => $match->agreed_at?->toIso8601String(),
            'completed_at'                => $match->completed_at?->toIso8601String(),
            'created_at'                  => $match->created_at->toIso8601String(),
        ];

        if ($match->relationLoaded('sendOrder')) {
            $data['send_order'] = [
                'ulid'              => $match->sendOrder->ulid,
                'amount_aud'        => (float) $match->sendOrder->amount_aud,
                'zim_recipient_name'=> $match->sendOrder->zim_recipient_name,
                'delivery_location' => $match->sendOrder->relationLoaded('deliveryLocation') ? [
                    'id'   => $match->sendOrder->deliveryLocation?->id,
                    'name' => $match->sendOrder->deliveryLocation?->name,
                ] : null,
                'owner'             => $match->sendOrder->relationLoaded('user') ? [
                    'ulid'         => $match->sendOrder->user->ulid,
                    'display_name' => $match->sendOrder->user->display_name,
                    'rating'       => $match->sendOrder->user->rating,
                    'trust_score'  => $match->sendOrder->user->trust_score,
                    'last_seen'    => $match->sendOrder->user->last_seen_human,
                    'avatar_url'   => $match->sendOrder->user->avatar_url,
                    'is_me'        => $match->sendOrder->user_id === $myUserId,
                ] : null,
            ];
        }

        if ($match->relationLoaded('receiveOrder')) {
            $data['receive_order'] = [
                'ulid'   => $match->receiveOrder->ulid,
                'amount_aud' => (float) $match->receiveOrder->amount_aud,
                'owner'  => $match->receiveOrder->relationLoaded('user') ? [
                    'ulid'         => $match->receiveOrder->user->ulid,
                    'display_name' => $match->receiveOrder->user->display_name,
                    'rating'       => $match->receiveOrder->user->rating,
                    'trust_score'  => $match->receiveOrder->user->trust_score,
                    'last_seen'    => $match->receiveOrder->user->last_seen_human,
                    'avatar_url'   => $match->receiveOrder->user->avatar_url,
                    'is_me'        => $match->receiveOrder->user_id === $myUserId,
                ] : null,
            ];
        }

        if ($detailed) {
            $data['deposit']    = $match->relationLoaded('deposit') && $match->deposit ? [
                'status'              => $match->deposit->status,
                'amount_aud'          => (float) $match->deposit->amount_aud,
                'our_bank_reference'  => $match->deposit->our_bank_reference,
                'proof_uploaded_at'   => $match->deposit->proof_uploaded_at?->toIso8601String(),
                'verified_at'         => $match->deposit->verified_at?->toIso8601String(),
            ] : null;

            $data['delivery']   = $match->relationLoaded('delivery') && $match->delivery ? [
                'status'              => $match->delivery->status,
                'amount_usd'          => (float) $match->delivery->amount_usd,
                'proof_uploaded_at'   => $match->delivery->proof_uploaded_at?->toIso8601String(),
                'confirmed_at'        => $match->delivery->confirmed_at?->toIso8601String(),
            ] : null;

            $data['has_dispute'] = $match->relationLoaded('dispute') && $match->dispute !== null;
        }

        return $data;
    }
}
