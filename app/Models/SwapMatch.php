<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SwapMatch extends Model
{
    // ── Status constants ───────────────────────────────────────────────────
    const STATUS_PROPOSED                   = 'proposed';
    const STATUS_NEGOTIATING                = 'negotiating';
    const STATUS_RATE_AGREED                = 'rate_agreed';
    const STATUS_DELIVERY_METHOD_SELECTING  = 'delivery_method_selecting';
    const STATUS_AGREED                     = 'agreed';
    const STATUS_AWAITING_DEPOSIT           = 'awaiting_deposit';
    const STATUS_DEPOSIT_UPLOADED           = 'deposit_uploaded';
    const STATUS_DEPOSIT_VERIFIED           = 'deposit_verified';
    const STATUS_AWAITING_DELIVERY          = 'awaiting_delivery';
    const STATUS_AWAITING_RISK_DELIVERY     = 'awaiting_risk_delivery';
    const STATUS_RISK_DELIVERY_UPLOADED     = 'risk_delivery_uploaded';
    const STATUS_AWAITING_RISK_CONFIRMATION = 'awaiting_risk_confirmation';
    const STATUS_RISK_CONFIRMED             = 'risk_confirmed';
    const STATUS_AWAITING_RISK_DEPOSIT      = 'awaiting_risk_deposit';
    const STATUS_RISK_DEPOSIT_UPLOADED      = 'risk_deposit_uploaded';
    const STATUS_RISK_DEPOSIT_VERIFIED      = 'risk_deposit_verified';
    const STATUS_DELIVERING                 = 'delivering';
    const STATUS_DELIVERY_UPLOADED          = 'delivery_uploaded';
    const STATUS_AWAITING_CONFIRMATION      = 'awaiting_confirmation';
    const STATUS_CONFIRMED                  = 'confirmed';
    const STATUS_RELEASING                  = 'releasing';
    const STATUS_COMPLETED                  = 'completed';
    const STATUS_DISPUTED                   = 'disputed';
    const STATUS_CANCELLED                  = 'cancelled';
    const STATUS_REFUNDED                   = 'refunded';

    protected $fillable = [
        'ulid',
        'send_order_id', 'receive_order_id',
        'agreed_aud', 'agreed_usd',
        'exchange_rate_id',
        'platform_fee_aud',
        'proposed_aud', 'proposed_usd',
        'proposed_by', 'proposed_at',
        'negotiation_rounds', 'max_negotiation_rounds',
        'delivery_method',
        'delivery_method_proposed_by', 'delivery_method_proposed_at',
        'delivery_method_confirmed_by', 'delivery_method_confirmed_at',
        'risk_payout_method',
        'delivery_method_agreed', 'delivery_method_agreed_at',
        'status',
        'initiated_by', 'initiated_at',
        'agreed_by_send', 'agreed_by_receive', 'agreed_at',
        'deposit_uploaded_at', 'deposit_verified_at',
        'delivery_uploaded_at', 'confirmed_at',
        'completed_at', 'refunded_at',
        'verified_by', 'released_by',
        'admin_notes',
    ];

    protected $casts = [
        'agreed_aud'                  => 'decimal:2',
        'agreed_usd'                  => 'decimal:2',
        'platform_fee_aud'            => 'decimal:2',
        'proposed_aud'                => 'decimal:2',
        'proposed_usd'                => 'decimal:2',
        'agreed_by_send'              => 'boolean',
        'agreed_by_receive'           => 'boolean',
        'delivery_method_agreed'      => 'boolean',
        'proposed_at'                 => 'datetime',
        'agreed_at'                   => 'datetime',
        'deposit_uploaded_at'         => 'datetime',
        'deposit_verified_at'         => 'datetime',
        'delivery_uploaded_at'        => 'datetime',
        'confirmed_at'                => 'datetime',
        'completed_at'                => 'datetime',
        'refunded_at'                 => 'datetime',
        'delivery_method_proposed_at' => 'datetime',
        'delivery_method_confirmed_at'=> 'datetime',
        'delivery_method_agreed_at'   => 'datetime',
        'initiated_at'                => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function sendOrder(): BelongsTo
    {
        return $this->belongsTo(SwapOrder::class, 'send_order_id');
    }

    public function receiveOrder(): BelongsTo
    {
        return $this->belongsTo(SwapOrder::class, 'receive_order_id');
    }

    public function exchangeRate(): BelongsTo
    {
        return $this->belongsTo(ExchangeRate::class);
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    public function proposedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function releasedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'released_by');
    }

    public function negotiations(): HasMany
    {
        return $this->hasMany(MatchNegotiation::class)->orderBy('created_at');
    }

    public function deposit(): HasOne
    {
        return $this->hasOne(PlatformDeposit::class);
    }

    public function delivery(): HasOne
    {
        return $this->hasOne(CashDelivery::class);
    }

    public function dispute(): HasOne
    {
        return $this->hasOne(Dispute::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TransactionMessage::class)->orderBy('created_at');
    }

    public function feedEntry(): HasOne
    {
        return $this->hasOne(PublicTransactionFeed::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
            self::STATUS_REFUNDED,
        ]);
    }

    public function scopePendingDeposit($query)
    {
        return $query->whereIn('status', [
            self::STATUS_DEPOSIT_UPLOADED,
            self::STATUS_RISK_DEPOSIT_UPLOADED,
        ]);
    }

    public function scopePendingRelease($query)
    {
        return $query->whereIn('status', [
            self::STATUS_CONFIRMED,
            self::STATUS_RISK_DEPOSIT_VERIFIED,
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    /**
     * Get the TM-XXXXXXXX deposit reference for this match.
     */
    public function getDepositReference(): string
    {
        return 'TM-' . strtoupper(substr($this->ulid, 0, 8));
    }

    /**
     * Determine if a given user ID is the sender in this match.
     */
    public function isSender(int $userId): bool
    {
        return $this->sendOrder?->user_id === $userId;
    }

    /**
     * Get the role of a user in this match: 'sender', 'receiver', or null.
     */
    public function roleFor(int $userId): ?string
    {
        if ($this->sendOrder?->user_id === $userId) return 'sender';
        if ($this->receiveOrder?->user_id === $userId) return 'receiver';
        return null;
    }

    /**
     * Whether it is a given user's turn to respond in negotiation.
     */
    public function isMyTurnToNegotiate(int $userId): bool
    {
        if (! in_array($this->status, [self::STATUS_PROPOSED, self::STATUS_NEGOTIATING])) {
            return false;
        }
        return $this->proposed_by !== $userId;
    }

    /**
     * Human-readable status label.
     */
    public function getStatusLabelAttribute(): string
    {
        $map = [
            self::STATUS_PROPOSED                   => 'Match Proposed',
            self::STATUS_NEGOTIATING                => 'Negotiating Rate',
            self::STATUS_RATE_AGREED                => 'Rate Agreed',
            self::STATUS_DELIVERY_METHOD_SELECTING  => 'Choosing Delivery Method',
            self::STATUS_AGREED                     => 'Agreed',
            self::STATUS_AWAITING_DEPOSIT           => 'Awaiting AUD Deposit',
            self::STATUS_DEPOSIT_UPLOADED           => 'Deposit Proof Submitted',
            self::STATUS_DEPOSIT_VERIFIED           => 'Deposit Verified',
            self::STATUS_AWAITING_DELIVERY          => 'Cash Being Delivered',
            self::STATUS_AWAITING_RISK_DELIVERY     => 'Risk Delivery in Progress',
            self::STATUS_RISK_DELIVERY_UPLOADED     => 'Risk Delivery Proof Submitted',
            self::STATUS_AWAITING_RISK_CONFIRMATION => 'Awaiting Receipt Confirmation',
            self::STATUS_RISK_CONFIRMED             => 'Receipt Confirmed',
            self::STATUS_AWAITING_RISK_DEPOSIT      => 'Awaiting AUD Deposit (Risk)',
            self::STATUS_RISK_DEPOSIT_UPLOADED      => 'Risk Deposit Proof Submitted',
            self::STATUS_RISK_DEPOSIT_VERIFIED      => 'Risk Deposit Verified',
            self::STATUS_CONFIRMED                  => 'Confirmed — Releasing Funds',
            self::STATUS_COMPLETED                  => 'Completed',
            self::STATUS_DISPUTED                   => 'Disputed',
            self::STATUS_CANCELLED                  => 'Cancelled',
            self::STATUS_REFUNDED                   => 'Refunded',
        ];

        return $map[$this->status] ?? $this->status;
    }
}
