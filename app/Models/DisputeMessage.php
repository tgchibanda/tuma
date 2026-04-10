<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisputeMessage extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['dispute_id', 'sender_id', 'message', 'attachment', 'is_admin_message'];
    protected $casts = ['is_admin_message' => 'boolean', 'created_at' => 'datetime'];
    public function dispute()
    {
        return $this->belongsTo(Dispute::class);
    }
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}