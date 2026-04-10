<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryLocation extends Model
{
    protected $fillable = ['country_id', 'name', 'slug', 'province', 'is_active', 'sort_order'];
    protected $casts = ['is_active' => 'boolean'];
    public function country()
    {
        return $this->belongsTo(Country::class);
    }
    public function swapOrders()
    {
        return $this->hasMany(SwapOrder::class, 'zim_delivery_location_id');
    }
    public function cashDeliveries()
    {
        return $this->hasMany(CashDelivery::class, 'delivery_location_id');
    }
    public function savedRecipients()
    {
        return $this->hasMany(SavedRecipient::class, 'delivery_location_id');
    }
    public function deliveryTimeEstimates()
    {
        return $this->hasMany(DeliveryTimeEstimate::class);
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1)->orderBy('sort_order');
    }
}