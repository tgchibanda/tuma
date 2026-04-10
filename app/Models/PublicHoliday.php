<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicHoliday extends Model
{
    protected $fillable = ['country_id', 'name', 'holiday_date', 'description', 'affects_deliveries'];
    protected $casts = ['holiday_date' => 'date', 'affects_deliveries' => 'boolean'];
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
    public function scopeUpcoming($q, int $days = 7)
    {
        return $q->whereBetween('holiday_date', [now()->toDateString(), now()->addDays($days)->toDateString()]);
    }
}