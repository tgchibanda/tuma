<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    const STATUS_PENDING   = 'pending';
    const STATUS_QUALIFIED = 'qualified';
    const STATUS_REWARDED  = 'rewarded';
    protected $fillable = ['referrer_id', 'referred_id', 'referral_code', 'status', 'qualified_at', 'reward_applied_at', 'referrer_discount_percent', 'referred_discount_percent'];
    protected $casts = ['qualified_at' => 'datetime', 'reward_applied_at' => 'datetime', 'referrer_discount_percent' => 'decimal:2', 'referred_discount_percent' => 'decimal:2'];
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }
    public function referred()
    {
        return $this->belongsTo(User::class, 'referred_id');
    }
}