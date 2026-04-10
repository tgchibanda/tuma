<?php

// ============================================================
// FILE: app/Notifications/Channels/SmsChannel.php
// ============================================================

namespace App\Notifications\Channels;

use App\Services\SmsService;
use Illuminate\Notifications\Notification;

class SmsChannel
{
    public function __construct(protected SmsService $smsService) {}

    public function send(mixed $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toSms')) return;
        if (! $notifiable->phone) return;

        $message = $notification->toSms($notifiable);
        $this->smsService->send($notifiable->phone, $message);
    }
}
