<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TwoFactorController extends Controller
{
    use ApiResponse;

    /**
     * Generate a 2FA secret + QR code.
     * POST /api/v1/auth/2fa/setup
     */
    public function setup(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->two_fa_enabled) {
            return $this->error('2FA is already enabled.', 422);
        }

        // Generate a random base32 secret (simplified; use a real TOTP library in production)
        $secret = strtoupper(\Illuminate\Support\Str::random(32));

        $user->two_fa_secret = $secret;
        $user->save();

        $issuer    = urlencode('eZimConnect');
        $account   = urlencode($user->email);
        $qrContent = "otpauth://totp/{$issuer}:{$account}?secret={$secret}&issuer={$issuer}";

        return $this->success([
            'secret'    => $secret,
            'qr_url'    => 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=' . urlencode($qrContent),
            'qr_code_svg' => null, // Add: composer require endroid/qr-code for SVG generation
        ], '2FA setup initiated. Scan the QR code with your authenticator app.');
    }

    /**
     * Confirm the 2FA setup with the first TOTP code.
     * POST /api/v1/auth/2fa/confirm
     */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string', 'size:6']]);

        $user = $request->user();

        // Verify the code (simplified; use a real TOTP library in production)
        // TODO: composer require pragmarx/google2fa
        // $valid = app(\PragmaRX\Google2FA\Google2FA::class)->verifyKey($user->two_fa_secret, $request->code);

        // Placeholder: accept any 6-digit code during development
        if (strlen($request->code) !== 6 || ! ctype_digit($request->code)) {
            return $this->error('Invalid verification code.', 422);
        }

        $user->two_fa_enabled = true;
        $user->save();

        return $this->success(null, 'Two-factor authentication enabled successfully.');
    }

    /**
     * Disable 2FA.
     * POST /api/v1/auth/2fa/disable
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string', 'size:6']]);

        $user = $request->user();

        if (! $user->two_fa_enabled) {
            return $this->error('2FA is not currently enabled.', 422);
        }

        // TODO: verify code against TOTP secret
        $user->two_fa_enabled = false;
        $user->two_fa_secret  = null;
        $user->save();

        return $this->success(null, '2FA disabled.');
    }

    /**
     * Verify a 2FA code during login (called with temp_token).
     * POST /api/v1/auth/2fa/verify
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'temp_token' => ['required', 'string'],
            'code'       => ['required', 'string', 'size:6'],
        ]);

        $userId = cache()->get('2fa_temp_' . $request->temp_token);

        if (! $userId) {
            return $this->error('Session expired. Please log in again.', 401);
        }

        $user = \App\Models\User::findOrFail($userId);

        // TODO: verify TOTP code
        if (strlen($request->code) !== 6 || ! ctype_digit($request->code)) {
            return $this->error('Invalid 2FA code.', 422);
        }

        cache()->forget('2fa_temp_' . $request->temp_token);

        $user->last_login_at = now();
        $user->save();

        $token = $user->createToken('auth')->plainTextToken;

        return $this->success([
            'token' => $token,
            'user'  => [
                'id'         => $user->id,
                'ulid'       => $user->ulid,
                'first_name' => $user->first_name,
                'email'      => $user->email,
                'role'       => $user->role,
            ],
        ], 'Logged in with 2FA.');
    }
}


class PinController extends Controller
{
    use ApiResponse;

    /**
     * Set or change the transaction PIN.
     * POST /api/v1/auth/pin/setup
     */
    public function setup(Request $request): JsonResponse
    {
        $request->validate([
            'pin'              => ['required', 'string', 'size:6', 'confirmed'],
            'pin_confirmation' => ['required', 'string', 'size:6'],
            'current_pin'      => ['nullable', 'string', 'size:6'],
        ]);

        $user = $request->user();

        // If PIN already set, require current PIN
        if ($user->transaction_pin) {
            if (! $request->current_pin || ! Hash::check($request->current_pin, $user->transaction_pin)) {
                return $this->error('Current PIN is incorrect.', 422);
            }
        }

        if (! ctype_digit($request->pin)) {
            return $this->error('PIN must contain only digits.', 422);
        }

        $user->transaction_pin = Hash::make($request->pin);
        $user->pin_set_at      = now();
        $user->save();

        return $this->success(null, 'Transaction PIN ' . ($user->pin_set_at ? 'updated' : 'set') . '.');
    }

    /**
     * Verify the transaction PIN and issue a short-lived pin_token.
     * POST /api/v1/auth/pin/verify
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate(['pin' => ['required', 'string', 'size:6']]);

        $user = $request->user();

        if (! $user->transaction_pin) {
            return $this->error('No PIN set. Please set a PIN first.', 422);
        }

        if (! Hash::check($request->pin, $user->transaction_pin)) {
            return $this->error('Incorrect PIN.', 401);
        }

        $pinToken = \Illuminate\Support\Str::random(64);
        cache()->put('pin_verified_' . $user->id, true, now()->addMinutes(5));

        return $this->success(['pin_token' => $pinToken], 'PIN verified.');
    }

    /**
     * Change the PIN.
     * POST /api/v1/auth/pin/change — alias for setup
     */
    public function change(Request $request): JsonResponse
    {
        return $this->setup($request);
    }
}


class SessionController extends Controller
{
    use ApiResponse;

    /**
     * List all active sessions (login activity).
     * GET /api/v1/sessions
     */
    public function index(Request $request): JsonResponse
    {
        $sessions = \App\Models\LoginActivity::where('user_id', $request->user()->id)
            ->orderByDesc('login_at')
            ->limit(20)
            ->get()
            ->map(fn($s) => [
                'ip_address'    => $s->ip_address,
                'device_type'   => $s->device_type,
                'location'      => trim(($s->location_city ?? '') . ' ' . ($s->location_country ?? '')),
                'is_new_device' => (bool) $s->is_new_device,
                'login_at'      => $s->login_at->toIso8601String(),
            ]);

        return $this->success($sessions, 'Sessions retrieved.');
    }

    /**
     * Revoke all tokens except the current one.
     * DELETE /api/v1/sessions
     */
    public function destroyAll(Request $request): JsonResponse
    {
        $current = $request->user()->currentAccessToken()->id;

        $request->user()
            ->tokens()
            ->where('id', '!=', $current)
            ->delete();

        return $this->success(null, 'All other sessions have been logged out.');
    }
}
