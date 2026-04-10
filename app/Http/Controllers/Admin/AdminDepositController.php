<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\PlatformDeposit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminDepositController extends Controller
{
    use ApiResponse;

    /**
     * List pending deposit verifications, oldest first.
     * GET /api/admin/deposits
     */
    public function index(Request $request): JsonResponse
    {
        $query = PlatformDeposit::with(['swapMatch.sendOrder.user', 'swapMatch.sendOrder.deliveryLocation'])
            ->orderBy('proof_uploaded_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'pending'); // Default: pending queue
        }

        $deposits = $query->paginate(20);

        return $this->paginated($deposits, 'Deposits retrieved.', $deposits->getCollection()->map(fn($d) => [
            'id'                  => $d->id,
            'status'              => $d->status,
            'amount_aud'          => (float) $d->amount_aud,
            'our_bank_reference'  => $d->our_bank_reference,
            'depositor_reference' => $d->depositor_reference,
            'proof_uploaded_at'   => $d->proof_uploaded_at?->toIso8601String(),
            'hours_waiting'       => $d->proof_uploaded_at
                ? round($d->proof_uploaded_at->diffInHours(now()))
                : null,
            'verified_at'         => $d->verified_at?->toIso8601String(),
            'match_ulid'          => $d->swapMatch?->ulid,
            'match_status'        => $d->swapMatch?->status,
            'depositor'           => $d->swapMatch?->sendOrder?->user ? [
                'id'    => $d->swapMatch->sendOrder->user->id,
                'name'  => $d->swapMatch->sendOrder->user->first_name . ' ' . $d->swapMatch->sendOrder->user->last_name,
                'email' => $d->swapMatch->sendOrder->user->email,
            ] : null,
            'has_proof'           => (bool) $d->proof_file,
            'proof_url'           => $d->proof_file
                ? route('admin.deposit.proof', ['id' => $d->id])
                : null,
        ]));
    }

    /**
     * Get single deposit detail with proof image URL.
     * GET /api/admin/deposits/{id}
     */
    public function show(int $id): JsonResponse
    {
        $deposit = PlatformDeposit::with([
            'swapMatch.sendOrder.user',
            'swapMatch.receiveOrder.user',
            'swapMatch.sendOrder.deliveryLocation',
            'verifiedBy',
        ])->findOrFail($id);

        return $this->success([
            'id'                  => $deposit->id,
            'status'              => $deposit->status,
            'amount_aud'          => (float) $deposit->amount_aud,
            'our_bank_reference'  => $deposit->our_bank_reference,
            'depositor_reference' => $deposit->depositor_reference,
            'proof_uploaded_at'   => $deposit->proof_uploaded_at?->toIso8601String(),
            'verified_at'         => $deposit->verified_at?->toIso8601String(),
            'released_at'         => $deposit->released_at?->toIso8601String(),
            'refunded_at'         => $deposit->refunded_at?->toIso8601String(),
            'admin_notes'         => $deposit->admin_notes,
            'proof_url'           => $deposit->proof_file
                ? route('admin.deposit.proof', ['id' => $deposit->id])
                : null,
            'match'               => $deposit->swapMatch ? [
                'ulid'          => $deposit->swapMatch->ulid,
                'status'        => $deposit->swapMatch->status,
                'agreed_aud'    => (float) $deposit->swapMatch->agreed_aud,
                'agreed_usd'    => (float) $deposit->swapMatch->agreed_usd,
                'delivery_method'=> $deposit->swapMatch->delivery_method,
            ] : null,
            'depositor'           => $deposit->swapMatch?->sendOrder?->user ? [
                'id'    => $deposit->swapMatch->sendOrder->user->id,
                'name'  => $deposit->swapMatch->sendOrder->user->first_name . ' ' . $deposit->swapMatch->sendOrder->user->last_name,
                'email' => $deposit->swapMatch->sendOrder->user->email,
            ] : null,
            'verified_by'         => $deposit->verifiedBy ? [
                'name' => $deposit->verifiedBy->first_name . ' ' . $deposit->verifiedBy->last_name,
            ] : null,
        ], 'Deposit retrieved.');
    }
}
