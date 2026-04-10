<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginActivity extends Model
{
    public $timestamps = false;
    protected $fillable = ['user_id', 'ip_address', 'user_agent', 'device_type', 'location_country', 'location_city', 'is_new_device', 'login_at'];
    protected $casts = ['login_at' => 'datetime', 'is_new_device' => 'boolean'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}