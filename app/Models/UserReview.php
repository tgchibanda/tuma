<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserReview extends Model
{
    public $timestamps = false;

    protected $table = 'user_reviews';

    protected $fillable = [
        'reviewer_id', 'reviewed_user_id',
        'swap_match_id', 'score', 'review_text', 'is_visible',
    ];

    protected $casts = [
        'created_at'  => 'datetime',
        'score'       => 'integer',
        'is_visible'  => 'boolean',
    ];

    public function reviewer()     { return $this->belongsTo(User::class, 'reviewer_id'); }
    public function reviewedUser() { return $this->belongsTo(User::class, 'reviewed_user_id'); }
    public function swapMatch()    { return $this->belongsTo(SwapMatch::class); }

    public function scopeVisible($query) { return $query->where('is_visible', true); }
}
