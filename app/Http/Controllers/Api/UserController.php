<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Models\UserNotificationPreference;
use App\Services\AuditService;
use App\Services\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuditService $auditService,
        protected TrustScoreService $trustScoreService
    ) {}

    /**
     * Get authenticated user's full profile.
     * GET /api/v1/user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['country', 'badges', 'notificationPreferences']);

        return $this->success([
            'id'                    => $user->id,
            'ulid'                  => $user->ulid,
            'first_name'            => $user->first_name,
            'last_name'             => $user->last_name,
            'display_name'          => $user->display_first_name . ' ' . $user->last_name[0] . '.',
            'email'                 => $user->email,
            'phone'                 => $user->phone,
            'email_verified'        => ! is_null($user->email_verified_at),
            'phone_verified'        => ! is_null($user->phone_verified_at),
            'profile_photo'         => $user->profile_photo
                ? Storage::url($user->profile_photo) : null,
            'bio'                   => $user->bio,
            'gender'                => $user->gender,
            'country'               => $user->country ? [
                'id'   => $user->country->id,
                'name' => $user->country->name,
                'flag' => $user->country->flag_emoji,
            ] : null,
            'kyc_status'            => $user->kyc_status,
            'account_status'        => $user->account_status,
            'account_type'          => $user->account_type,
            'role'                  => $user->role,
            'two_fa_enabled'        => (bool) $user->two_fa_enabled,
            'two_fa_method'         => $user->two_fa_method,
            'pin_set'               => ! is_null($user->transaction_pin),
            'profile_visibility'    => $user->profile_visibility,
            'business_name'         => $user->business_name,
            'business_description'  => $user->business_description,
            'is_verified_business'  => (bool) $user->is_verified_business,
            'always_available'      => (bool) $user->always_available,
            'available_locations'   => $user->available_locations,
            'min_amount_aud'        => (float) $user->min_amount_aud,
            'max_amount_aud'        => (float) $user->max_amount_aud,
            'total_trades'          => $user->total_trades,
            'successful_trades'     => $user->successful_trades,
            'rating'                => $user->rating ? (float) $user->rating : null,
            'trust_score'           => $user->trust_score,
            'referral_code'         => $user->referral_code,
            'referral_count'        => $user->referral_count,
            'referral_earnings_aud' => (float) $user->referral_earnings_aud,
            'has_bank_account'       => $user->bankAccounts()->exists(),
            'onboarding_completed'  => (bool) $user->onboarding_completed,
            'last_seen'             => $user->last_seen_human,
            'created_at'            => $user->created_at->toIso8601String(),
            'badges'                => $user->badges->map(fn($b) => [
                'badge_key'  => $b->badge_key,
                'badge_name' => $b->badge_name,
                'badge_icon' => $b->badge_icon,
            ]),
            'notification_preferences' => $user->notificationPreferences ? [
                'email'       => (bool) $user->notificationPreferences->email_notifications,
                'inapp'       => (bool) $user->notificationPreferences->inapp_notifications,
                'sms'         => (bool) $user->notificationPreferences->sms_notifications,
                'whatsapp'    => (bool) $user->notificationPreferences->whatsapp_notifications,
                'push'        => (bool) $user->notificationPreferences->push_notifications,
                'rate_alerts' => (bool) $user->notificationPreferences->notify_rate_alerts,
                'matches'     => (bool) $user->notificationPreferences->notify_match_proposals,
                'chat'        => (bool) $user->notificationPreferences->notify_chat_messages,
                'transactions'=> (bool) $user->notificationPreferences->notify_transaction_updates,
                'marketing'   => (bool) $user->notificationPreferences->notify_marketing,
            ] : null,
        ], 'User retrieved.');
    }

    /**
     * Update profile fields.
     * PUT /api/v1/user/profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'first_name'           => ['sometimes', 'string', 'max:100'],
            'last_name'            => ['sometimes', 'string', 'max:100'],
            'bio'                  => ['nullable', 'string', 'max:500'],
            'gender'               => ['nullable', 'in:male,female,prefer_not_to_say'],
            'account_type'         => ['sometimes', 'in:personal,business'],
            'business_name'        => ['nullable', 'string', 'max:150'],
            'business_description' => ['nullable', 'string', 'max:1000'],
            'profile_visibility'   => ['sometimes', 'in:public,anonymous'],
            'anonymous_name'       => ['nullable', 'string', 'max:100'],
            'anonymous_location'   => ['nullable', 'string', 'max:100'],
            'anonymous_bio'        => ['nullable', 'string', 'max:500'],
            'always_available'     => ['sometimes', 'boolean'],
            'available_locations'  => ['nullable', 'array'],
            'min_amount_aud'       => ['nullable', 'numeric', 'min:50'],
            'max_amount_aud'       => ['nullable', 'numeric', 'min:50', 'max:50000'],
        ]);

        $user = $request->user();
        $old  = $user->only([
            'first_name','last_name','bio','account_type',
            'profile_visibility','always_available'
        ]);

        $user->fill($request->only([
            'first_name','last_name','bio','gender',
            'account_type','business_name','business_description',
            'profile_visibility','anonymous_name','anonymous_location','anonymous_bio',
            'always_available','available_locations','min_amount_aud','max_amount_aud',
        ]));
        $user->save();

        $this->auditService->log('user.profile_updated', $user, $user, $old, $user->only(array_keys($old)));

        return $this->success($this->formatProfile($user), 'Profile updated.');
    }

    /**
     * Upload profile photo.
     * POST /api/v1/user/profile/photo
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ]);

        $user = $request->user();

        // Delete old photo
        if ($user->profile_photo) {
            Storage::disk('local')->delete($user->profile_photo);
        }

        $path = $request->file('photo')->store('profiles/' . $user->id, 'public');
        $user->profile_photo = $path;
        $user->save();

        return $this->success([
            'profile_photo' => Storage::url($path),
        ], 'Profile photo updated.');
    }

    /**
     * Get user dashboard stats.
     * GET /api/v1/user/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $activeOrders  = \App\Models\SwapOrder::where('user_id', $user->id)
            ->where('status', 'open')->count();
        $activeMatches = \App\Models\SwapMatch::where(function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->whereNotIn('status', ['completed','cancelled','refunded'])->count();

        $unreadMessages = \App\Models\TransactionMessage::whereHas('match', function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->where('sender_id', '!=', $user->id)->where('is_read', 0)->count();

        return $this->success([
            'active_orders'     => $activeOrders,
            'active_matches'    => $activeMatches,
            'completed_trades'  => $user->successful_trades,
            'total_trades'      => $user->total_trades,
            'rating'            => $user->rating ? (float) $user->rating : null,
            'trust_score'       => $user->trust_score,
            'unread_messages'   => $unreadMessages,
            'referral_count'    => $user->referral_count,
            'referral_earnings' => (float) $user->referral_earnings_aud,
        ], 'Stats retrieved.');
    }

    /**
     * Update notification preferences.
     * PUT /api/v1/user/notifications/preferences
     */
    public function updateNotificationPreferences(Request $request): JsonResponse
    {
        $request->validate([
            'email'        => ['sometimes', 'boolean'],
            'inapp'        => ['sometimes', 'boolean'],
            'sms'          => ['sometimes', 'boolean'],
            'whatsapp'     => ['sometimes', 'boolean'],
            'push'         => ['sometimes', 'boolean'],
            'rate_alerts'  => ['sometimes', 'boolean'],
            'matches'      => ['sometimes', 'boolean'],
            'chat'         => ['sometimes', 'boolean'],
            'transactions' => ['sometimes', 'boolean'],
            'marketing'    => ['sometimes', 'boolean'],
        ]);

        $user  = $request->user();
        $prefs = $user->notificationPreferences
            ?? UserNotificationPreference::firstOrCreate(['user_id' => $user->id]);

        $map = [
            'email'       => 'email_notifications',
            'inapp'       => 'inapp_notifications',
            'sms'         => 'sms_notifications',
            'whatsapp'    => 'whatsapp_notifications',
            'push'        => 'push_notifications',
            'rate_alerts' => 'notify_rate_alerts',
            'matches'     => 'notify_match_proposals',
            'chat'        => 'notify_chat_messages',
            'transactions'=> 'notify_transaction_updates',
            'marketing'   => 'notify_marketing',
        ];

        foreach ($map as $key => $col) {
            if ($request->has($key)) {
                $prefs->$col = $request->boolean($key);
            }
        }
        $prefs->save();

        return $this->success(null, 'Notification preferences updated.');
    }

    /**
     * List in-app notifications.
     * GET /api/v1/user/notifications
     */
    public function notifications(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->paginated($notifications, 'Notifications retrieved.',
            $notifications->getCollection()->map(fn($n) => [
                'id'         => $n->id,
                'type'       => class_basename($n->type),
                'data'       => $n->data,
                'read_at'    => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at->toIso8601String(),
            ])
        );
    }

    /**
     * Mark all notifications as read.
     * POST /api/v1/user/notifications/read-all
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);
        return $this->success(null, 'All notifications marked as read.');
    }

    /**
     * Mark a single notification as read.
     * POST /api/v1/user/notifications/{id}/read
     */
    public function markRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return $this->success(null, 'Notification marked as read.');
    }

    /**
     * Get a public user profile (for the directory and match partner view).
     * GET /api/v1/users/{ulid}
     */
    public function publicProfile(string $ulid): JsonResponse
    {
        $user = User::where('ulid', $ulid)
            ->where('account_status', 'active')
            ->with(['country', 'badges'])
            ->firstOrFail();

        $reviews = \App\Models\UserReview::where('reviewed_user_id', $user->id)
            ->where('is_visible', 1)
            ->with('reviewer')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $isAnon = $user->profile_visibility === 'anonymous';

        return $this->success([
            'ulid'                 => $user->ulid,
            'display_name'         => $isAnon
                ? ($user->anonymous_name ?: $user->display_first_name . ' ' . $user->last_name[0] . '.')
                : $user->first_name . ' ' . $user->last_name[0] . '.',
            'bio'                  => $isAnon ? $user->anonymous_bio : $user->bio,
            'profile_photo'        => $user->profile_photo ? Storage::url($user->profile_photo) : null,
            'account_type'         => $user->account_type,
            'business_name'        => $user->business_name,
            'is_verified_business' => (bool) $user->is_verified_business,
            'always_available'     => (bool) $user->always_available,
            'available_locations'  => $user->available_locations,
            'min_amount_aud'       => (float) $user->min_amount_aud,
            'max_amount_aud'       => (float) $user->max_amount_aud,
            'total_trades'         => $user->total_trades,
            'rating'               => $user->rating ? (float) $user->rating : null,
            'trust_score'          => $user->trust_score,
            'member_since'         => $user->created_at->toDateString(),
            'country'              => $isAnon
                ? ($user->anonymous_location ?: null)
                : $user->country?->name,
            'badges'               => $user->badges->where('is_visible', 1)->map(fn($b) => [
                'badge_key'  => $b->badge_key,
                'badge_name' => $b->badge_name,
                'badge_icon' => $b->badge_icon,
            ])->values(),
            'recent_reviews'       => $reviews->map(fn($r) => [
                'score'      => $r->score,
                'comment'    => $r->review_text,
                'reviewer'   => $r->reviewer->display_first_name,
                'created_at' => $r->created_at->toDateString(),
            ]),
        ], 'Profile retrieved.');
    }

    /**
     * Complete onboarding.
     * POST /api/v1/user/onboarding/complete
     */
    public function completeOnboarding(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->onboarding_completed = true;
        $user->save();
        return $this->success(null, 'Onboarding completed.');
    }

    /**
     * Change password.
     * PUT /api/v1/user/password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return $this->error('Current password is incorrect.', 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Revoke all other tokens for security
        $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        $this->auditService->log('user.password_changed', $user, $user);

        return $this->success(null, 'Password changed. All other sessions have been logged out.');
    }

    /**
     * Get trade history (completed matches).
     * GET /api/v1/user/history
     */
    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $matches = \App\Models\SwapMatch::where('status', 'completed')
            ->where(function ($q) use ($user) {
                $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
                  ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
            })
            ->with(['sendOrder.deliveryLocation', 'receiveOrder'])
            ->orderByDesc('completed_at')
            ->paginate(20);

        return $this->paginated($matches, 'History retrieved.',
            $matches->getCollection()->map(fn($m) => [
                'ulid'             => $m->ulid,
                'role'             => $m->sendOrder?->user_id === $user->id ? 'sender' : 'receiver',
                'agreed_aud'       => (float) $m->agreed_aud,
                'agreed_usd'       => (float) $m->agreed_usd,
                'platform_fee_aud' => (float) $m->platform_fee_aud,
                'delivery_method'  => $m->delivery_method,
                'location'         => $m->sendOrder?->deliveryLocation?->name,
                'completed_at'     => $m->completed_at?->toIso8601String(),
                'deposit_reference'=> $m->getDepositReference(),
            ])
        );
    }

    private function formatProfile(User $user): array
    {
        return [
            'first_name'         => $user->first_name,
            'last_name'          => $user->last_name,
            'bio'                => $user->bio,
            'gender'             => $user->gender,
            'account_type'       => $user->account_type,
            'business_name'      => $user->business_name,
            'profile_visibility' => $user->profile_visibility,
            'always_available'   => (bool) $user->always_available,
            'min_amount_aud'     => (float) $user->min_amount_aud,
            'max_amount_aud'     => (float) $user->max_amount_aud,
        ];
    }
}
