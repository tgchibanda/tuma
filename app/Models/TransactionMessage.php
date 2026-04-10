<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionMessage extends Model
{
    public $timestamps = false;

    protected $table = 'transaction_messages';

    protected $fillable = [
        'swap_match_id', 'sender_id', 'message',
        'attachment', 'is_read', 'read_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'read_at'    => 'datetime',
        'is_read'    => 'boolean',
    ];

    public function swapMatch() { return $this->belongsTo(SwapMatch::class); }
    public function sender()    { return $this->belongsTo(User::class, 'sender_id'); }

    public function scopeUnread($query) { return $query->where('is_read', false); }
}
