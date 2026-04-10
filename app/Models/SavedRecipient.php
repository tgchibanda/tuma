<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SavedRecipient extends Model
{
    use SoftDeletes;

    protected $table = 'saved_recipients';

    protected $fillable = [
        'user_id', 'nickname', 'recipient_name', 'recipient_phone',
        'delivery_location_id', 'delivery_address', 'delivery_notes',
        'is_favourite', 'use_count', 'last_used_at',
    ];

    protected $casts = [
        'is_favourite' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function user()             { return $this->belongsTo(User::class); }
    public function deliveryLocation() { return $this->belongsTo(DeliveryLocation::class); }

    public function scopeFavourites($query) { return $query->where('is_favourite', true); }

    public function incrementUseCount(): void
    {
        $this->increment('use_count');
        $this->last_used_at = now();
        $this->save();
    }
}
