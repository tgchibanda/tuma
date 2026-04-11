<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/**
 * SMS Notification Channel
 * ------------------------------------------------------------------
 * Replace the Log::info() calls with your SMS provider SDK.
 * Supported providers: Twilio, AWS SNS, Vonage (Nexmo), MessageBird
 *
 * Example with Twilio:
 *   $twilio = new \Twilio\Rest\Client(config('services.twilio.sid'), config('services.twilio.token'));
 *   $twilio->messages->create($notifiable->phone, [
 *       'from' => config('services.twilio.from'),
 *       'body' => $message,
 *   ]);
 */
class SmsChannel
{
    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toSms')) return;
        if (! $notifiable->phone) return;

        $message = $notification->toSms($notifiable);
        if (! $message) return;

        // TODO: Replace with real SMS provider
        Log::channel('daily')->info('SMS to ' . $notifiable->phone . ': ' . $message);
    }
}

/**
 * Web Push Notification Channel
 * ------------------------------------------------------------------
 * Uses the Web Push API (VAPID). Requires:
 *   composer require minishlink/web-push
 *   npm install web-push
 *
 * Store user push subscriptions in a `push_subscriptions` table.
 * VAPID keys in .env: VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY
 */
class PushChannel
{
    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toPush')) return;

        $payload = $notification->toPush($notifiable);
        if (! $payload) return;

        // TODO: Replace with real push provider
        Log::channel('daily')->info('Push to user ' . $notifiable->id . ': ' . json_encode($payload));
    }
}

/**
 * WhatsApp Notification Channel
 * ------------------------------------------------------------------
 * Uses the WhatsApp Business Cloud API.
 * Requires a Meta Business account and approved templates.
 *
 * Add to .env:
 *   WHATSAPP_PHONE_ID=your_phone_number_id
 *   WHATSAPP_TOKEN=your_access_token
 */
class WhatsAppChannel
{
    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toWhatsApp')) return;

        $prefs = $notifiable->notificationPreferences;
        $phone = $prefs?->whatsapp_number ?? $notifiable->phone;
        if (! $phone) return;

        $message = $notification->toWhatsApp($notifiable);
        if (! $message) return;

        // TODO: Replace with WhatsApp Business API call
        Log::channel('daily')->info('WhatsApp to ' . $phone . ': ' . $message);
    }
}
