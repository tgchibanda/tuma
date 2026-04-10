<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toWhatsApp')) return;

        $prefs = $notifiable->notificationPreferences;
        $phone = $prefs?->whatsapp_number ?? $notifiable->phone;

        if (! $phone) return;

        $message = $notification->toWhatsApp($notifiable);

        // Development stub — logs WhatsApp message
        // Production: integrate with WhatsApp Business API (Meta) or Twilio WhatsApp
        Log::channel('daily')->info('WHATSAPP', [
            'user_id' => $notifiable->id,
            'to'      => $phone,
            'message' => $message,
        ]);
    }
}
