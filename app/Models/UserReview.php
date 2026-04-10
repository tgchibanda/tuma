<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserReview extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['reviewer_id', 'reviewed_user_id', 'swap_match_id', 'score', 'review_text', 'is_visible'];
    protected $casts = ['is_visible' => 'boolean', 'created_at' => 'datetime'];
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
    public function reviewedUser()
    {
        return $this->belongsTo(User::class, 'reviewed_user_id');
    }
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function scopeVisible($q)
    {
        return $q->where('is_visible', 1);
    }
}