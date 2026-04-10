<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateAlert extends Model
{
    protected $fillable = ['user_id', 'from_currency', 'to_currency', 'target_rate', 'direction', 'is_active', 'triggered_at', 'notify_once'];
    protected $casts = ['target_rate' => 'decimal:8', 'is_active' => 'boolean', 'triggered_at' => 'datetime', 'notify_once' => 'boolean'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
}