<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Services\AuditService;
use App\Services\EscrowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMatchController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EscrowService $escrowService,
        protected AuditService $auditService
    ) {}

    /**
     * List all matches with filters.
     * GET /api/v1/admin/matches
     */
    public function index(Request $request): JsonResponse
    {
        $query = SwapMatch::with([
            'sendOrder.user',
            'receiveOrder.user',
            'sendOrder.deliveryLocation',
        ])->orderByDesc('updated_at');

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('date_from')) $query->where('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->where('created_at', '<=', $request->date_to . ' 23:59:59');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('ulid', 'like', "%{$s}%");
        }

        $matches = $query->paginate(20);

        return $this->paginated($matches, 'Matches retrieved.', $matches->getCollection()->map(
            fn($m) => $this->formatMatchSummary($m)
        ));
    }

    /**
     * Get full match detail.
     * GET /api/v1/admin/matches/{ulid}
     */
    public function show(string $ulid): JsonResponse
    {
        $match = SwapMatch::where('ulid', $ulid)->with([
            'sendOrder.user', 'sendOrder.deliveryLocation', 'sendOrder.bankAccount',
            'receiveOrder.user', 'receiveOrder.bankAccount',
            'deposit',
            'delivery.deliveryLocation',
            'dispute.messages.sender',
            'negotiations.proposedBy',
            'exchangeRate',
            'verifiedBy',
            'releasedBy',
        ])->firstOrFail();

        return $this->success($this->formatMatchDetail($match), 'Match retrieved.');
    }

    /**
     * Admin verifies AUD deposit has arrived.
     * PUT /api/v1/admin/matches/{ulid}/verify-deposit
     */
    public function verifyDeposit(Request $request, string $ulid): JsonResponse
    {
        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder', 'deposit'])
            ->firstOrFail();

        try {
            // Route to correct flow
            if ($match->status === SwapMatch::STATUS_DEPOSIT_UPLOADED) {
                $this->escrowService->secureFlow_verifyDeposit($match, $request->user());
            } elseif ($match->status === SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED) {
                $this->escrowService->riskFlow_verifyDeposit($match, $request->user());
            } else {
                return $this->error(
                    "Cannot verify deposit when match status is '{$match->status}'.",
                    422
                );
            }
        } catch (\App\Exceptions\TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success(
            $this->formatMatchSummary($match->fresh()->load(['sendOrder.user', 'receiveOrder.user', 'sendOrder.deliveryLocation'])),
            'Deposit verified. Deliverer has been notified.'
        );
    }

    /**
     * Admin releases AUD funds to receiver.
     * PUT /api/v1/admin/matches/{ulid}/release-funds
     */
    public function releaseFunds(Request $request, string $ulid): JsonResponse
    {
        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder.user', 'receiveOrder.user', 'deposit', 'delivery'])
            ->firstOrFail();

        try {
            $this->escrowService->releaseFunds($match, $request->user());
        } catch (\App\Exceptions\TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success(
            $this->formatMatchSummary($match->fresh()->load(['sendOrder.user', 'receiveOrder.user', 'sendOrder.deliveryLocation'])),
            'Funds released. Transaction completed.'
        );
    }

    /**
     * Admin refunds AUD to sender.
     * PUT /api/v1/admin/matches/{ulid}/refund
     */
    public function refund(Request $request, string $ulid): JsonResponse
    {
        $request->validate(['reason' => ['required', 'string', 'min:10', 'max:500']]);

        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder.user', 'receiveOrder.user', 'deposit'])
            ->firstOrFail();

        try {
            $this->escrowService->refundDeposit($match, $request->user(), $request->reason);
        } catch (\App\Exceptions\TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success(null, 'Deposit refunded. Orders returned to open.');
    }

    /**
     * Admin force-cancels a match at any stage.
     * PUT /api/v1/admin/matches/{ulid}/force-cancel
     */
    public function forceCancel(Request $request, string $ulid): JsonResponse
    {
        $request->validate(['reason' => ['required', 'string', 'min:10', 'max:500']]);

        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->firstOrFail();

        if (in_array($match->status, [SwapMatch::STATUS_COMPLETED, SwapMatch::STATUS_REFUNDED])) {
            return $this->error('Cannot cancel a completed or refunded match.', 422);
        }

        $match->update([
            'status'     => SwapMatch::STATUS_CANCELLED,
            'admin_notes'=> $request->reason,
        ]);

        $match->sendOrder->update(['status' => 'open']);
        $match->receiveOrder->update(['status' => 'open']);

        // Notify both parties
        foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
            app(\App\Services\NotificationService::class)->notify(
                $party,
                new \App\Notifications\MatchCancelledNotification($match, $request->user()),
                ['email', 'inapp']
            );
        }

        $this->auditService->log('match.force_cancelled', $request->user(), $match, [], ['reason' => $request->reason]);

        return $this->success(null, 'Match force-cancelled. Orders returned to open.');
    }

    // ── Private formatters ─────────────────────────────────────────────────────

    private function formatMatchSummary(SwapMatch $match): array
    {
        return [
            'id'                 => $match->id,
            'ulid'               => $match->ulid,
            'status'             => $match->status,
            'delivery_method'    => $match->delivery_method,
            'agreed_aud'         => $match->agreed_aud ? (float) $match->agreed_aud : null,
            'agreed_usd'         => $match->agreed_usd ? (float) $match->agreed_usd : null,
            'platform_fee_aud'   => $match->platform_fee_aud ? (float) $match->platform_fee_aud : null,
            'deposit_reference'  => $match->getDepositReference(),
            'created_at'         => $match->created_at->toIso8601String(),
            'updated_at'         => $match->updated_at->toIso8601String(),
            'completed_at'       => $match->completed_at?->toIso8601String(),
            'sender'             => $match->sendOrder ? [
                'id'    => $match->sendOrder->user->id,
                'name'  => $match->sendOrder->user->first_name . ' ' . $match->sendOrder->user->last_name,
                'email' => $match->sendOrder->user->email,
            ] : null,
            'receiver'           => $match->receiveOrder ? [
                'id'    => $match->receiveOrder->user->id,
                'name'  => $match->receiveOrder->user->first_name . ' ' . $match->receiveOrder->user->last_name,
                'email' => $match->receiveOrder->user->email,
            ] : null,
            'location'           => $match->sendOrder?->deliveryLocation ? [
                'name'     => $match->sendOrder->deliveryLocation->name,
                'province' => $match->sendOrder->deliveryLocation->province,
            ] : null,
        ];
    }

    private function formatMatchDetail(SwapMatch $match): array
    {
        $base = $this->formatMatchSummary($match);

        return array_merge($base, [
            'admin_notes'       => $match->admin_notes,
            'negotiation_rounds'=> $match->negotiation_rounds,
            'agreed_at'         => $match->agreed_at?->toIso8601String(),
            'risk_payout_method'=> $match->risk_payout_method,
            'deposit'           => $match->deposit ? [
                'id'                  => $match->deposit->id,
                'status'              => $match->deposit->status,
                'amount_aud'          => (float) $match->deposit->amount_aud,
                'our_bank_reference'  => $match->deposit->our_bank_reference,
                'depositor_reference' => $match->deposit->depositor_reference,
                'proof_url'           => $match->deposit->proof_file
                    ? route('admin.deposit.proof', ['id' => $match->deposit->id])
                    : null,
                'proof_uploaded_at'   => $match->deposit->proof_uploaded_at?->toIso8601String(),
                'verified_at'         => $match->deposit->verified_at?->toIso8601String(),
            ] : null,
            'delivery'          => $match->delivery ? [
                'id'                          => $match->delivery->id,
                'status'                      => $match->delivery->status,
                'amount_usd'                  => (float) $match->delivery->amount_usd,
                'recipient_name'              => $match->delivery->recipient_name,
                'recipient_phone'             => $match->delivery->recipient_phone,
                'delivery_address'            => $match->delivery->delivery_address,
                'recipient_id_photo_url'      => $match->delivery->recipient_id_photo
                    ? route('admin.delivery.proof', ['id' => $match->delivery->id, 'type' => 'id'])
                    : null,
                'handover_amount_photo_url'   => $match->delivery->handover_amount_photo
                    ? route('admin.delivery.proof', ['id' => $match->delivery->id, 'type' => 'handover'])
                    : null,
                'combined_photo_url'          => $match->delivery->combined_verification_photo
                    ? route('admin.delivery.proof', ['id' => $match->delivery->id, 'type' => 'combined'])
                    : null,
                'proof_uploaded_at'           => $match->delivery->proof_uploaded_at?->toIso8601String(),
                'confirmed_at'                => $match->delivery->confirmed_at?->toIso8601String(),
                'usd_denominations'           => $match->delivery->usd_denominations,
                'location'                    => $match->delivery->deliveryLocation ? [
                    'name'     => $match->delivery->deliveryLocation->name,
                    'province' => $match->delivery->deliveryLocation->province,
                ] : null,
            ] : null,
            'dispute'           => $match->dispute ? [
                'id'              => $match->dispute->id,
                'status'          => $match->dispute->status,
                'reason'          => $match->dispute->reason,
                'hours_open'      => $match->dispute->hours_open,
                'message_count'   => $match->dispute->messages->count(),
            ] : null,
            'negotiations'      => $match->negotiations->map(fn($n) => [
                'proposed_by'  => $n->proposedBy->first_name . ' ' . $n->proposedBy->last_name,
                'proposed_aud' => (float) $n->proposed_aud,
                'proposed_usd' => (float) $n->proposed_usd,
                'message'      => $n->message,
                'status'       => $n->status,
                'created_at'   => $n->created_at->toIso8601String(),
            ]),
            'available_actions' => $this->getAvailableActions($match),
        ]);
    }

    private function getAvailableActions(SwapMatch $match): array
    {
        return [
            'can_verify_deposit' => in_array($match->status, [
                SwapMatch::STATUS_DEPOSIT_UPLOADED,
                SwapMatch::STATUS_RISK_DEPOSIT_UPLOADED,
            ]),
            'can_release_funds' => in_array($match->status, [
                SwapMatch::STATUS_CONFIRMED,
                SwapMatch::STATUS_RISK_DEPOSIT_VERIFIED,
            ]),
            'can_refund'        => $match->deposit &&
                in_array($match->deposit->status, ['verified', 'pending']) &&
                ! in_array($match->status, ['completed', 'refunded']),
            'can_force_cancel'  => ! in_array($match->status, ['completed', 'refunded', 'cancelled']),
        ];
    }
}
