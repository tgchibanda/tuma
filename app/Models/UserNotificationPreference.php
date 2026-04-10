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
        'email_notifications'       => 'boolean',
        'inapp_notifications'       => 'boolean',
        'sms_notifications'         => 'boolean',
        'whatsapp_notifications'    => 'boolean',
        'push_notifications'        => 'boolean',
        'notify_rate_alerts'        => 'boolean',
        'notify_match_proposals'    => 'boolean',
        'notify_chat_messages'      => 'boolean',
        'notify_transaction_updates' => 'boolean',
        'notify_marketing'          => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function shouldSend(string $channel, string $event = 'transaction_updates'): bool
    {
        $channelMap = [
            'email'    => 'email_notifications',
            'inapp'    => 'inapp_notifications',
            'sms'      => 'sms_notifications',
            'whatsapp' => 'whatsapp_notifications',
            'push'     => 'push_notifications',
        ];
        $eventMap = [
            'rate_alert'          => 'notify_rate_alerts',
            'match_proposal'      => 'notify_match_proposals',
            'chat'                => 'notify_chat_messages',
            'transaction_updates' => 'notify_transaction_updates',
            'marketing'           => 'notify_marketing',
        ];
        $channelOk = isset($channelMap[$channel]) ? $this->{$channelMap[$channel]} : false;
        $eventOk   = isset($eventMap[$event]) ? $this->{$eventMap[$event]} : true;
        return $channelOk && $eventOk;
    }
}