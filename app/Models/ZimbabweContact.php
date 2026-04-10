<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZimbabweContact extends Model
{
    public $timestamps = false;
    protected $fillable = ['swap_order_id', 'recipient_phone', 'verification_code', 'verified_at', 'sms_sent_at', 'attempts'];
    protected $casts = ['verified_at' => 'datetime', 'sms_sent_at' => 'datetime'];
    public function swapOrder()
    {
        return $this->belongsTo(SwapOrder::class);
    }
    public function isVerified(): bool
    {
        return !is_null($this->verified_at);
    }
}