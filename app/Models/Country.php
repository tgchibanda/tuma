<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = ['name', 'iso_code', 'currency_code', 'currency_symbol', 'currency_name', 'flag_emoji', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function deliveryLocations()
    {
        return $this->hasMany(DeliveryLocation::class);
    }
    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class);
    }
    public function publicHolidays()
    {
        return $this->hasMany(PublicHoliday::class);
    }
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
}