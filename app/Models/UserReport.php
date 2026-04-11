<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReport extends Model {
    protected $fillable = ['reporter_id','reported_user_id','reason','details','swap_match_id','status','reviewed_by','reviewed_at','admin_notes'];
    protected $casts = ['reviewed_at' => 'datetime'];
    public function reporter(): BelongsTo { return $this->belongsTo(User::class, 'reporter_id'); }
    public function reportedUser(): BelongsTo { return $this->belongsTo(User::class, 'reported_user_id'); }
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
    public function reviewedBy(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by'); }
}
