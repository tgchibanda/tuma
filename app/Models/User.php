<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // ── Status constants ───────────────────────────────────────────────────
    const STATUS_ACTIVE    = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_BANNED    = 'banned';

    // ── KYC status constants ───────────────────────────────────────────────
    const KYC_PENDING   = 'pending';
    const KYC_SUBMITTED = 'submitted';
    const KYC_APPROVED  = 'approved';
    const KYC_REJECTED  = 'rejected';

    protected $fillable = [
        'ulid', 'first_name', 'last_name',
        'email', 'email_verified_at',
        'phone', 'phone_verified_at',
        'password', 'country_id',
        'profile_photo', 'gender', 'bio',
        'last_seen_at',
        // Privacy
        'profile_visibility', 'anonymous_name', 'anonymous_location', 'anonymous_bio',
        // KYC
        'kyc_status', 'kyc_reference', 'kyc_reviewed_at',
        // Account
        'account_status', 'suspension_reason', 'account_suspended_until',
        'role',
        // Stats
        'total_trades', 'successful_trades', 'rating', 'trust_score', 'report_count',
        // Business / directory
        'account_type', 'business_name', 'business_description',
        'is_verified_business', 'always_available',
        'available_locations', 'min_amount_aud', 'max_amount_aud',
        // Security
        'two_fa_enabled', 'two_fa_secret', 'two_fa_method',
        'transaction_pin', 'pin_set_at',
        'account_suspended_until',
        // Referral
        'referral_code', 'referred_by', 'referral_count', 'referral_earnings_aud',
        // Onboarding
        'onboarding_completed', 'onboarding_step',
        'remember_token', 'last_login_at',
    ];

    protected $hidden = [
        'password', 'remember_token', 'two_fa_secret', 'transaction_pin',
    ];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'phone_verified_at'       => 'datetime',
        'last_seen_at'            => 'datetime',
        'last_login_at'           => 'datetime',
        'kyc_reviewed_at'         => 'datetime',
        'pin_set_at'              => 'datetime',
        'account_suspended_until' => 'datetime',
        'two_fa_enabled'          => 'boolean',
        'is_verified_business'    => 'boolean',
        'always_available'        => 'boolean',
        'onboarding_completed'    => 'boolean',
        'available_locations'     => 'array',
        'min_amount_aud'          => 'decimal:2',
        'max_amount_aud'          => 'decimal:2',
        'rating'                  => 'decimal:2',
        'referral_earnings_aud'   => 'decimal:2',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(BankAccount::class)->orderByDesc('is_primary');
    }

    public function notificationPreferences(): HasOne
    {
        return $this->hasOne(UserNotificationPreference::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(SwapOrder::class);
    }

    public function savedRecipients(): HasMany
    {
        return $this->hasMany(SavedRecipient::class);
    }

    public function rateAlerts(): HasMany
    {
        return $this->hasMany(RateAlert::class);
    }

    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    public function loginActivity(): HasMany
    {
        return $this->hasMany(LoginActivity::class)->orderByDesc('login_at');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(UserReport::class, 'reported_user_id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    // ── Computed attributes ────────────────────────────────────────────────

    /**
     * First name respecting visibility setting.
     */
    public function getDisplayFirstNameAttribute(): string
    {
        if ($this->profile_visibility === 'anonymous' && $this->anonymous_name) {
            return $this->anonymous_name;
        }
        return $this->first_name;
    }

    /**
     * Human-readable last seen string.
     */
    public function getLastSeenHumanAttribute(): string
    {
        if (! $this->last_seen_at) return 'Never';

        $diff = $this->last_seen_at->diffInMinutes(now());

        if ($diff < 2)       return 'Online now';
        if ($diff < 60)      return 'Last seen ' . $diff . ' minutes ago';
        if ($diff < 1440)    return 'Last seen ' . floor($diff / 60) . ' hours ago';
        if ($diff < 10080)   return 'Last seen ' . floor($diff / 1440) . ' days ago';

        return 'Last seen over a week ago';
    }

    /**
     * Redacted phone number for public display.
     */
    public function getRedactedPhoneAttribute(): string
    {
        if (! $this->phone) return '';
        return substr($this->phone, 0, 4) . str_repeat('*', strlen($this->phone) - 7) . substr($this->phone, -3);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    /**
     * Check if the user can trade.
     */
    public function canTrade(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }

    /**
     * Update last_seen_at (called from UpdateLastSeen middleware).
     */
    public function updateLastSeen(): void
    {
        $this->timestamps = false;
        $this->last_seen_at = now();
        $this->save();
        $this->timestamps = true;
    }

    /**
     * Get the user's primary Australian bank account.
     */
    public function primaryBankAccount(): ?BankAccount
    {
        return $this->bankAccounts()->where('is_primary', 1)->first();
    }
}
