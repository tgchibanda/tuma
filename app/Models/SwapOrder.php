<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Symfony\Component\Uid\Ulid;

class SwapOrder extends Model
{
    use SoftDeletes;

    const TYPE_SEND    = 'send_to_zim';
    const TYPE_RECEIVE = 'receive_from_zim';
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
        'ulid',
        'user_id',
        'order_type',
        'amount_aud',
        'amount_usd',
        'exchange_rate_id',
        'platform_fee_aud',
        'platform_fee_percent',
        'zim_recipient_name',
        'zim_recipient_phone',
        'zim_delivery_location_id',
        'zim_delivery_address',
        'zim_delivery_notes',
        'aud_recipient_name',
        'aud_bank_account_id',
        'status',
        'is_boosted',
        'boost_expires_at',
        'template_id',
        'recurring_order_id',
        'fee_discount_id',
        'discounted_fee_aud',
        'expires_at',
        'cancelled_reason',
        'cancelled_by',
    ];

    protected $casts = [
        'amount_aud'       => 'decimal:2',
        'amount_usd'       => 'decimal:2',
        'platform_fee_aud' => 'decimal:2',
        'is_boosted'       => 'boolean',
        'expires_at'       => 'datetime',
        'boost_expires_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->ulid = (string) Ulid::generate());
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocation::class, 'zim_delivery_location_id');
    }
    public function audBankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'aud_bank_account_id');
    }
    public function exchangeRate()
    {
        return $this->belongsTo(ExchangeRate::class);
    }
    public function template()
    {
        return $this->belongsTo(OrderTemplate::class);
    }
    public function recurringOrder()
    {
        return $this->belongsTo(RecurringOrder::class);
    }
    public function sendMatches()
    {
        return $this->hasMany(SwapMatch::class, 'send_order_id');
    }
    public function receiveMatches()
    {
        return $this->hasMany(SwapMatch::class, 'receive_order_id');
    }
    public function boosts()
    {
        return $this->hasMany(OrderBoost::class);
    }

    public function scopeOpen($q)
    {
        return $q->where('status', self::STATUS_OPEN);
    }
    public function scopeCompleted($q)
    {
        return $q->where('status', self::STATUS_COMPLETED);
    }
    public function scopeCancelled($q)
    {
        return $q->where('status', self::STATUS_CANCELLED);
    }
    public function scopeActive($q)
    {
        return $q->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_EXPIRED]);
    }
    public function scopeSendToZim($q)
    {
        return $q->where('order_type', self::TYPE_SEND);
    }
    public function scopeReceiveFromZim($q)
    {
        return $q->where('order_type', self::TYPE_RECEIVE);
    }
    public function scopeBoosted($q)
    {
        return $q->where('is_boosted', 1)->where('boost_expires_at', '>', now());
    }
    public function isSendType(): bool
    {
        return $this->order_type === self::TYPE_SEND;
    }
    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }
    public function getOppositeType(): string
    {
        return $this->isSendType() ? self::TYPE_RECEIVE : self::TYPE_SEND;
    }
}