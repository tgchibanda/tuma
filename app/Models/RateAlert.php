<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateAlert extends Model
{
    const DIRECTION_ABOVE = 'above';
    const DIRECTION_BELOW = 'below';

    protected $table = 'rate_alerts';

    protected $fillable = [
        'user_id', 'from_currency', 'to_currency',
        'target_rate', 'direction', 'is_active',
        'triggered_at', 'notify_once',
    ];

    protected $casts = [
        'target_rate'  => 'decimal:8',
        'is_active'    => 'boolean',
        'notify_once'  => 'boolean',
        'triggered_at' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }

    public function scopeActive($query)    { return $query->where('is_active', true); }
    public function scopeForPair($query, string $from, string $to)
    {
        return $query->where('from_currency', strtoupper($from))
                     ->where('to_currency', strtoupper($to));
    }

    /**
     * Check if this alert should fire given the new rate.
     */
    public function shouldTrigger(float $newRate): bool
    {
        if (! $this->is_active) return false;
        if ($this->direction === self::DIRECTION_ABOVE) {
            return $newRate >= $this->target_rate;
        }
        return $newRate <= $this->target_rate;
    }
}
