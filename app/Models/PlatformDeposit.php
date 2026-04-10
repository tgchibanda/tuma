<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformDeposit extends Model
{
    const STATUS_PENDING  = 'pending';
    const STATUS_VERIFIED = 'verified';
    const STATUS_RELEASED = 'released';
    const STATUS_REFUNDED = 'refunded';
    protected $fillable = ['swap_match_id', 'depositor_user_id', 'amount_aud', 'our_bank_reference', 'depositor_reference', 'proof_file', 'proof_uploaded_at', 'status', 'verified_by', 'verified_at', 'released_at', 'refunded_at', 'admin_notes'];
    protected $casts = ['amount_aud' => 'decimal:2', 'proof_uploaded_at' => 'datetime', 'verified_at' => 'datetime', 'released_at' => 'datetime', 'refunded_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function depositor()
    {
        return $this->belongsTo(User::class, 'depositor_user_id');
    }
    public function verifiedByAdmin()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
    public function scopePending($q)
    {
        return $q->where('status', self::STATUS_PENDING);
    }
}