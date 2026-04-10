<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginActivity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'location_country',
        'location_city',
        'is_new_device',
        'login_at',
    ];

    protected $casts = [
        'login_at'      => 'datetime',
        'is_new_device' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// Save as: app/Models/AuditLog.php
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'risk_flag',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeRiskFlagged($query)
    {
        return $query->whereNotNull('risk_flag');
    }
}
