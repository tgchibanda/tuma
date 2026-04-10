<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class PushChannel
{
    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toPush')) return;

        $data = $notification->toPush($notifiable);

        // Development stub — logs push payload
        // Production: integrate with Firebase FCM, OneSignal, or VAPID web push
        Log::channel('daily')->info('PUSH', [
            'user_id' => $notifiable->id,
            'title'   => $data['title'] ?? '',
            'body'    => $data['body'] ?? '',
            'data'    => $data['data'] ?? [],
        ]);
    }
}
