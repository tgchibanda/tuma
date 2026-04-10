<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeDiscount extends Model
{
    const SOURCE_REFERRAL    = 'referral';
    const SOURCE_PROMOTION   = 'promotion';
    const SOURCE_ADMIN       = 'admin';
    const SOURCE_BOOST_REFUND= 'boost_refund';

    protected $table = 'fee_discounts';

    protected $fillable = [
        'user_id', 'source', 'discount_percent', 'max_uses',
        'uses_remaining', 'expires_at', 'applied_to_match_id',
    ];

    protected $casts = [
        'discount_percent'   => 'decimal:2',
        'expires_at'         => 'datetime',
        'uses_remaining'     => 'integer',
        'max_uses'           => 'integer',
    ];

    public function user()           { return $this->belongsTo(User::class); }
    public function appliedToMatch() { return $this->belongsTo(SwapMatch::class, 'applied_to_match_id'); }

    public function scopeAvailable($query)
    {
        return $query->where('uses_remaining', '>', 0)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                     });
    }

    public function isValid(): bool
    {
        if ($this->uses_remaining <= 0) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        return true;
    }
}
