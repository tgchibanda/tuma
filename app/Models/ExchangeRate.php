<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'from_currency', 'to_currency', 'rate', 'source', 'is_active',
    ];

    protected $casts = [
        'rate'       => 'decimal:8',
        'is_active'  => 'boolean',
        'created_at' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForPair($query, string $from, string $to)
    {
        return $query->where('from_currency', strtoupper($from))
                     ->where('to_currency', strtoupper($to));
    }

    /**
     * Get the currently active rate for a currency pair.
     */
    public static function currentRate(string $from, string $to): ?self
    {
        return static::active()->forPair($from, $to)->latest('created_at')->first();
    }
}
