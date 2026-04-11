<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryLocation extends Model {
    protected $fillable = ['country_id','name','slug','province','is_active','sort_order'];
    protected $casts = ['is_active' => 'boolean'];
    public function country(): BelongsTo { return $this->belongsTo(Country::class); }
    public function scopeActive($query) { return $query->where('is_active', 1)->orderBy('sort_order')->orderBy('name'); }
}
