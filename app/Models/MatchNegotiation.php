<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchNegotiation extends Model
{
    const UPDATED_AT = null;
    const STATUS_PENDING  = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_COUNTERED = 'countered';
    const STATUS_REJECTED = 'rejected';
    protected $fillable = ['swap_match_id', 'proposed_by', 'proposed_aud', 'proposed_usd', 'message', 'status', 'responded_at'];
    protected $casts = ['proposed_aud' => 'decimal:2', 'proposed_usd' => 'decimal:2', 'responded_at' => 'datetime', 'created_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function proposedByUser()
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }
    public function scopePending($q)
    {
        return $q->where('status', self::STATUS_PENDING);
    }
}