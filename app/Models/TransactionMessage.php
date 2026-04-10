<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionMessage extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['swap_match_id', 'sender_id', 'message', 'attachment', 'is_read', 'read_at'];
    protected $casts = ['is_read' => 'boolean', 'read_at' => 'datetime', 'created_at' => 'datetime'];
    public function swapMatch()
    {
        return $this->belongsTo(SwapMatch::class);
    }
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function scopeUnread($q)
    {
        return $q->where('is_read', 0);
    }
}