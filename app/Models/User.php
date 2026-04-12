<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;
use Symfony\Component\Uid\Ulid;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // ── Status Constants ─────────────────────────────────────────────────────

    const KYC_PENDING   = 'pending';
    const KYC_SUBMITTED = 'submitted';
    const KYC_APPROVED  = 'approved';
    const KYC_REJECTED  = 'rejected';

    const STATUS_ACTIVE    = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_BANNED    = 'banned';

    const TYPE_PERSONAL = 'personal';
    const TYPE_BUSINESS  = 'business';

    const VISIBILITY_PUBLIC    = 'public';
    const VISIBILITY_ANONYMOUS = 'anonymous';

    const GENDER_MALE          = 'male';
    const GENDER_FEMALE        = 'female';
    const GENDER_PREFER_NOT    = 'prefer_not_to_say';

    const ROLE_USER  = 'user';
    const ROLE_ADMIN = 'admin';

    // ── KYC Trading Tiers ────────────────────────────────────────────────────

    const TIER_1_MAX_AUD  = 300.00;   // 0–4 completed trades
    const TIER_2_MAX_AUD  = 1500.00;  // 5–19 completed trades
    const TIER_3_MAX_AUD  = 5000.00;  // 20+ completed trades

    // ─────────────────────────────────────────────────────────────────────────

    protected $fillable = [
        'ulid',
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'phone',
        'phone_verified_at',
        'password',
        'country_id',
        'profile_photo',
        'gender',
        'bio',
        'last_seen_at',

        // Privacy
        'profile_visibility',
        'anonymous_name',
        'anonymous_location',
        'anonymous_bio',

        // KYC
        'kyc_status',
        'kyc_reference',
        'kyc_reviewed_at',

        // Account
        'account_status',
        'suspension_reason',
        'account_suspended_until',
        'role',

        // Stats
        'total_trades',
        'successful_trades',
        'rating',
        'trust_score',
        'report_count',

        // Business / directory
        'account_type',
        'business_name',
        'business_description',
        'is_verified_business',
        'always_available',
        'available_locations',
        'min_amount_aud',
        'max_amount_aud',

        // 2FA & PIN
        'two_fa_enabled',
        'two_fa_secret',
        'two_fa_method',
        'transaction_pin',
        'pin_set_at',

        // Referral
        'referral_code',
        'referred_by',
        'referral_count',
        'referral_earnings_aud',

        // Onboarding
        'onboarding_completed',
        'onboarding_step',

        'remember_token',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'transaction_pin',
        'two_fa_secret',
    ];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'phone_verified_at'       => 'datetime',
        'kyc_reviewed_at'         => 'datetime',
        'last_seen_at'            => 'datetime',
        'last_login_at'           => 'datetime',
        'pin_set_at'              => 'datetime',
        'account_suspended_until' => 'datetime',
        'available_locations'     => 'array',
        'rating'                  => 'decimal:2',
        'min_amount_aud'          => 'decimal:2',
        'max_amount_aud'          => 'decimal:2',
        'referral_earnings_aud'   => 'decimal:2',
        'two_fa_enabled'          => 'boolean',
        'is_verified_business'    => 'boolean',
        'always_available'        => 'boolean',
        'onboarding_completed'    => 'boolean',
    ];

    // ── Boot ─────────────────────────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (User $user) {
            // Auto-generate ULID
            if (empty($user->ulid)) {
                $user->ulid = (string) new Ulid();
            }

            // Auto-generate unique referral code
            if (empty($user->referral_code)) {
                do {
                    $code = strtoupper(Str::random(8));
                } while (static::where('referral_code', $code)->exists());

                $user->referral_code = $code;
            }
        });
    }

    // ── Accessors ────────────────────────────────────────────────────────────

    /**
     * Return the display name respecting profile visibility setting.
     * When anonymous: returns the fake name.
     * When public: returns real first + last name.
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->profile_visibility === self::VISIBILITY_ANONYMOUS && $this->anonymous_name) {
            return $this->anonymous_name;
        }
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Return only the first name for display (used in order cards, feed, etc.)
     */
    public function getDisplayFirstNameAttribute(): string
    {
        if ($this->profile_visibility === self::VISIBILITY_ANONYMOUS && $this->anonymous_name) {
            $parts = explode(' ', $this->anonymous_name);
            return $parts[0];
        }
        return $this->first_name;
    }

    /**
     * Return bio respecting visibility.
     */
    public function getDisplayBioAttribute(): ?string
    {
        if ($this->profile_visibility === self::VISIBILITY_ANONYMOUS) {
            return $this->anonymous_bio;
        }
        return $this->bio;
    }

    /**
     * Return the default avatar path based on gender.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->profile_photo) {
            // Photos stored on public disk — use Storage::url() directly
            return \Illuminate\Support\Facades\Storage::disk('public')->url($this->profile_photo);
        }

        return match($this->gender) {
            'male'          => asset('images/avatars/male-default.svg'),
            'female'        => asset('images/avatars/female-default.svg'),
            default         => asset('images/avatars/neutral-default.svg'),
        };
    }

    /**
     * Return human-readable last seen string.
     */
    public function getLastSeenHumanAttribute(): string
    {
        if (! $this->last_seen_at) {
            return 'Never';
        }

        $diffSeconds = now()->diffInSeconds($this->last_seen_at);

        if ($diffSeconds < 60) {
            return 'Online now';
        }
        if ($diffSeconds < 3600) {
            $minutes = now()->diffInMinutes($this->last_seen_at);
            return "Last seen {$minutes} minute" . ($minutes === 1 ? '' : 's') . ' ago';
        }
        if ($diffSeconds < 86400) {
            $hours = now()->diffInHours($this->last_seen_at);
            return "Last seen {$hours} hour" . ($hours === 1 ? '' : 's') . ' ago';
        }
        if ($diffSeconds < 604800) {
            $days = now()->diffInDays($this->last_seen_at);
            return "Last seen {$days} day" . ($days === 1 ? '' : 's') . ' ago';
        }

        return 'Last seen over a week ago';
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('account_status', self::STATUS_ACTIVE);
    }

    public function scopeKycApproved($query)
    {
        return $query->where('kyc_status', self::KYC_APPROVED);
    }

    public function scopeBusinessDirectory($query)
    {
        return $query->where('always_available', true)
                     ->where('account_status', self::STATUS_ACTIVE)
                     ->where('kyc_status', self::KYC_APPROVED);
    }

    public function scopeAlwaysAvailable($query)
    {
        return $query->where('always_available', true);
    }

    public function scopePublicProfile($query)
    {
        return $query->where('profile_visibility', self::VISIBILITY_PUBLIC);
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function notificationPreferences()
    {
        return $this->hasOne(UserNotificationPreference::class);
    }

    public function documents()
    {
        return $this->hasMany(UserDocument::class);
    }

    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class)->withoutTrashed();
    }

    public function primaryBankAccount()
    {
        return $this->hasOne(BankAccount::class)->where('is_primary', true)->withoutTrashed();
    }

    public function savedRecipients()
    {
        return $this->hasMany(SavedRecipient::class)->withoutTrashed();
    }

    public function orderTemplates()
    {
        return $this->hasMany(OrderTemplate::class)->withoutTrashed();
    }

    public function recurringOrders()
    {
        return $this->hasMany(RecurringOrder::class);
    }

    public function rateAlerts()
    {
        return $this->hasMany(RateAlert::class);
    }

    public function swapOrders()
    {
        return $this->hasMany(SwapOrder::class)->withoutTrashed();
    }

    public function sentMatches()
    {
        // Matches where this user is the sender (send_to_zim side)
        return $this->hasManyThrough(SwapMatch::class, SwapOrder::class, 'user_id', 'send_order_id');
    }

    public function trustedContacts()
    {
        return $this->hasMany(TrustedContact::class);
    }

    public function trustedBy()
    {
        return $this->hasMany(TrustedContact::class, 'trusted_user_id');
    }

    public function loginActivity()
    {
        return $this->hasMany(LoginActivity::class)->orderByDesc('login_at');
    }

    public function badges()
    {
        return $this->hasMany(UserBadge::class)->where('is_visible', true);
    }

    public function reviews()
    {
        return $this->hasMany(UserReview::class, 'reviewed_user_id')->where('is_visible', true);
    }

    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function feeDiscounts()
    {
        return $this->hasMany(FeeDiscount::class)->where('uses_remaining', '>', 0);
    }

    public function reports()
    {
        return $this->hasMany(UserReport::class, 'reported_user_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Check if this user can trade (KYC + account status).
     */
    public function canTrade(): bool
    {
        return $this->kyc_status === self::KYC_APPROVED
            && $this->account_status === self::STATUS_ACTIVE;
    }

    /**
     * Get the maximum order amount for this user based on their KYC tier.
     */
    public function getMaxOrderAmountAud(): float
    {
        if ($this->successful_trades >= 20) {
            return self::TIER_3_MAX_AUD;
        }
        if ($this->successful_trades >= 5) {
            return self::TIER_2_MAX_AUD;
        }
        return self::TIER_1_MAX_AUD;
    }

    /**
     * Check if this user is trusted by another user.
     */
    public function isTrustedBy(User $other): bool
    {
        return TrustedContact::where('user_id', $other->id)
            ->where('trusted_user_id', $this->id)
            ->exists();
    }
    /**
     * Stamp last_seen_at without dirtying updated_at.
     * Called by EscrowService::releaseFunds() after transaction completion.
     */
    public function updateLastSeen(): void
    {
        $this->timestamps   = false;
        $this->last_seen_at = now();
        $this->save();
        $this->timestamps   = true;
    }

}
