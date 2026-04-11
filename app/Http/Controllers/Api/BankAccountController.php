<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\BankAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    use ApiResponse;

    /**
     * List the user's bank accounts.
     * GET /api/v1/bank-accounts
     */
    public function index(Request $request): JsonResponse
    {
        $accounts = BankAccount::where('user_id', $request->user()->id)
            ->with('country')
            ->orderByDesc('is_primary')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => $this->format($a));

        return $this->success($accounts, 'Bank accounts retrieved.');
    }

    /**
     * Add a new bank account.
     * POST /api/v1/bank-accounts
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'bank_name'      => ['required', 'string', 'max:150'],
            'account_name'   => ['required', 'string', 'max:150'],
            'account_number' => ['required', 'string', 'max:50'],
            'bsb_code'       => ['nullable', 'string', 'max:20'],
            'country_id'     => ['required', 'integer', 'exists:countries,id'],
        ]);

        $user  = $request->user();
        $count = BankAccount::where('user_id', $user->id)->count();

        if ($count >= 5) {
            return $this->error('You can have a maximum of 5 bank accounts.', 422);
        }

        $account = BankAccount::create([
            'user_id'        => $user->id,
            'bank_name'      => $request->bank_name,
            'account_name'   => $request->account_name,
            'account_number' => $request->account_number,
            'bsb_code'       => $request->bsb_code,
            'country_id'     => $request->country_id,
            'is_primary'     => $count === 0 ? 1 : 0,
        ]);

        return $this->created($this->format($account), 'Bank account added.');
    }

    /**
     * Update a bank account.
     * PUT /api/v1/bank-accounts/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $account = BankAccount::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'bank_name'    => ['sometimes', 'string', 'max:150'],
            'account_name' => ['sometimes', 'string', 'max:150'],
            'bsb_code'     => ['nullable', 'string', 'max:20'],
        ]);

        $account->update($request->only(['bank_name', 'account_name', 'bsb_code']));

        return $this->success($this->format($account), 'Bank account updated.');
    }

    /**
     * Set a bank account as primary.
     * PUT /api/v1/bank-accounts/{id}/set-primary
     */
    public function setPrimary(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        BankAccount::where('user_id', $user->id)->update(['is_primary' => 0]);

        $account = BankAccount::where('user_id', $user->id)->findOrFail($id);
        $account->update(['is_primary' => 1]);

        return $this->success($this->format($account), 'Primary account updated.');
    }

    /**
     * Delete a bank account.
     * DELETE /api/v1/bank-accounts/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $account = BankAccount::where('user_id', $request->user()->id)->findOrFail($id);

        // Don't delete if it's referenced by any pending/active orders
        $inUse = \App\Models\SwapOrder::where('aud_bank_account_id', $id)
            ->whereIn('status', ['open','negotiating','agreed','in_escrow','delivering'])
            ->exists();

        if ($inUse) {
            return $this->error('This account is linked to an active order and cannot be deleted.', 422);
        }

        $account->delete();

        // If deleted primary, promote next account
        if ($account->is_primary) {
            $next = BankAccount::where('user_id', $request->user()->id)->first();
            $next?->update(['is_primary' => 1]);
        }

        return $this->success(null, 'Bank account deleted.');
    }

    private function format(BankAccount $a): array
    {
        return [
            'id'             => $a->id,
            'bank_name'      => $a->bank_name,
            'account_name'   => $a->account_name,
            'account_number' => '····' . substr($a->account_number, -4),
            'bsb_code'       => $a->bsb_code,
            'is_primary'     => (bool) $a->is_primary,
            'is_verified'    => (bool) $a->is_verified,
            'country'        => $a->country?->name,
            'created_at'     => $a->created_at->toIso8601String(),
        ];
    }
}
