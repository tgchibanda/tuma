<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecurringOrder extends Model
{
    const FREQUENCY_WEEKLY      = 'weekly';
    const FREQUENCY_FORTNIGHTLY = 'fortnightly';
    const FREQUENCY_MONTHLY     = 'monthly';

    protected $table = 'recurring_orders';

    protected $fillable = [
        'user_id', 'order_template_id', 'frequency',
        'next_run_at', 'last_run_at', 'run_count',
        'is_active', 'paused_at', 'pause_reason',
    ];

    protected $casts = [
        'next_run_at' => 'datetime',
        'last_run_at' => 'datetime',
        'paused_at'   => 'datetime',
        'is_active'   => 'boolean',
    ];

    public function user()          { return $this->belongsTo(User::class); }
    public function orderTemplate() { return $this->belongsTo(OrderTemplate::class); }
    public function swapOrders()    { return $this->hasMany(SwapOrder::class); }

    public function scopeActive($query) { return $query->where('is_active', true); }
    public function scopeDue($query)    { return $query->where('next_run_at', '<=', now())->where('is_active', true); }

    /**
     * Calculate next run date based on frequency.
     */
    public function calculateNextRunAt(): \Carbon\Carbon
    {
        $base = $this->next_run_at ?? now();
        return match($this->frequency) {
            self::FREQUENCY_WEEKLY      => $base->addWeek(),
            self::FREQUENCY_FORTNIGHTLY => $base->addWeeks(2),
            self::FREQUENCY_MONTHLY     => $base->addMonth(),
        };
    }
}
