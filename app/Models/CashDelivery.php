<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashDelivery extends Model
{
    const STATUS_PENDING   = 'pending';
    const STATUS_UPLOADED  = 'uploaded';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_DISPUTED  = 'disputed';

    protected $table = 'cash_deliveries';

    protected $fillable = [
        'swap_match_id',
        'deliverer_user_id',
        'amount_usd',
        'recipient_name',
        'recipient_phone',
        'delivery_location_id',
        'delivery_address',
        'recipient_id_photo',
        'recipient_id_type',
        'handover_amount_photo',
        'combined_verification_photo',
        'verification_note',
        'proof_uploaded_at',
        'usd_denominations',
        'estimated_delivery_at',
        'actual_delivery_at',
        'delivery_duration_minutes',
        'status',
        'confirmed_by',
        'confirmed_at',
        'notes',
    ];

    protected $casts = [
        'amount_usd'              => 'decimal:2',
        'proof_uploaded_at'       => 'datetime',
        'estimated_delivery_at'   => 'datetime',
        'actual_delivery_at'      => 'datetime',
        'confirmed_at'            => 'datetime',
        'usd_denominations'       => 'array',
    ];

    public function swapMatch()       { return $this->belongsTo(SwapMatch::class); }
    public function deliverer()       { return $this->belongsTo(User::class, 'deliverer_user_id'); }
    public function confirmedBy()     { return $this->belongsTo(User::class, 'confirmed_by'); }
    public function deliveryLocation(){ return $this->belongsTo(DeliveryLocation::class); }

    public function scopePending($query)   { return $query->where('status', self::STATUS_PENDING); }
    public function scopeUploaded($query)  { return $query->where('status', self::STATUS_UPLOADED); }
    public function scopeConfirmed($query) { return $query->where('status', self::STATUS_CONFIRMED); }

    /**
     * Check that at least one complete verification set has been provided.
     */
    public function hasValidProof(): bool
    {
        // Option A: both ID photo and handover amount photo
        if ($this->recipient_id_photo && $this->handover_amount_photo) {
            return true;
        }
        // Option B: single combined verification photo
        if ($this->combined_verification_photo) {
            return true;
        }
        return false;
    }
}
