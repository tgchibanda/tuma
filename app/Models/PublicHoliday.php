<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicHoliday extends Model
{
    protected $table = 'public_holidays';

    protected $fillable = [
        'country_id', 'name', 'holiday_date', 'description', 'affects_deliveries',
    ];

    protected $casts = [
        'holiday_date'       => 'date',
        'affects_deliveries' => 'boolean',
    ];

    public function country() { return $this->belongsTo(Country::class); }

    public function scopeUpcoming($query, int $days = 7)
    {
        return $query->whereBetween('holiday_date', [now()->toDateString(), now()->addDays($days)->toDateString()]);
    }

    public function scopeAffectsDeliveries($query)
    {
        return $query->where('affects_deliveries', true);
    }
}
