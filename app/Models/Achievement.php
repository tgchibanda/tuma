<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = ['badge_key', 'badge_name', 'badge_description', 'badge_icon', 'trigger_type', 'trigger_value', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function scopeActive($q)
    {
        return $q->where('is_active', 1);
    }
}