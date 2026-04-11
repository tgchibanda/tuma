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
     * Option A: recipient_id_photo + recipient_id_type + handover_amount_photo
     * Option B: combined_verification_photo (one photo showing both)
     * Optional: verification_note
     */
    public function upload(Request $request, string $ulid): JsonResponse
    {
        $match  = $this->findMatchForUser($ulid, $request->user()->id);
        $userId = $request->user()->id;

        if (! $this->canUploadDelivery($match, $userId)) {
            return $this->error(
                "Delivery proof cannot be uploaded when match status is '{$match->status}'.",
                422
            );
        }

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
            'recipient_id_photo'          => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'recipient_id_type'           => ['nullable', 'in:national_id,passport,drivers_licence'],
            'handover_amount_photo'       => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'combined_verification_photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'verification_note'           => ['nullable', 'string', 'max:500'],
        ]);

        $user          = $request->user();
        $idPhoto       = $hasIdPhoto  ? $request->file('recipient_id_photo')   : null;
        $idType        = $request->recipient_id_type ?? 'national_id';
        $handoverPhoto = $hasHandover ? $request->file('handover_amount_photo') : null;
        $combinedPhoto = $hasCombined ? $request->file('combined_verification_photo') : null;
        $note          = $request->verification_note;

        try {
            if ($match->status === SwapMatch::STATUS_AWAITING_DELIVERY) {
                // Secure flow: AUD already in escrow, now delivering cash
                // Installed EscrowService API: uploadSecureDeliveryProof(match, deliverer, idPhoto, idType, handoverPhoto, combinedPhoto, note)
                $this->escrowService->uploadSecureDeliveryProof(
                    $match, $user,
                    $idPhoto, $idType,
                    $handoverPhoto, $combinedPhoto,
                    $note
                );

            } elseif ($match->status === SwapMatch::STATUS_AWAITING_RISK_DELIVERY) {
                // Risk flow: cash delivered before AUD deposit
                // Installed EscrowService API: riskFlow_uploadDeliveryProof(match, deliverer, idPhoto, idType, handoverPhoto, combinedPhoto, note)
                $this->escrowService->riskFlow_uploadDeliveryProof(
                    $match, $user,
                    $idPhoto, $idType,
                    $handoverPhoto, $combinedPhoto,
                    $note
                );

            } else {
                return $this->error(
                    "Delivery proof cannot be uploaded with status '{$match->status}'.",
                    422
                );
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
     * Called by the sender after the deliverer uploads proof.
     * Works for both secure and risk delivery flows.
     * Installed EscrowService: confirmDelivery($match, $sender) handles both statuses.
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

        if ($match->sendOrder->user_id !== $userId) {
            return $this->forbidden('Only the AUD sender can confirm cash receipt.');
        }

        try {
            // Installed EscrowService::confirmDelivery handles both
            // STATUS_AWAITING_CONFIRMATION (secure) and STATUS_AWAITING_RISK_CONFIRMATION (risk)
            $this->escrowService->confirmDelivery($match, $request->user());

        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        $freshMatch = $match->fresh();
        $message    = $freshMatch->status === SwapMatch::STATUS_CONFIRMED
            ? 'Delivery confirmed. Admin will release funds shortly.'
            : 'Delivery confirmed. Please now deposit AUD to complete the transaction.';

        return $this->success(['match_status' => $freshMatch->status], $message);
    }

    /**
     * Log USD denomination breakdown.
     * POST /api/v1/matches/{ulid}/delivery/denominations
     */
    public function denominations(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'denominations'   => ['required', 'array'],
            'denominations.*' => ['integer', 'min:0'],
        ]);

        $match    = $this->findMatchForUser($ulid, $request->user()->id);
        $delivery = $match->delivery;

        if (! $delivery) {
            return $this->notFound('No delivery record found for this match.');
        }

        if ($delivery->deliverer_user_id !== $request->user()->id) {
            return $this->forbidden('Only the cash deliverer can log denominations.');
        }

        $total = collect($request->denominations)->sum(fn($qty, $note) => $qty * $note);
        if (abs($total - (float) $match->agreed_usd) > 0.01) {
            return $this->error(
                "Denomination total (USD {$total}) does not match agreed amount (USD {$match->agreed_usd}).",
                422
            );
        }

        $delivery->update(['usd_denominations' => $request->denominations]);

        return $this->success(null, 'Denomination breakdown saved.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function canUploadDelivery(SwapMatch $match, int $userId): bool
    {
        $statuses = [
            SwapMatch::STATUS_AWAITING_DELIVERY,
            SwapMatch::STATUS_AWAITING_RISK_DELIVERY,
        ];
        if (! in_array($match->status, $statuses)) return false;
        // Deliverer is the receive_order owner
        return $match->receiveOrder->user_id === $userId;
    }

    private function canConfirmDelivery(SwapMatch $match, int $userId): bool
    {
        $statuses = [
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION,
        ];
        return in_array($match->status, $statuses)
            && $match->sendOrder->user_id === $userId;
    }

    private function getDeliveryInstruction(SwapMatch $match): string
    {
        return match ($match->status) {
            SwapMatch::STATUS_AWAITING_DELIVERY =>
                'AUD is secured in escrow. Please deliver USD $' . $match->agreed_usd .
                ' cash to the recipient and upload verification photos.',
            SwapMatch::STATUS_AWAITING_RISK_DELIVERY =>
                'Risk Delivery: Please deliver USD $' . $match->agreed_usd .
                ' cash first. The sender will deposit AUD after confirming receipt.',
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

        // Inline check — avoids calling model method with wrong type
        if ($match->sendOrder?->user_id !== $userId && $match->receiveOrder?->user_id !== $userId) {
            abort(403, 'Access denied.');
        }

        return $match;
    }
}
