<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PinController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * Set up a new transaction PIN.
     * POST /api/v1/auth/pin/setup
     *
     * Requires the user's current account password as confirmation.
     */
    public function setup(Request $request): JsonResponse
    {
        $request->validate([
            'pin'              => ['required', 'string', 'digits:4', 'confirmed'],
            'pin_confirmation' => ['required'],
            'password'         => ['required', 'string'],
        ]);

        $user = $request->user();

        // Confirm account password before setting PIN
        if (! Hash::check($request->password, $user->password)) {
            return $this->error('Incorrect account password.', 400);
        }

        if ($user->transaction_pin) {
            return $this->error(
                'A transaction PIN is already set. Use the change PIN endpoint to update it.',
                400
            );
        }

        // Validate PIN is not too simple (not all same digit, not sequential)
        if ($this->isTooSimplePin($request->pin)) {
            return $this->error(
                'PIN is too simple. Avoid patterns like 1234, 0000, or 1111.',
                400
            );
        }

        $user->transaction_pin = Hash::make($request->pin);
        $user->pin_set_at      = now();
        $user->save();

        $this->auditService->log('user.pin_set', $user, $user);

        return $this->success(null, 'Transaction PIN set successfully.');
    }

    /**
     * Change an existing transaction PIN.
     * POST /api/v1/auth/pin/change
     */
    public function change(Request $request): JsonResponse
    {
        $request->validate([
            'current_pin'      => ['required', 'string', 'digits:4'],
            'pin'              => ['required', 'string', 'digits:4', 'confirmed'],
            'pin_confirmation' => ['required'],
        ]);

        $user = $request->user();

        if (! $user->transaction_pin) {
            return $this->error('No transaction PIN is set. Please set one first.', 400);
        }

        if (! Hash::check($request->current_pin, $user->transaction_pin)) {
            return $this->error('Current PIN is incorrect.', 400);
        }

        if ($this->isTooSimplePin($request->pin)) {
            return $this->error(
                'New PIN is too simple. Avoid patterns like 1234, 0000, or 1111.',
                400
            );
        }

        $user->transaction_pin = Hash::make($request->pin);
        $user->pin_set_at      = now();
        $user->save();

        $this->auditService->log('user.pin_changed', $user, $user);

        return $this->success(null, 'Transaction PIN changed successfully.');
    }

    /**
     * Verify a transaction PIN (used before financial actions).
     * POST /api/v1/auth/pin/verify
     *
     * Returns a short-lived cache token the client passes along
     * with the actual financial action to prove PIN was entered.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'pin' => ['required', 'string', 'digits:4'],
        ]);

        $user = $request->user();

        if (! $user->transaction_pin) {
            return $this->error(
                'No transaction PIN is set on your account. Please set one in Settings.',
                400
            );
        }

        if (! Hash::check($request->pin, $user->transaction_pin)) {
            $this->auditService->log('user.pin_failed', $user, $user);
            return $this->error('Incorrect PIN.', 400);
        }

        // Issue a short-lived PIN verification token (5 minutes)
        $verifyToken = \Illuminate\Support\Str::random(32);
        \Illuminate\Support\Facades\Cache::put(
            'pin_verified_' . $user->id . '_' . $verifyToken,
            true,
            now()->addMinutes(5)
        );

        return $this->success([
            'pin_token'  => $verifyToken,
            'expires_at' => now()->addMinutes(5)->toIso8601String(),
        ], 'PIN verified.');
    }

    /**
     * Detect overly simple PINs.
     */
    private function isTooSimplePin(string $pin): bool
    {
        // All same digits: 0000, 1111, etc.
        if (preg_match('/^(\d)\1{3}$/', $pin)) {
            return true;
        }

        // Sequential: 1234, 2345, 3456, 7890
        $sequential = ['1234', '2345', '3456', '4567', '5678', '6789', '7890', '0123'];
        if (in_array($pin, $sequential, true)) {
            return true;
        }

        // Reverse sequential: 4321, 9876
        $reverseSeq = ['4321', '9876', '8765', '7654', '6543', '5432', '3210'];
        if (in_array($pin, $reverseSeq, true)) {
            return true;
        }

        return false;
    }
}
