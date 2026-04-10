<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryTimeEstimate extends Model
{
    public $timestamps = false;
    protected $fillable = ['user_id', 'delivery_location_id', 'avg_delivery_minutes', 'sample_count', 'last_calculated_at'];
    protected $casts = ['last_calculated_at' => 'datetime'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocation::class);
    }
    public function getFormattedEstimate(): string
    {
        if (!$this->avg_delivery_minutes) return 'Unknown';
        $hours = floor($this->avg_delivery_minutes / 60);
        $mins  = $this->avg_delivery_minutes % 60;
        return $hours > 0 ? "{$hours}h {$mins}m" : "{$mins} mins";
    }
}