<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyPhoneRequest;
use App\Http\Requests\Auth\ConfirmPhoneRequest;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Models\UserNotificationPreference;
use App\Models\LoginActivity;
use App\Models\Referral;
use App\Services\SmsService;
use App\Services\AuditService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Uid\Ulid;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SmsService $smsService,
        protected AuditService $auditService
    ) {}

    /**
     * Register a new user account.
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Math captcha — client sends answer + base64(answer:salt) token
        $captchaAnswer = (int) $request->input('captcha_answer');
        $captchaToken  = $request->input('captcha_token', '');
        if (! $captchaToken) {
            return $this->error('Please complete the security check.', 422);
        }
        $decoded = base64_decode($captchaToken);
        $expectedAnswer = (int) explode(':', $decoded)[0];
        if ($captchaAnswer !== $expectedAnswer) {
            return $this->error('Incorrect security answer. Please try again.', 422);
        }

        // Generate unique referral code
        do {
            $referralCode = strtoupper(Str::random(8));
        } while (User::where('referral_code', $referralCode)->exists());

        $user = User::create([
            'ulid'          => (string) new Ulid(),
            'first_name'    => $request->first_name,
            'last_name'     => $request->last_name,
            'email'         => strtolower($request->email),
            'phone'         => $request->phone,
            'password'      => Hash::make($request->password),
            'country_id'    => $request->country_id,
            'role'          => 'user',
            'referral_code' => $referralCode,
        ]);

        // Auto-create notification preferences with all defaults
        UserNotificationPreference::create([
            'user_id'                   => $user->id,
            'email_notifications'       => 1,
            'inapp_notifications'       => 1,
            'sms_notifications'         => 1,
            'whatsapp_notifications'    => 0,
            'push_notifications'        => 1,
            'notify_rate_alerts'        => 1,
            'notify_match_proposals'    => 1,
            'notify_chat_messages'      => 1,
            'notify_transaction_updates'=> 1,
            'notify_marketing'          => 0,
        ]);

        // Handle referral tracking
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)->first();
            if ($referrer && $referrer->id !== $user->id) {
                Referral::create([
                    'referrer_id'              => $referrer->id,
                    'referred_id'              => $user->id,
                    'referral_code'            => $request->referral_code,
                    'status'                   => 'pending',
                    'referrer_discount_percent'=> 50.00,
                    'referred_discount_percent'=> 50.00,
                ]);
                $user->referred_by = $referrer->id;
                $user->save();
            }
        }

        // Send email verification — ALWAYS sent regardless of notification preferences
        event(new Registered($user));

        // Log login activity
        $this->logLoginActivity($request, $user);

        $this->auditService->log('user.registered', $user, $user, [], $user->toArray());

        $token = $user->createToken('ezimconnect-auth')->plainTextToken;

        return $this->created([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ], 'Account created successfully. Please verify your email.');
    }

    /**
     * Authenticate a user and return a Sanctum token.
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('The email or password is incorrect.', 401);
        }

        // Check account status
        if ($user->account_status === 'banned') {
            return $this->error('Your account has been permanently banned.', 403);
        }

        if ($user->account_status === 'suspended') {
            $message = 'Your account has been suspended.';
            if ($user->suspension_reason) {
                $message .= ' Reason: ' . $user->suspension_reason;
            }
            return $this->error($message, 403);
        }

        // Check if 2FA is required
        if ($user->two_fa_enabled) {
            // Store a temporary token in cache and require 2FA verification
            $tempToken = Str::random(40);
            Cache::put('2fa_pending_' . $tempToken, $user->id, now()->addMinutes(10));

            return $this->success([
                'requires_2fa'  => true,
                'temp_token'    => $tempToken,
                'method'        => $user->two_fa_method,
            ], 'Two-factor authentication required.');
        }

        // Revoke old tokens and issue new one
        $user->tokens()->delete();
        $token = $user->createToken('ezimconnect-auth')->plainTextToken;

        // Update last login
        $user->last_login_at = now();
        $user->save();

        // Log login activity
        $isNewDevice = $this->logLoginActivity($request, $user);

        // Send new device alert email
        if ($isNewDevice) {
            // Notification sent via NotificationService — always bypasses prefs for security
            event(new \App\Events\NewDeviceLogin($user, $request->ip()));
        }

        $this->auditService->log('user.login', $user, $user);

        return $this->success([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ], 'Login successful.');
    }

    /**
     * Revoke the current user's token (logout).
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        $this->auditService->log('user.logout', $request->user(), $request->user());

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Send a password reset link to the given email.
     * POST /api/v1/auth/forgot-password
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        // Always return success to prevent email enumeration
        $status = Password::sendResetLink(['email' => strtolower($request->email)]);

        return $this->success(
            null,
            'If an account with that email exists, a password reset link has been sent.'
        );
    }

    /**
     * Reset the user's password using the token from email.
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            [
                'email'                 => strtolower($request->email),
                'password'              => $request->password,
                'password_confirmation' => $request->password_confirmation,
                'token'                 => $request->token,
            ],
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                // Revoke all existing tokens for security
                $user->tokens()->delete();

                $this->auditService->log('user.password_reset', $user, $user);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return $this->error(__($status), 400);
        }

        return $this->success(null, 'Password reset successfully. Please log in.');
    }

    /**
     * Handle the email verification link click.
     * GET /api/v1/auth/verify-email/{id}/{hash}
     */
    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->email), $hash)) {
            return $this->error('Invalid verification link.', 400);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
            $this->auditService->log('user.email_verified', $user, $user);
        }

        return $this->success(null, 'Email verified successfully.');
    }

    /**
     * Resend the email verification notification.
     * POST /api/v1/auth/resend-verification
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->error('Email is already verified.', 400);
        }

        $user->sendEmailVerificationNotification();

        return $this->success(null, 'Verification email sent.');
    }

    /**
     * Send a phone verification OTP.
     * POST /api/v1/auth/verify-phone
     */
    public function verifyPhone(VerifyPhoneRequest $request): JsonResponse
    {
        $user = $request->user();

        // Generate 6-digit OTP
        $otp      = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $cacheKey = 'phone_otp_' . $user->id;

        // Store OTP in cache for 10 minutes
        Cache::put($cacheKey, [
            'otp'   => Hash::make($otp),
            'phone' => $request->phone,
        ], now()->addMinutes(10));

        // Send SMS
        $this->smsService->send(
            $request->phone,
            "Your eZimConnect verification code is: {$otp}. Valid for 10 minutes."
        );

        return $this->success(null, 'Verification code sent to ' . $request->phone . '.');
    }

    /**
     * Confirm the phone OTP and mark phone as verified.
     * POST /api/v1/auth/verify-phone/confirm
     */
    public function confirmPhone(ConfirmPhoneRequest $request): JsonResponse
    {
        $user     = $request->user();
        $cacheKey = 'phone_otp_' . $user->id;
        $cached   = Cache::get($cacheKey);

        if (! $cached) {
            return $this->error('Verification code has expired. Please request a new one.', 400);
        }

        if (! Hash::check($request->code, $cached['otp'])) {
            return $this->error('Invalid verification code.', 400);
        }

        $user->phone             = $cached['phone'];
        $user->phone_verified_at = now();
        $user->save();

        Cache::forget($cacheKey);

        $this->auditService->log('user.phone_verified', $user, $user);

        return $this->success(null, 'Phone number verified successfully.');
    }

    // ─── Private helpers ────────────────────────────────────────────────────

    /**
     * Format a user for the API response.
     */
    private function formatUser(User $user): array
    {
        return [
            'id'                  => $user->id,
            'ulid'                => $user->ulid,
            'first_name'          => $user->first_name,
            'last_name'           => $user->last_name,
            'email'               => $user->email,
            'phone'               => $user->phone,
            'email_verified'      => $user->hasVerifiedEmail(),
            'phone_verified'      => ! is_null($user->phone_verified_at),
            'kyc_status'          => $user->kyc_status,
            'account_status'      => $user->account_status,
            'account_type'        => $user->account_type,
            'role'                => $user->role,
            'two_fa_enabled'      => (bool) $user->two_fa_enabled,
            'pin_set'             => ! is_null($user->transaction_pin),
            'onboarding_completed'=> (bool) $user->onboarding_completed,
            'referral_code'       => $user->referral_code,
            'profile_photo'       => $user->profile_photo,
            'country_id'          => $user->country_id,
        ];
    }

    /**
     * Log login activity. Returns true if this is a new device.
     */
    private function logLoginActivity(Request $request, User $user): bool
    {
        $ip        = $request->ip();
        $userAgent = $request->userAgent();

        // Simple device fingerprint: hash of IP + user-agent
        $fingerprint = sha1($ip . $userAgent);
        $isNewDevice = ! LoginActivity::where('user_id', $user->id)
            ->where('ip_address', $ip)
            ->exists();

        LoginActivity::create([
            'user_id'         => $user->id,
            'ip_address'      => $ip,
            'user_agent'      => $userAgent,
            'device_type'     => $this->detectDeviceType($userAgent),
            'is_new_device'   => $isNewDevice,
            'login_at'        => now(),
        ]);

        return $isNewDevice;
    }

    /**
     * Detect device type from user-agent string.
     */
    private function detectDeviceType(?string $userAgent): string
    {
        if (! $userAgent) {
            return 'unknown';
        }
        if (preg_match('/mobile/i', $userAgent)) {
            return 'mobile';
        }
        if (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }
}
