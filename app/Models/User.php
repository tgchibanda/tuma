<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    const ROLE_USER  = 'user';
    const ROLE_ADMIN = 'admin';
    const KYC_PENDING   = 'pending';
    const KYC_SUBMITTED = 'submitted';
    const KYC_APPROVED  = 'approved';
    const KYC_REJECTED  = 'rejected';
    const STATUS_ACTIVE    = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_BANNED    = 'banned';
    const VISIBILITY_PUBLIC    = 'public';
    const VISIBILITY_ANONYMOUS = 'anonymous';
    const TYPE_PERSONAL = 'personal';
    const TYPE_BUSINESS = 'business';

    protected $fillable = [
        'ulid',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'country_id',
        'profile_photo',
        'kyc_status',
        'kyc_reference',
        'kyc_reviewed_at',
        'account_status',
        'suspension_reason',
        'account_suspended_until',
        'total_trades',
        'successful_trades',
        'rating',
        'trust_score',
        'report_count',
        'gender',
        'bio',
        'last_seen_at',
        'profile_visibility',
        'anonymous_name',
        'anonymous_location',
        'anonymous_bio',
        'account_type',
        'business_name',
        'business_description',
        'is_verified_business',
        'always_available',
        'available_locations',
        'min_amount_aud',
        'max_amount_aud',
        'two_fa_enabled',
        'two_fa_secret',
        'two_fa_method',
        'transaction_pin',
        'pin_set_at',
        'referral_code',
        'referred_by',
        'referral_count',
        'referral_earnings_aud',
        'onboarding_completed',
        'onboarding_step',
        'role',
        'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token', 'transaction_pin', 'two_fa_secret'];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'phone_verified_at'       => 'datetime',
        'kyc_reviewed_at'         => 'datetime',
        'last_seen_at'            => 'datetime',
        'last_login_at'           => 'datetime',
        'pin_set_at'              => 'datetime',
        'account_suspended_until' => 'datetime',
        'available_locations'     => 'array',
        'is_verified_business'    => 'boolean',
        'always_available'        => 'boolean',
        'two_fa_enabled'          => 'boolean',
        'onboarding_completed'    => 'boolean',
        'rating'                  => 'decimal:2',
        'min_amount_aud'          => 'decimal:2',
        'max_amount_aud'          => 'decimal:2',
        'referral_earnings_aud'   => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($user) {
            $user->ulid = (string) \Symfony\Component\Uid\Ulid::generate();
            $user->referral_code = strtoupper(Str::random(8));
        });
    }

    // Relationships
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
        return $this->hasMany(BankAccount::class);
    }
    public function swapOrders()
    {
        return $this->hasMany(SwapOrder::class);
    }
    public function savedRecipients()
    {
        return $this->hasMany(SavedRecipient::class);
    }
    public function orderTemplates()
    {
        return $this->hasMany(OrderTemplate::class);
    }
    public function recurringOrders()
    {
        return $this->hasMany(RecurringOrder::class);
    }
    public function rateAlerts()
    {
        return $this->hasMany(RateAlert::class);
    }
    public function trustedContacts()
    {
        return $this->hasMany(TrustedContact::class);
    }
    public function badges()
    {
        return $this->hasMany(UserBadge::class);
    }
    public function loginActivity()
    {
        return $this->hasMany(LoginActivity::class);
    }
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }
    public function feeDiscounts()
    {
        return $this->hasMany(FeeDiscount::class);
    }
    public function reviewsReceived()
    {
        return $this->hasMany(UserReview::class, 'reviewed_user_id');
    }
    public function referredByUser()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }
    public function deliveryTimeEstimates()
    {
        return $this->hasMany(DeliveryTimeEstimate::class);
    }

    // Scopes
    public function scopeActive($q)
    {
        return $q->where('account_status', self::STATUS_ACTIVE);
    }
    public function scopeKycApproved($q)
    {
        return $q->where('kyc_status', self::KYC_APPROVED);
    }
    public function scopeAlwaysAvailable($q)
    {
        return $q->where('always_available', 1)->where('account_status', self::STATUS_ACTIVE);
    }
    public function scopeBusiness($q)
    {
        return $q->where('account_type', self::TYPE_BUSINESS);
    }
    public function scopeVerifiedBusiness($q)
    {
        return $q->where('is_verified_business', 1);
    }
    public function scopePublicProfile($q)
    {
        return $q->where('profile_visibility', self::VISIBILITY_PUBLIC);
    }
    public function scopeAdmins($q)
    {
        return $q->where('role', self::ROLE_ADMIN);
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }
    public function isKycApproved(): bool
    {
        return $this->kyc_status === self::KYC_APPROVED;
    }
    public function isActive(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }
    public function canTrade(): bool
    {
        return $this->isKycApproved() && $this->isActive();
    }
    public function isAnonymous(): bool
    {
        return $this->profile_visibility === self::VISIBILITY_ANONYMOUS;
    }

    public function getDisplayName(): string
    {
        if ($this->isAnonymous() && $this->anonymous_name) return $this->anonymous_name;
        return $this->first_name . ' ' . substr($this->last_name, 0, 1) . '.';
    }

    public function getAvatarUrl(): string
    {
        if ($this->profile_photo) return Storage::url($this->profile_photo);
        return match ($this->gender) {
            'female' => asset('images/avatars/female.svg'),
            'male'   => asset('images/avatars/male.svg'),
            default  => asset('images/avatars/neutral.svg'),
        };
    }

    public function getLastSeenLabel(): string
    {
        if (!$this->last_seen_at) return 'Never';
        $diff = now()->diffInMinutes($this->last_seen_at);
        if ($diff < 1)  return 'Online now';
        if ($diff < 60) return "Last seen {$diff} minutes ago";
        $hours = now()->diffInHours($this->last_seen_at);
        if ($hours < 24) return "Last seen {$hours} hours ago";
        $days = now()->diffInDays($this->last_seen_at);
        if ($days < 7)  return "Last seen {$days} days ago";
        return 'Last seen over a week ago';
    }

    public function getTradingLimit(): float
    {
        if ($this->successful_trades >= 20) return 5000.00;
        if ($this->successful_trades >= 5)  return 1500.00;
        return 300.00;
    }

    public function getAnonymisedName(): string
    {
        $first = $this->first_name;
        if (strlen($first) <= 2) return $first[0] . '***';
        return $first[0] . str_repeat('*', strlen($first) - 2) . substr($first, -1);
    }
}