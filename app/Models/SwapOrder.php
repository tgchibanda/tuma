<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Symfony\Component\Uid\Ulid;

class SwapOrder extends Model
{
    use SoftDeletes;

    // ── Status Constants ──────────────────────────────────────────────────────
    const STATUS_OPEN        = 'open';
    const STATUS_NEGOTIATING = 'negotiating';
    const STATUS_AGREED      = 'agreed';
    const STATUS_IN_ESCROW   = 'in_escrow';
    const STATUS_DELIVERING  = 'delivering';
    const STATUS_COMPLETED   = 'completed';
    const STATUS_CANCELLED   = 'cancelled';
    const STATUS_EXPIRED     = 'expired';
    const STATUS_DISPUTED    = 'disputed';

    // ── Order Types ───────────────────────────────────────────────────────────
    const TYPE_SEND_TO_ZIM      = 'send_to_zim';
    const TYPE_RECEIVE_FROM_ZIM = 'receive_from_zim';

    protected $fillable = [
        'ulid',
        'user_id',
        'order_type',
        'amount_aud',
        'amount_usd',
        'exchange_rate_id',
        'platform_fee_aud',
        'platform_fee_percent',
        'fee_discount_id',
        'discounted_fee_aud',
        'zim_recipient_name',
        'zim_recipient_phone',
        'zim_delivery_location_id',
        'zim_delivery_address',
        'zim_delivery_notes',
        'aud_recipient_name',
        'aud_bank_account_id',
        'status',
        'expires_at',
        'cancelled_reason',
        'cancelled_by',
        'is_boosted',
        'boost_expires_at',
        'template_id',
        'recurring_order_id',
    ];

    protected $casts = [
        'amount_aud'         => 'decimal:2',
        'amount_usd'         => 'decimal:2',
        'platform_fee_aud'   => 'decimal:2',
        'platform_fee_percent'=> 'decimal:2',
        'discounted_fee_aud' => 'decimal:2',
        'expires_at'         => 'datetime',
        'boost_expires_at'   => 'datetime',
        'is_boosted'         => 'boolean',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (SwapOrder $order) {
            if (empty($order->ulid)) {
                $order->ulid = (string) new Ulid();
            }
        });
    }

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeOpen($query)           { return $query->where('status', self::STATUS_OPEN); }
    public function scopeCompleted($query)      { return $query->where('status', self::STATUS_COMPLETED); }
    public function scopeCancelled($query)      { return $query->where('status', self::STATUS_CANCELLED); }
    public function scopeActive($query)         { return $query->whereIn('status', [self::STATUS_OPEN, self::STATUS_NEGOTIATING, self::STATUS_AGREED, self::STATUS_IN_ESCROW, self::STATUS_DELIVERING]); }
    public function scopeSendToZim($query)      { return $query->where('order_type', self::TYPE_SEND_TO_ZIM); }
    public function scopeReceiveFromZim($query) { return $query->where('order_type', self::TYPE_RECEIVE_FROM_ZIM); }
    public function scopeBoosted($query)        { return $query->where('is_boosted', true)->where('boost_expires_at', '>', now()); }

    public function scopeForLocation($query, int $locationId)
    {
        return $query->where('zim_delivery_location_id', $locationId);
    }

    public function scopeExpired($query)
    {
        return $query->where('status', self::STATUS_OPEN)
                     ->where('expires_at', '<', now());
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user()            { return $this->belongsTo(User::class); }
    public function exchangeRate()    { return $this->belongsTo(ExchangeRate::class); }
    public function deliveryLocation(){ return $this->belongsTo(DeliveryLocation::class, 'zim_delivery_location_id'); }
    public function bankAccount()     { return $this->belongsTo(BankAccount::class, 'aud_bank_account_id'); }
    public function cancelledBy()     { return $this->belongsTo(User::class, 'cancelled_by'); }
    public function feeDiscount()     { return $this->belongsTo(FeeDiscount::class); }
    public function template()        { return $this->belongsTo(OrderTemplate::class); }
    public function recurringOrder()  { return $this->belongsTo(RecurringOrder::class); }

    public function sendMatch()
    {
        return $this->hasOne(SwapMatch::class, 'send_order_id');
    }

    public function receiveMatch()
    {
        return $this->hasOne(SwapMatch::class, 'receive_order_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isOpen(): bool         { return $this->status === self::STATUS_OPEN; }
    public function isCompleted(): bool    { return $this->status === self::STATUS_COMPLETED; }
    public function isCancellable(): bool  { return in_array($this->status, [self::STATUS_OPEN, self::STATUS_NEGOTIATING]); }

    /**
     * Get the opposite order type.
     */
    public function oppositeType(): string
    {
        return $this->order_type === self::TYPE_SEND_TO_ZIM
            ? self::TYPE_RECEIVE_FROM_ZIM
            : self::TYPE_SEND_TO_ZIM;
    }
}
