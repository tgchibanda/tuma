<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformDeposit extends Model {
    protected $fillable = ['swap_match_id','depositor_user_id','amount_aud','our_bank_reference','depositor_reference','proof_file','proof_uploaded_at','status','verified_by','verified_at','released_at','refunded_at','admin_notes'];
    protected $casts = ['amount_aud' => 'decimal:2','proof_uploaded_at' => 'datetime','verified_at' => 'datetime','released_at' => 'datetime','refunded_at' => 'datetime'];
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
    public function verifiedBy(): BelongsTo { return $this->belongsTo(User::class, 'verified_by'); }
}
