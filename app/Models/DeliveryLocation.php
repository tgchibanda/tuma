<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryLocation extends Model
{
    protected $fillable = [
        'country_id', 'name', 'slug', 'province', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function swapOrders()
    {
        return $this->hasMany(SwapOrder::class, 'zim_delivery_location_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForCountry($query, int $countryId)
    {
        return $query->where('country_id', $countryId);
    }

    /**
     * Check if this location currently has active open orders on either side.
     */
    public function hasActiveOrders(): bool
    {
        return SwapOrder::where('zim_delivery_location_id', $this->id)
            ->where('status', SwapOrder::STATUS_OPEN)
            ->exists();
    }
}
