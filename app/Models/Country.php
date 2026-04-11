<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model {
    protected $fillable = ['name','iso_code','currency_code','currency_symbol','currency_name','flag_emoji','is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function users(): HasMany { return $this->hasMany(User::class); }
    public function deliveryLocations(): HasMany { return $this->hasMany(DeliveryLocation::class); }
}
