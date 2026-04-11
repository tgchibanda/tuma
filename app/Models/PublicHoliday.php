<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicHoliday extends Model {
    protected $fillable = ['country_id','name','holiday_date','description','affects_deliveries'];
    protected $casts = ['holiday_date' => 'date','affects_deliveries' => 'boolean'];
    public function country(): BelongsTo { return $this->belongsTo(Country::class); }
    public function scopeUpcoming($query, int $days = 30) { return $query->whereBetween('holiday_date',[now()->toDateString(), now()->addDays($days)->toDateString()])->orderBy('holiday_date'); }
}
