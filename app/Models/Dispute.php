<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dispute extends Model {
    const STATUS_OPEN              = 'open';
    const STATUS_UNDER_REVIEW      = 'under_review';
    const STATUS_RESOLVED_SENDER   = 'resolved_sender';
    const STATUS_RESOLVED_RECEIVER = 'resolved_receiver';
    const STATUS_REFUNDED          = 'refunded';
    const STATUS_CLOSED            = 'closed';

    protected $fillable = ['swap_match_id','raised_by','reason','status','resolution_notes','resolved_by','resolved_at'];
    protected $casts = ['resolved_at' => 'datetime'];
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
    public function raisedBy(): BelongsTo { return $this->belongsTo(User::class, 'raised_by'); }
    public function resolvedBy(): BelongsTo { return $this->belongsTo(User::class, 'resolved_by'); }
    public function messages(): HasMany { return $this->hasMany(DisputeMessage::class)->orderBy('created_at'); }
    public function getHoursOpenAttribute(): int { return (int) $this->created_at->diffInHours(now()); }
}
