<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicTransactionFeed extends Model
{
    public $timestamps = false;

    protected $table = 'public_transaction_feed';

    protected $fillable = [
        'swap_match_id', 'display_sender', 'display_receiver',
        'amount_aud', 'amount_usd', 'delivery_location',
        'completed_at', 'is_demo', 'is_visible',
    ];

    protected $casts = [
        'amount_aud'   => 'decimal:2',
        'amount_usd'   => 'decimal:2',
        'completed_at' => 'datetime',
        'is_demo'      => 'boolean',
        'is_visible'   => 'boolean',
    ];

    public function swapMatch() { return $this->belongsTo(SwapMatch::class); }

    public function scopeVisible($query)    { return $query->where('is_visible', true); }
    public function scopeDemo($query)       { return $query->where('is_demo', true); }
    public function scopeReal($query)       { return $query->where('is_demo', false); }
    public function scopeRecent($query)     { return $query->orderByDesc('completed_at'); }
}
