<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateHistory extends Model
{
    public $timestamps = false;

    protected $table = 'rate_history';

    protected $fillable = [
        'from_currency', 'to_currency', 'rate', 'recorded_at', 'source',
    ];

    protected $casts = [
        'rate'        => 'decimal:8',
        'recorded_at' => 'datetime',
    ];

    public function scopeForPair($query, string $from, string $to)
    {
        return $query->where('from_currency', strtoupper($from))
                     ->where('to_currency', strtoupper($to));
    }

    public function scopeLastDays($query, int $days)
    {
        return $query->where('recorded_at', '>=', now()->subDays($days));
    }
}
