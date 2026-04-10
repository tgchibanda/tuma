<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderBoost extends Model
{
    public $timestamps = false;
    protected $fillable = ['swap_order_id', 'user_id', 'boost_fee_aud', 'boosted_at', 'expires_at', 'is_active'];
    protected $casts = ['boost_fee_aud' => 'decimal:2', 'boosted_at' => 'datetime', 'expires_at' => 'datetime', 'is_active' => 'boolean'];
    public function swapOrder()
    {
        return $this->belongsTo(SwapOrder::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1)->where('expires_at', '>', now());
    }
}