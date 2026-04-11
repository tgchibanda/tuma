<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SwapOrder extends Model
{
    use SoftDeletes;

    const STATUS_OPEN        = 'open';
    const STATUS_NEGOTIATING = 'negotiating';
    const STATUS_AGREED      = 'agreed';
    const STATUS_IN_ESCROW   = 'in_escrow';
    const STATUS_DELIVERING  = 'delivering';
    const STATUS_COMPLETED   = 'completed';
    const STATUS_CANCELLED   = 'cancelled';
    const STATUS_EXPIRED     = 'expired';
    const STATUS_DISPUTED    = 'disputed';

    protected $fillable = [
        'ulid', 'user_id', 'order_type',
        'amount_aud', 'amount_usd', 'exchange_rate_id',
        'platform_fee_aud', 'platform_fee_percent',
        'fee_discount_id', 'discounted_fee_aud',
        'zim_recipient_name', 'zim_recipient_phone',
        'zim_delivery_location_id', 'zim_delivery_address', 'zim_delivery_notes',
        'aud_recipient_name', 'aud_bank_account_id',
        'status', 'expires_at',
        'cancelled_reason', 'cancelled_by',
        'is_boosted', 'boost_expires_at',
        'template_id', 'recurring_order_id',
    ];

    protected $casts = [
        'amount_aud'       => 'decimal:2',
        'amount_usd'       => 'decimal:2',
        'platform_fee_aud' => 'decimal:2',
        'expires_at'       => 'datetime',
        'boost_expires_at' => 'datetime',
        'is_boosted'       => 'boolean',
    ];

    /**
     * 🔥 Auto-generate ULID on create
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->ulid)) {
                $model->ulid = (string) Str::ulid();
            }
        });
    }

    // ── Relationships ──────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deliveryLocation(): BelongsTo
    {
        return $this->belongsTo(DeliveryLocation::class, 'zim_delivery_location_id');
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'aud_bank_account_id');
    }

    public function exchangeRate(): BelongsTo
    {
        return $this->belongsTo(ExchangeRate::class);
    }

    public function sendMatch(): HasOne
    {
        return $this->hasOne(SwapMatch::class, 'send_order_id');
    }

    public function receiveMatch(): HasOne
    {
        return $this->hasOne(SwapMatch::class, 'receive_order_id');
    }

    // ── Scopes ────────────────────────────────────────────────────────────

    public function scopeOpen($query)
    {
        return $query->where('status', self::STATUS_OPEN);
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [
            self::STATUS_CANCELLED,
            self::STATUS_EXPIRED,
            self::STATUS_COMPLETED
        ]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeBrowsable($query, int $locationId)
    {
        return $query->where('status', self::STATUS_OPEN)
            ->where('zim_delivery_location_id', $locationId)
            ->where('expires_at', '>', now())
            ->orderByDesc('is_boosted')
            ->orderByDesc('created_at');
    }
}