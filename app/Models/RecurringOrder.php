<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurringOrder extends Model
{
    protected $fillable = ['user_id', 'order_template_id', 'frequency', 'next_run_at', 'last_run_at', 'run_count', 'is_active', 'paused_at', 'pause_reason'];
    protected $casts = ['next_run_at' => 'datetime', 'last_run_at' => 'datetime', 'paused_at' => 'datetime', 'is_active' => 'boolean'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function template()
    {
        return $this->belongsTo(OrderTemplate::class, 'order_template_id');
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
    public function scopeDue($q)
    {
        return $q->active()->where('next_run_at', '<=', now());
    }
}