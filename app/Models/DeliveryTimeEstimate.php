<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryTimeEstimate extends Model
{
    public $timestamps = false;

    protected $table = 'delivery_time_estimates';

    protected $fillable = [
        'user_id', 'delivery_location_id',
        'avg_delivery_minutes', 'sample_count', 'last_calculated_at',
    ];

    protected $casts = [
        'last_calculated_at'   => 'datetime',
        'avg_delivery_minutes' => 'integer',
        'sample_count'         => 'integer',
    ];

    public function user()             { return $this->belongsTo(User::class); }
    public function deliveryLocation() { return $this->belongsTo(DeliveryLocation::class); }

    /**
     * Get human-readable estimate string.
     */
    public function getEstimateHumanAttribute(): string
    {
        if (! $this->avg_delivery_minutes || $this->sample_count < 2) {
            return 'Estimate not available';
        }
        $hours   = intdiv($this->avg_delivery_minutes, 60);
        $minutes = $this->avg_delivery_minutes % 60;
        if ($hours === 0) {
            return "Usually under {$minutes} minutes";
        }
        if ($minutes === 0) {
            return "Usually {$hours} hour" . ($hours > 1 ? 's' : '');
        }
        return "Usually {$hours}h {$minutes}m";
    }
}
