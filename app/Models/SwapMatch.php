<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Symfony\Component\Uid\Ulid;

class SwapMatch extends Model
{
    const STATUS_PROPOSED                  = 'proposed';
    const STATUS_NEGOTIATING               = 'negotiating';
    const STATUS_RATE_AGREED               = 'rate_agreed';
    const STATUS_DELIVERY_METHOD_SELECTING = 'delivery_method_selecting';
    const STATUS_AGREED                    = 'agreed';
    const STATUS_AWAITING_DEPOSIT          = 'awaiting_deposit';
    const STATUS_DEPOSIT_UPLOADED          = 'deposit_uploaded';
    const STATUS_DEPOSIT_VERIFIED          = 'deposit_verified';
    const STATUS_AWAITING_DELIVERY         = 'awaiting_delivery';
    const STATUS_AWAITING_RISK_DELIVERY    = 'awaiting_risk_delivery';
    const STATUS_RISK_DELIVERY_UPLOADED    = 'risk_delivery_uploaded';
    const STATUS_AWAITING_RISK_CONFIRMATION = 'awaiting_risk_confirmation';
    const STATUS_RISK_CONFIRMED            = 'risk_confirmed';
    const STATUS_AWAITING_RISK_DEPOSIT     = 'awaiting_risk_deposit';
    const STATUS_RISK_DEPOSIT_UPLOADED     = 'risk_deposit_uploaded';
    const STATUS_RISK_DEPOSIT_VERIFIED     = 'risk_deposit_verified';
    const STATUS_DELIVERING                = 'delivering';
    const STATUS_DELIVERY_UPLOADED         = 'delivery_uploaded';
    const STATUS_AWAITING_CONFIRMATION     = 'awaiting_confirmation';
    const STATUS_CONFIRMED                 = 'confirmed';
    const STATUS_RELEASING                 = 'releasing';
    const STATUS_COMPLETED                 = 'completed';
    const STATUS_DISPUTED                  = 'disputed';
    const STATUS_CANCELLED                 = 'cancelled';
    const STATUS_REFUNDED                  = 'refunded';
    const METHOD_PENDING = 'pending';
    const METHOD_SECURE  = 'secure';
    const METHOD_RISK    = 'risk';

    protected $fillable = [
        'ulid',
        'send_order_id',
        'receive_order_id',
        'agreed_aud',
        'agreed_usd',
        'exchange_rate_id',
        'platform_fee_aud',
        'proposed_aud',
        'proposed_usd',
        'proposed_by',
        'proposed_at',
        'negotiation_rounds',
        'max_negotiation_rounds',
        'delivery_method',
        'delivery_method_proposed_by',
        'delivery_method_proposed_at',
        'delivery_method_confirmed_by',
        'delivery_method_confirmed_at',
        'risk_payout_method',
        'delivery_method_agreed',
        'delivery_method_agreed_at',
        'status',
        'initiated_by',
        'initiated_at',
        'agreed_by_send',
        'agreed_by_receive',
        'agreed_at',
        'deposit_uploaded_at',
        'deposit_verified_at',
        'delivery_uploaded_at',
        'confirmed_at',
        'completed_at',
        'refunded_at',
        'verified_by',
        'released_by',
        'admin_notes',
    ];

    protected $casts = [
        'agreed_aud'                  => 'decimal:2',
        'agreed_usd'                  => 'decimal:2',
        'proposed_aud'                => 'decimal:2',
        'proposed_usd'                => 'decimal:2',
        'platform_fee_aud'            => 'decimal:2',
        'proposed_at'                 => 'datetime',
        'initiated_at'                => 'datetime',
        'agreed_at'                   => 'datetime',
        'deposit_uploaded_at'         => 'datetime',
        'deposit_verified_at'         => 'datetime',
        'delivery_uploaded_at'        => 'datetime',
        'confirmed_at'                => 'datetime',
        'completed_at'                => 'datetime',
        'refunded_at'                 => 'datetime',
        'delivery_method_proposed_at' => 'datetime',
        'delivery_method_confirmed_at' => 'datetime',
        'delivery_method_agreed_at'   => 'datetime',
        'agreed_by_send'              => 'boolean',
        'agreed_by_receive'           => 'boolean',
        'delivery_method_agreed'      => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->ulid = (string) Ulid::generate());
    }

    public function sendOrder()
    {
        return $this->belongsTo(SwapOrder::class, 'send_order_id');
    }
    public function receiveOrder()
    {
        return $this->belongsTo(SwapOrder::class, 'receive_order_id');
    }
    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }
    public function proposedByUser()
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }
    public function verifiedByAdmin()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
    public function releasedByAdmin()
    {
        return $this->belongsTo(User::class, 'released_by');
    }
    public function exchangeRate()
    {
        return $this->belongsTo(ExchangeRate::class);
    }
    public function negotiations()
    {
        return $this->hasMany(MatchNegotiation::class)->orderBy('created_at');
    }
    public function deposit()
    {
        return $this->hasOne(PlatformDeposit::class);
    }
    public function cashDelivery()
    {
        return $this->hasOne(CashDelivery::class);
    }
    public function dispute()
    {
        return $this->hasOne(Dispute::class);
    }
    public function messages()
    {
        return $this->hasMany(TransactionMessage::class)->orderBy('created_at');
    }
    public function reviews()
    {
        return $this->hasMany(UserReview::class);
    }
    public function feedback()
    {
        return $this->hasMany(TransactionFeedback::class);
    }

    public function scopeActive($q)
    {
        return $q->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }
    public function scopeCompleted($q)
    {
        return $q->where('status', self::STATUS_COMPLETED);
    }
    public function scopePendingAdminAction($q)
    {
        return $q->whereIn('status', [self::STATUS_DEPOSIT_UPLOADED, self::STATUS_CONFIRMED, self::STATUS_RISK_DEPOSIT_UPLOADED]);
    }

    public function isSecure(): bool
    {
        return $this->delivery_method === self::METHOD_SECURE;
    }
    public function isRisk(): bool
    {
        return $this->delivery_method === self::METHOD_RISK;
    }
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }
    public function canChat(): bool
    {
        return !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_REFUNDED]);
    }
    public function getDepositReference(): string
    {
        return 'TM-' . strtoupper(substr($this->ulid, 0, 8));
    }
}