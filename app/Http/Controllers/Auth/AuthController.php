<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\LoginActivity;
use App\Models\Referral;
use App\Models\User;
use App\Models\UserNotificationPreference;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Symfony\Component\Uid\Ulid;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected NotificationService $notificationService,
        protected AuditService $auditService
    ) {}

    /**
     * POST /api/v1/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'first_name'    => ['required', 'string', 'max:100'],
            'last_name'     => ['required', 'string', 'max:100'],
            'email'         => ['required', 'email', 'max:191', 'unique:users,email'],
            'phone'         => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'country_id'    => ['required', 'integer', 'exists:countries,id'],
            'referral_code' => ['nullable', 'string', 'max:20'],
        ]);

        // Generate unique referral code
        do {
            $myReferralCode = strtoupper(Str::random(8));
        } while (User::where('referral_code', $myReferralCode)->exists());

        // Check if they were referred
        $referrer = null;
        if ($request->filled('referral_code')) {
            $referrer = User::where('referral_code', strtoupper($request->referral_code))->first();
        }

        $user = User::create([
            'ulid'          => (string) new Ulid(),
            'first_name'    => $request->first_name,
            'last_name'     => $request->last_name,
            'email'         => strtolower($request->email),
            'phone'         => $request->phone,
            'password'      => Hash::make($request->password),
            'country_id'    => $request->country_id,
            'role'          => 'user',
            'kyc_status'    => 'pending',
            'account_status'=> 'active',
            'referral_code' => $myReferralCode,
            'referred_by'   => $referrer?->id,
        ]);

        // Auto-create notification preferences (all on by default, except marketing + whatsapp)
        UserNotificationPreference::create([
            'user_id'                    => $user->id,
            'email_notifications'        => 1,
            'inapp_notifications'        => 1,
            'sms_notifications'          => 1,
            'whatsapp_notifications'     => 0,
            'push_notifications'         => 1,
            'notify_rate_alerts'         => 1,
            'notify_match_proposals'     => 1,
            'notify_chat_messages'       => 1,
            'notify_transaction_updates' => 1,
            'notify_marketing'           => 0,
        ]);

        // Track referral
        if ($referrer) {
            Referral::create([
                'referrer_id'  => $referrer->id,
                'referred_id'  => $user->id,
                'referral_code'=> strtoupper($request->referral_code),
                'status'       => 'pending',
            ]);
        }

        // Send email verification — always, regardless of notification prefs
        event(new Registered($user));

        $token = $user->createToken('auth')->plainTextToken;

        $this->auditService->log('user.registered', $user, $user);

        return $this->created([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ], 'Account created. Please check your email to verify your address.');
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials.', 401);
        }

        if ($user->account_status === User::STATUS_BANNED) {
            return $this->error('Your account has been banned. Contact support.', 403);
        }

        if ($user->account_status === User::STATUS_SUSPENDED) {
            $until = $user->account_suspended_until
                ? ' until ' . $user->account_suspended_until->toFormattedDateString()
                : '';
            return $this->error('Your account is suspended' . $until . '. Reason: ' . $user->suspension_reason, 403);
        }

        // Check 2FA
        if ($user->two_fa_enabled) {
            $tempToken = Str::random(64);
            cache()->put('2fa_temp_' . $tempToken, $user->id, now()->addMinutes(10));

            return $this->success([
                'requires_2fa' => true,
                'temp_token'   => $tempToken,
            ], '2FA verification required.');
        }

        // Log login activity
        LoginActivity::create([
            'user_id'          => $user->id,
            'ip_address'       => $request->ip(),
            'user_agent'       => $request->userAgent(),
            'device_type'      => $this->detectDevice($request->userAgent() ?? ''),
            'location_country' => null, // IP geolocation can be added later
            'is_new_device'    => false,
            'login_at'         => now(),
        ]);

        $user->last_login_at = now();
        $user->save();

        $token = $user->createToken('auth')->plainTextToken;

        $this->auditService->log('user.login', $user, $user);

        return $this->success([
            'token' => $token,
            'user'  => $this->formatUser($user),
        ], 'Logged in.');
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out.');
    }

    /**
     * POST /api/v1/auth/forgot-password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(null, 'Password reset link sent to your email.');
        }

        return $this->error('Unable to send reset link. Please check your email address.', 422);
    }

    /**
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->password = Hash::make($password);
                $user->save();
                $user->tokens()->delete(); // Revoke all tokens on password reset
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password reset successfully. Please log in.');
        }

        return $this->error('Invalid or expired reset token.', 422);
    }

    /**
     * Email verification — GET /api/v1/auth/verify-email/{id}/{hash}
     */
    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->email), $hash)) {
            return $this->error('Invalid verification link.', 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        $user->markEmailAsVerified();
        return $this->success(null, 'Email verified successfully!');
    }

    /**
     * POST /api/v1/auth/verify-phone — Send OTP to user's phone.
     */
    public function verifyPhone(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->phone_verified_at) {
            return $this->error('Phone already verified.', 422);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        cache()->put('phone_otp_' . $user->id, $otp, now()->addMinutes(10));

        // TODO: Send via SMS service
        // app(SmsService::class)->send($user->phone, "Your TuMa verification code is: $otp");

        return $this->success(null, 'Verification code sent to ' . $user->redacted_phone . '.');
    }

    /**
     * POST /api/v1/auth/confirm-phone — Confirm OTP.
     */
    public function confirmPhone(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string', 'size:6']]);

        $user = $request->user();
        $cached = cache()->get('phone_otp_' . $user->id);

        if (! $cached || $cached !== $request->code) {
            return $this->error('Invalid or expired verification code.', 422);
        }

        $user->phone_verified_at = now();
        $user->save();

        cache()->forget('phone_otp_' . $user->id);

        return $this->success(null, 'Phone number verified.');
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private function formatUser(User $user): array
    {
        return [
            'id'                   => $user->id,
            'ulid'                 => $user->ulid,
            'first_name'           => $user->first_name,
            'last_name'            => $user->last_name,
            'email'                => $user->email,
            'email_verified'       => ! is_null($user->email_verified_at),
            'phone'                => $user->phone,
            'phone_verified'       => ! is_null($user->phone_verified_at),
            'kyc_status'           => $user->kyc_status,
            'account_status'       => $user->account_status,
            'account_type'         => $user->account_type,
            'role'                 => $user->role,
            'two_fa_enabled'       => (bool) $user->two_fa_enabled,
            'pin_set'              => ! is_null($user->transaction_pin),
            'onboarding_completed' => (bool) $user->onboarding_completed,
            'referral_code'        => $user->referral_code,
            'trust_score'          => $user->trust_score,
            'total_trades'         => $user->total_trades,
            'rating'               => $user->rating ? (float) $user->rating : null,
            'profile_visibility'   => $user->profile_visibility,
            'always_available'     => (bool) $user->always_available,
            'created_at'           => $user->created_at->toIso8601String(),
        ];
    }

    private function detectDevice(string $userAgent): string
    {
        if (str_contains(strtolower($userAgent), 'mobile')) return 'mobile';
        if (str_contains(strtolower($userAgent), 'tablet')) return 'tablet';
        return 'desktop';
    }
}
