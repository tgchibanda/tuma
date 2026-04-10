<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserReport extends Model
{
    const STATUS_PENDING  = 'pending';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_DISMISSED = 'dismissed';
    const STATUS_ACTIONED = 'actioned';
    protected $fillable = ['reporter_id', 'reported_user_id', 'reason', 'details', 'swap_match_id', 'status', 'reviewed_by', 'reviewed_at', 'admin_notes'];
    protected $casts = ['reviewed_at' => 'datetime'];
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function reviewedByAdmin()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
    public function scopePending($q)
    {
        return $q->where('status', self::STATUS_PENDING);
    }
}