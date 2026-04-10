<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['from_currency', 'to_currency', 'rate', 'source', 'is_active'];
    protected $casts = ['rate' => 'decimal:8', 'is_active' => 'boolean', 'created_at' => 'datetime'];
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
    public function scopeForPair($q, string $from, string $to)
    {
        return $q->where('from_currency', $from)->where('to_currency', $to);
    }
    public static function currentRate(string $from, string $to): ?self
    {
        return self::active()->forPair($from, $to)->latest('created_at')->first();
    }
}