<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderBoost extends Model {
    public $timestamps = false;
    protected $fillable = ['swap_order_id','user_id','boost_fee_aud','boosted_at','expires_at','is_active'];
    protected $casts = ['boost_fee_aud' => 'decimal:2','boosted_at' => 'datetime','expires_at' => 'datetime','is_active' => 'boolean'];
    public function swapOrder(): BelongsTo { return $this->belongsTo(SwapOrder::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
