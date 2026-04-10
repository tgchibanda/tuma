<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    const STATUS_OPEN             = 'open';
    const STATUS_UNDER_REVIEW     = 'under_review';
    const STATUS_RESOLVED_SENDER  = 'resolved_sender';
    const STATUS_RESOLVED_RECEIVER = 'resolved_receiver';
    const STATUS_REFUNDED         = 'refunded';
    const STATUS_CLOSED           = 'closed';
    protected $fillable = ['swap_match_id', 'raised_by', 'reason', 'status', 'resolution_notes', 'resolved_by', 'resolved_at'];
    protected $casts = ['resolved_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function raisedByUser()
    {
        return $this->belongsTo(User::class, 'raised_by');
    }
    public function resolvedByUser()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
    public function messages()
    {
        return $this->hasMany(DisputeMessage::class)->orderBy('created_at');
    }
    public function scopeOpen($q)
    {
        return $q->where('status', self::STATUS_OPEN);
    }
    public function scopeUnderReview($q)
    {
        return $q->where('status', self::STATUS_UNDER_REVIEW);
    }
}