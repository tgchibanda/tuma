<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchNegotiation extends Model {
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $fillable = ['swap_match_id','proposed_by','proposed_aud','proposed_usd','message','status','responded_at'];
    protected $casts = ['proposed_aud' => 'decimal:2','proposed_usd' => 'decimal:2','created_at' => 'datetime','responded_at' => 'datetime'];
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
    public function proposedBy(): BelongsTo { return $this->belongsTo(User::class, 'proposed_by'); }
}
