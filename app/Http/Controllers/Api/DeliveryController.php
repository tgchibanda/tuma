<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\TumaException;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\CashDelivery;
use App\Models\SwapMatch;
use App\Services\EscrowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    use ApiResponse;

    public function __construct(protected EscrowService $escrowService) {}

    /**
     * Get delivery status and details for a match.
     * GET /api/v1/matches/{ulid}/delivery
     */
    public function show(Request $request, string $ulid): JsonResponse
    {
        $match    = $this->findMatchForUser($ulid, $request->user()->id);
        $delivery = $match->delivery;

        return $this->success([
            'match_status'         => $match->status,
            'delivery_method'      => $match->delivery_method,
            'agreed_usd'           => (float) $match->agreed_usd,
            'delivery_instruction' => $this->getDeliveryInstruction($match),
            'delivery'             => $delivery ? [
                'status'                       => $delivery->status,
                'amount_usd'                   => (float) $delivery->amount_usd,
                'recipient_name'               => $delivery->recipient_name,
                'recipient_phone'              => $delivery->recipient_phone,
                'delivery_address'             => $delivery->delivery_address,
                'delivery_location'            => $delivery->deliveryLocation ? [
                    'id'       => $delivery->deliveryLocation->id,
                    'name'     => $delivery->deliveryLocation->name,
                    'province' => $delivery->deliveryLocation->province,
                ] : null,
                'has_id_photo'                 => (bool) $delivery->recipient_id_photo,
                'has_handover_photo'           => (bool) $delivery->handover_amount_photo,
                'has_combined_photo'           => (bool) $delivery->combined_verification_photo,
                'proof_uploaded_at'            => $delivery->proof_uploaded_at?->toIso8601String(),
                'confirmed_at'                 => $delivery->confirmed_at?->toIso8601String(),
                'estimated_delivery'           => $delivery->estimated_delivery_at?->toIso8601String(),
                'usd_denominations'            => $delivery->usd_denominations,
                'notes'                        => $delivery->notes,
            ] : null,
            'can_upload'           => $this->canUploadDelivery($match, $request->user()->id),
            'can_confirm'          => $this->canConfirmDelivery($match, $request->user()->id),
        ], 'Delivery details retrieved.');
    }

    /**
     * Upload delivery verification photos.
     * POST /api/v1/matches/{ulid}/delivery/upload
     *
     * Requires either:
     *   Option A: recipient_id_photo + recipient_id_type + handover_amount_photo
     *   Option B: combined_verification_photo
     *
     * Optional: verification_note
     */
    public function upload(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        // Validate who can upload
        if (! $this->canUploadDelivery($match, $userId)) {
            return $this->error(
                "Delivery proof cannot be uploaded when match status is '{$match->status}'.",
                422
            );
        }

        // Validate at least one complete verification set
        $hasCombined = $request->hasFile('combined_verification_photo');
        $hasIdPhoto  = $request->hasFile('recipient_id_photo');
        $hasHandover = $request->hasFile('handover_amount_photo');

        if (! $hasCombined && ! ($hasIdPhoto && $hasHandover)) {
            return $this->error(
                'Please provide either: (1) both recipient ID photo and cash handover photo, ' .
                'or (2) a single combined verification photo.',
                422
            );
        }

        $request->validate([
            'recipient_id_photo'           => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'recipient_id_type'            => ['required_with:recipient_id_photo', 'nullable', 'in:national_id,passport,drivers_licence'],
            'handover_amount_photo'        => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'combined_verification_photo'  => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'verification_note'            => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $proofData = ['verification_note' => $request->verification_note];

            if ($hasCombined) {
                $proofData['combined_verification_photo'] = $this->escrowService->storeProofFile(
                    $request->file('combined_verification_photo'),
                    'deliveries'
                );
            } else {
                $proofData['recipient_id_photo'] = $this->escrowService->storeProofFile(
                    $request->file('recipient_id_photo'),
                    'deliveries'
                );
                $proofData['recipient_id_type']  = $request->recipient_id_type;
                $proofData['handover_amount_photo'] = $this->escrowService->storeProofFile(
                    $request->file('handover_amount_photo'),
                    'deliveries'
                );
            }

            // Route to correct flow
            if (in_array($match->status, [SwapMatch::STATUS_AWAITING_DELIVERY])) {
                $this->escrowService->secureFlow_deliveryUploaded($match, $proofData);
            } else {
                $this->escrowService->riskFlow_deliveryUploaded($match, $proofData);
            }
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success([
            'match_status' => $match->fresh()->status,
        ], 'Delivery proof uploaded. The sender has been notified to confirm receipt.');
    }

    /**
     * Confirm cash was received in Zimbabwe.
     * POST /api/v1/matches/{ulid}/delivery/confirm
     *
     * Called by: sender (secure flow) or sender (risk flow, before depositing)
     */
    public function confirm(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        if (! $this->canConfirmDelivery($match, $userId)) {
            return $this->error(
                "Cannot confirm delivery when match status is '{$match->status}'.",
                422
            );
        }

        // Only the sender (order owner) can confirm
        if ($match->sendOrder->user_id !== $userId) {
            return $this->forbidden('Only the order owner can confirm cash receipt.');
        }

        try {
            if ($match->status === SwapMatch::STATUS_AWAITING_CONFIRMATION) {
                $this->escrowService->confirmDelivery($match, $request->user());
            } elseif ($match->status === SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION) {
                $this->escrowService->riskFlow_confirmDelivery($match, $request->user());
            } else {
                return $this->error("Cannot confirm delivery with status '{$match->status}'.", 422);
            }
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        $freshMatch = $match->fresh();
        $message = $freshMatch->status === SwapMatch::STATUS_CONFIRMED
            ? 'Delivery confirmed. Admin will release funds shortly.'
            : 'Delivery confirmed. Please now deposit AUD to complete the transaction.';

        return $this->success(['match_status' => $freshMatch->status], $message);
    }

    /**
     * Log USD denomination breakdown (optional, for large amounts).
     * POST /api/v1/matches/{ulid}/delivery/denominations
     */
    public function denominations(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'denominations' => ['required', 'array'],
            'denominations.*' => ['integer', 'min:0'],
        ]);

        $match = $this->findMatchForUser($ulid, $request->user()->id);

        $delivery = $match->delivery;
        if (! $delivery) {
            return $this->notFound('No delivery record found for this match.');
        }

        // Only deliverer can log denominations
        if ($delivery->deliverer_user_id !== $request->user()->id) {
            return $this->forbidden('Only the cash deliverer can log denominations.');
        }

        // Validate total matches agreed USD amount
        $total = collect($request->denominations)->sum(fn($qty, $note) => $qty * $note);
        if (abs($total - (float) $match->agreed_usd) > 0.01) {
            return $this->error(
                "Denomination total (USD \${$total}) does not match agreed amount (USD \${$match->agreed_usd}).",
                422
            );
        }

        $delivery->update(['usd_denominations' => $request->denominations]);

        return $this->success(null, 'Denomination breakdown saved.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function canUploadDelivery(SwapMatch $match, int $userId): bool
    {
        $deliverStatuses = [
            SwapMatch::STATUS_AWAITING_DELIVERY,
            SwapMatch::STATUS_AWAITING_RISK_DELIVERY,
        ];
        if (! in_array($match->status, $deliverStatuses)) return false;

        // Deliverer is the receive_order owner
        return $match->receiveOrder->user_id === $userId;
    }

    private function canConfirmDelivery(SwapMatch $match, int $userId): bool
    {
        $confirmStatuses = [
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION,
        ];
        return in_array($match->status, $confirmStatuses)
            && $match->sendOrder->user_id === $userId;
    }

    private function getDeliveryInstruction(SwapMatch $match): string
    {
        return match ($match->status) {
            SwapMatch::STATUS_AWAITING_DELIVERY =>
                'AUD is secured in escrow. Please deliver USD $' . $match->agreed_usd .
                ' cash to the recipient and upload verification photos.',
            SwapMatch::STATUS_AWAITING_RISK_DELIVERY =>
                '⚠ Risk Delivery: Please deliver USD $' . $match->agreed_usd .
                ' cash first. The sender will deposit AUD after you confirm delivery.',
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION =>
                'Cash has been delivered. Please confirm the recipient received the money.',
            default => '',
        };
    }

    private function findMatchForUser(string $ulid, int $userId): SwapMatch
    {
        $match = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder', 'delivery.deliveryLocation', 'deposit'])
            ->first();
        if (! $match) abort(404, 'Match not found.');
        if (! $match->involvesUser((object) ['id' => $userId])) abort(403, 'Access denied.');
        return $match;
    }
}
