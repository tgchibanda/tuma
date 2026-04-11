<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RateAlert extends Model {
    protected $fillable = ['user_id','from_currency','to_currency','target_rate','direction','is_active','triggered_at','notify_once'];
    protected $casts = ['target_rate' => 'decimal:8','is_active' => 'boolean','triggered_at' => 'datetime','notify_once' => 'boolean'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function scopeActive($query) { return $query->where('is_active', 1); }
    public function scopeForPair($query, string $from, string $to) { return $query->where('from_currency', $from)->where('to_currency', $to); }
    public function shouldTrigger(float $newRate): bool {
        return $this->direction === 'above' ? $newRate >= $this->target_rate : $newRate <= $this->target_rate;
    }
}
