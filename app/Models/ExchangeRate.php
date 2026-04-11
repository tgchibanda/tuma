<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model {
    public $timestamps = false;
    protected $fillable = ['from_currency','to_currency','rate','source','is_active'];
    protected $casts = ['rate' => 'decimal:8', 'is_active' => 'boolean', 'created_at' => 'datetime'];
    const UPDATED_AT = null;
    public static function currentRate(string $from, string $to): ?self {
        return static::where('from_currency', $from)->where('to_currency', $to)->where('is_active', 1)->latest('created_at')->first();
    }
    public function getPlatformFeePercentAttribute(): float {
        return (float) SystemSetting::get('platform_fee_percent', 1.5);
    }
}
