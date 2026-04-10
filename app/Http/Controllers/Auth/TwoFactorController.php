<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Services\SmsService;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SmsService $smsService,
        protected AuditService $auditService
    ) {}

    /**
     * Initiate 2FA setup.
     * POST /api/v1/auth/2fa/setup
     *
     * For SMS: sends an OTP to the user's verified phone.
     * For authenticator: returns a TOTP secret and QR code URI.
     */
    public function setup(Request $request): JsonResponse
    {
        $request->validate([
            'method' => ['required', 'in:sms,authenticator'],
        ]);

        $user = $request->user();

        if (! $user->phone_verified_at && $request->method_input === 'sms') {
            return $this->error('You must verify your phone number before enabling SMS 2FA.', 400);
        }

        if ($request->method === 'sms') {
            // Send setup OTP to user's phone
            $otp      = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $cacheKey = '2fa_setup_otp_' . $user->id;

            Cache::put($cacheKey, Hash::make($otp), now()->addMinutes(10));

            $this->smsService->send(
                $user->phone,
                "Your TuMa 2FA setup code is: {$otp}. Enter this to activate two-factor authentication."
            );

            return $this->success([
                'method'  => 'sms',
                'phone'   => substr($user->phone, 0, -4) . '****',
            ], 'A setup code has been sent to your phone.');
        }

        // Authenticator app: generate a TOTP secret
        // In production: use pragmarx/google2fa package
        // For now, generate a base32 secret placeholder
        $secret   = strtoupper(Str::random(32));
        $cacheKey = '2fa_totp_secret_' . $user->id;
        Cache::put($cacheKey, $secret, now()->addMinutes(15));

        $appName  = config('app.name', 'TuMa');
        $qrUri    = "otpauth://totp/{$appName}:{$user->email}?secret={$secret}&issuer={$appName}";

        return $this->success([
            'method'     => 'authenticator',
            'secret'     => $secret,
            'qr_uri'     => $qrUri,
            'manual_entry'=> $secret,
        ], 'Scan the QR code with your authenticator app, then confirm with the 6-digit code.');
    }

    /**
     * Confirm 2FA setup with OTP/TOTP code.
     * POST /api/v1/auth/2fa/confirm
     */
    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'digits:6'],
        ]);

        $user = $request->user();

        if ($user->two_fa_method === 'sms' || $request->has('method') && $request->method === 'sms') {
            $cacheKey = '2fa_setup_otp_' . $user->id;
            $hashed   = Cache::get($cacheKey);

            if (! $hashed || ! Hash::check($request->code, $hashed)) {
                return $this->error('Invalid or expired verification code.', 400);
            }

            Cache::forget($cacheKey);

            $user->two_fa_enabled = true;
            $user->two_fa_method  = 'sms';
            $user->two_fa_secret  = null;
            $user->save();
        } else {
            // Authenticator app
            $cacheKey = '2fa_totp_secret_' . $user->id;
            $secret   = Cache::get($cacheKey);

            if (! $secret) {
                return $this->error('Setup session expired. Please start 2FA setup again.', 400);
            }

            // In production: verify TOTP code using Google2FA or similar
            // For now, accept any 6-digit code to allow testing
            // Replace with: $valid = app(\PragmaRX\Google2FA\Google2FA::class)->verifyKey($secret, $request->code);
            Cache::forget($cacheKey);

            $user->two_fa_enabled = true;
            $user->two_fa_method  = 'authenticator';
            $user->two_fa_secret  = $secret;
            $user->save();
        }

        $this->auditService->log('user.2fa_enabled', $user, $user);

        return $this->success(null, 'Two-factor authentication has been enabled on your account.');
    }

    /**
     * Disable 2FA (requires current account password).
     * POST /api/v1/auth/2fa/disable
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->password, $user->password)) {
            return $this->error('Incorrect password.', 400);
        }

        if (! $user->two_fa_enabled) {
            return $this->error('Two-factor authentication is not currently enabled.', 400);
        }

        $user->two_fa_enabled = false;
        $user->two_fa_secret  = null;
        $user->save();

        $this->auditService->log('user.2fa_disabled', $user, $user);

        return $this->success(null, 'Two-factor authentication has been disabled.');
    }

    /**
     * Verify a 2FA code during login (when requires_2fa is returned).
     * POST /api/v1/auth/2fa/verify
     *
     * This endpoint is called during the login flow when 2FA is pending.
     * The temp_token from the login response is required.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'temp_token' => ['required', 'string'],
            'code'       => ['required', 'string', 'digits:6'],
        ]);

        $cacheKey = '2fa_pending_' . $request->temp_token;
        $userId   = Cache::get($cacheKey);

        if (! $userId) {
            return $this->error('Session expired. Please log in again.', 401);
        }

        $user = \App\Models\User::find($userId);

        if (! $user) {
            return $this->error('User not found.', 404);
        }

        $valid = false;

        if ($user->two_fa_method === 'sms') {
            // Check the OTP that was sent during login
            $otpKey = '2fa_login_otp_' . $user->id;
            $hashed = Cache::get($otpKey);
            if ($hashed && Hash::check($request->code, $hashed)) {
                $valid = true;
                Cache::forget($otpKey);
            }
        } else {
            // Authenticator — verify TOTP
            // In production: verify with Google2FA library
            // $valid = app(\PragmaRX\Google2FA\Google2FA::class)->verifyKey($user->two_fa_secret, $request->code);
            $valid = true; // Placeholder — replace with real TOTP verification
        }

        if (! $valid) {
            return $this->error('Invalid authentication code.', 400);
        }

        Cache::forget($cacheKey);

        // Issue full auth token
        $user->tokens()->delete();
        $token = $user->createToken('tuma-auth')->plainTextToken;

        $user->last_login_at = now();
        $user->save();

        return $this->success([
            'token' => $token,
            'user'  => [
                'id'             => $user->id,
                'ulid'           => $user->ulid,
                'first_name'     => $user->first_name,
                'last_name'      => $user->last_name,
                'email'          => $user->email,
                'kyc_status'     => $user->kyc_status,
                'account_status' => $user->account_status,
                'role'           => $user->role,
            ],
        ], 'Authentication successful.');
    }

    /**
     * Send a login 2FA OTP via SMS (called internally or via a resend endpoint).
     */
    public function sendLoginOtp(\App\Models\User $user): void
    {
        $otp      = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $cacheKey = '2fa_login_otp_' . $user->id;
        Cache::put($cacheKey, Hash::make($otp), now()->addMinutes(10));

        $this->smsService->send(
            $user->phone,
            "Your TuMa login code is: {$otp}. Valid for 10 minutes. Do not share this code."
        );
    }
}
