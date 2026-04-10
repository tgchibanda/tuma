<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicTransactionFeed extends Model
{
    const UPDATED_AT = null;
    protected $table = 'public_transaction_feed';
    protected $fillable = ['swap_match_id', 'display_sender', 'display_receiver', 'amount_aud', 'amount_usd', 'delivery_location', 'completed_at', 'is_demo', 'is_visible'];
    protected $casts = ['amount_aud' => 'decimal:2', 'amount_usd' => 'decimal:2', 'completed_at' => 'datetime', 'is_demo' => 'boolean', 'is_visible' => 'boolean', 'created_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function scopeVisible($q)
    {
        return $q->where('is_visible', 1)->orderByDesc('completed_at');
    }
}