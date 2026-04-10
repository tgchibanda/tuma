<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    const TRIGGER_TRADE_COUNT    = 'trade_count';
    const TRIGGER_RATING_AVERAGE = 'rating_average';
    const TRIGGER_ZERO_DISPUTES  = 'zero_disputes';
    const TRIGGER_RESPONSE_TIME  = 'response_time';
    const TRIGGER_MULTI_CITY     = 'multi_city';
    const TRIGGER_REFERRAL_COUNT = 'referral_count';
    const TRIGGER_ACCOUNT_AGE    = 'account_age';
    const TRIGGER_MANUAL         = 'manual';

    protected $table = 'achievements';

    protected $fillable = [
        'badge_key', 'badge_name', 'badge_description',
        'badge_icon', 'trigger_type', 'trigger_value', 'is_active',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'trigger_value' => 'integer',
    ];

    public function scopeActive($query) { return $query->where('is_active', true); }
}
