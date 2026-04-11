<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginActivity extends Model {
    public $timestamps = false;
    protected $fillable = ['user_id','ip_address','user_agent','device_type','location_country','location_city','is_new_device','login_at'];
    protected $casts = ['is_new_device' => 'boolean','login_at' => 'datetime'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
