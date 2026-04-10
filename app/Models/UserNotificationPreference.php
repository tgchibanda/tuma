<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'inapp_notifications',
        'sms_notifications',
        'whatsapp_notifications',
        'push_notifications',
        'notify_rate_alerts',
        'notify_match_proposals',
        'notify_chat_messages',
        'notify_transaction_updates',
        'notify_marketing',
        'whatsapp_number',
    ];

    protected $casts = [
        'email_notifications'        => 'boolean',
        'inapp_notifications'        => 'boolean',
        'sms_notifications'          => 'boolean',
        'whatsapp_notifications'     => 'boolean',
        'push_notifications'         => 'boolean',
        'notify_rate_alerts'         => 'boolean',
        'notify_match_proposals'     => 'boolean',
        'notify_chat_messages'       => 'boolean',
        'notify_transaction_updates' => 'boolean',
        'notify_marketing'           => 'boolean',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
