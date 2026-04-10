<?php
// ============================================================
// FILE: app/Models/Country.php
// ============================================================
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        'name', 'iso_code', 'currency_code',
        'currency_symbol', 'currency_name', 'flag_emoji', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function deliveryLocations()
    {
        return $this->hasMany(DeliveryLocation::class);
    }

    public function activeLocations()
    {
        return $this->hasMany(DeliveryLocation::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeActive($query) { return $query->where('is_active', true); }
}
