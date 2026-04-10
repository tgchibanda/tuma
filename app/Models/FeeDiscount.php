<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeDiscount extends Model
{
    protected $fillable = ['user_id', 'source', 'discount_percent', 'max_uses', 'uses_remaining', 'expires_at', 'applied_to_match_id'];
    protected $casts = ['discount_percent' => 'decimal:2', 'expires_at' => 'datetime'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function appliedMatch()
    {
        return $this->belongsTo(SwapMatch::class, 'applied_to_match_id');
    }
    public function scopeAvailable($q)
    {
        return $q->where('uses_remaining', '>', 0)->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }
}