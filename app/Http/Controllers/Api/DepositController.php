<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\TumaException;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\SystemSetting;
use App\Services\EscrowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    use ApiResponse;

    public function __construct(protected EscrowService $escrowService) {}

    /**
     * Get deposit status and bank details for a match.
     * GET /api/v1/matches/{ulid}/deposit
     */
    public function show(Request $request, string $ulid): JsonResponse
    {
        $match = $this->findMatchForUser($ulid, $request->user()->id);

        $deposit = $match->deposit;
        $bankName    = SystemSetting::get('tuma_bank_name', 'National Australia Bank');
        $accountName = SystemSetting::get('tuma_account_name', 'TuMa Pty Ltd Trust Account');
        $bsb         = SystemSetting::get('tuma_bsb', '000-000');
        $accountNum  = SystemSetting::get('tuma_account_number', '000000000');

        return $this->success([
            'match_status'      => $match->status,
            'deposit_reference' => $match->getDepositReference(),
            'amount_aud'        => (float) $match->agreed_aud,
            'bank_details'      => [
                'bank_name'      => $bankName,
                'account_name'   => $accountName,
                'bsb'            => $bsb,
                'account_number' => $accountNum,
            ],
            'deposit'           => $deposit ? [
                'status'              => $deposit->status,
                'amount_aud'          => (float) $deposit->amount_aud,
                'our_bank_reference'  => $deposit->our_bank_reference,
                'depositor_reference' => $deposit->depositor_reference,
                'proof_uploaded_at'   => $deposit->proof_uploaded_at?->toIso8601String(),
                'verified_at'         => $deposit->verified_at?->toIso8601String(),
                'released_at'         => $deposit->released_at?->toIso8601String(),
            ] : null,
            'can_upload'        => in_array($match->status, [
                SwapMatch::STATUS_AWAITING_DEPOSIT,
                SwapMatch::STATUS_AWAITING_RISK_DEPOSIT,
            ]),
        ], 'Deposit details retrieved.');
    }

    /**
     * Upload deposit proof screenshot.
     * POST /api/v1/matches/{ulid}/deposit/upload
     *
     * Multipart fields:
     *   - proof_file: jpg/jpeg/png/pdf, max 5MB
     *   - depositor_reference: the reference the user used on their bank transfer
     */
    public function upload(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'proof_file'           => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'depositor_reference'  => ['required', 'string', 'max:100'],
        ]);

        $match = $this->findMatchForUser($ulid, $request->user()->id);

        // Only the sender (AUD depositor) can upload
        if ($match->sendOrder->user_id !== $request->user()->id) {
            return $this->forbidden('Only the AUD sender can upload deposit proof.');
        }

        // Validate status allows upload
        $allowedStatuses = [
            SwapMatch::STATUS_AWAITING_DEPOSIT,
            SwapMatch::STATUS_AWAITING_RISK_DEPOSIT,
        ];
        if (! in_array($match->status, $allowedStatuses)) {
            return $this->error(
                "Deposit proof cannot be uploaded when match status is '{$match->status}'.",
                422
            );
        }

        try {
            $proofPath = $this->escrowService->storeProofFile(
                $request->file('proof_file'),
                'deposits'
            );

            if ($match->status === SwapMatch::STATUS_AWAITING_DEPOSIT) {
                $this->escrowService->secureFlow_depositUploaded(
                    $match,
                    $proofPath,
                    $request->depositor_reference
                );
            } else {
                $this->escrowService->riskFlow_depositUploaded(
                    $match,
                    $proofPath,
                    $request->depositor_reference
                );
            }
        } catch (TumaException $e) {
            return $this->error($e->getMessage(), $e->getStatusCode());
        }

        return $this->success([
            'match_status' => $match->fresh()->status,
        ], 'Deposit proof uploaded. Our team will verify it shortly.');
    }

    private function findMatchForUser(string $ulid, int $userId): SwapMatch
    {
        $match = SwapMatch::where('ulid', $ulid)->with(['sendOrder', 'receiveOrder', 'deposit'])->first();
        if (! $match) abort(404, 'Match not found.');
        if (! $match->involvesUser((object) ['id' => $userId])) abort(403, 'Access denied.');
        return $match;
    }
}
