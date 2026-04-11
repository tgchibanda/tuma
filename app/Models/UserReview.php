<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReview extends Model {
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $fillable = ['reviewer_id','reviewed_user_id','swap_match_id','score','review_text','is_visible'];
    protected $casts = ['score' => 'integer','is_visible' => 'boolean','created_at' => 'datetime'];
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewer_id'); }
    public function reviewedUser(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_user_id'); }
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
}
