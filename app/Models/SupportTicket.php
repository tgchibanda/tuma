<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $table = 'support_tickets';

    protected $fillable = [
        'user_id', 'subject', 'category', 'status', 'priority',
        'match_ulid', 'admin_notes', 'assigned_to', 'resolved_at',
    ];

    protected $casts = ['resolved_at' => 'datetime'];

    public function user()     { return $this->belongsTo(User::class); }
    public function assignee() { return $this->belongsTo(User::class, 'assigned_to'); }
    public function messages() { return $this->hasMany(SupportTicketMessage::class, 'ticket_id')->orderBy('created_at'); }
}
