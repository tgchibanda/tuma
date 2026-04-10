<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateHistory extends Model
{
    public $timestamps = false;
    protected $fillable = ['from_currency', 'to_currency', 'rate', 'recorded_at', 'source'];
    protected $casts = ['rate' => 'decimal:8', 'recorded_at' => 'datetime'];
    public function scopeForPair($q, $from, $to)
    {
        return $q->where('from_currency', $from)->where('to_currency', $to);
    }
    public function scopeLastDays($q, int $days)
    {
        return $q->where('recorded_at', '>=', now()->subDays($days));
    }
}