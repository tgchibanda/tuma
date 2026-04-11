<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotificationPreference;
use Illuminate\Notifications\Notification;

class NotificationService
{
    /**
     * Check if a user has a specific notification channel enabled.
     * Two-layer check: master toggle (email_notifications / inapp_notifications)
     * and per-event preference.
     */
    public function shouldNotify(User $user, string $channel): bool
    {
        $prefs = $user->notificationPreferences;
        if (! $prefs) return true; // default: allow all if prefs not set

        return match ($channel) {
            'email'    => (bool) $prefs->email_notifications,
            'inapp'    => (bool) $prefs->inapp_notifications,
            'sms'      => (bool) $prefs->sms_notifications,
            'whatsapp' => (bool) $prefs->whatsapp_notifications,
            'push'     => (bool) $prefs->push_notifications,
            default    => true,
        };
    }

    /**
     * Send a notification to a user on specified channels,
     * respecting the user's notification preferences.
     *
     * @param User         $user     Recipient
     * @param Notification $notif    Laravel Notification instance
     * @param array        $channels e.g. ['email', 'inapp', 'sms']
     */
    public function notify(User $user, Notification $notif, array $channels): void
    {
        $via = [];

        foreach ($channels as $channel) {
            if (! $this->shouldNotify($user, $channel)) continue;

            $via[] = match ($channel) {
                'email'    => 'mail',
                'inapp'    => 'database',
                'sms'      => \App\Notifications\Channels\SmsChannel::class,
                'whatsapp' => \App\Notifications\Channels\WhatsAppChannel::class,
                'push'     => \App\Notifications\Channels\PushChannel::class,
                default    => null,
            };
        }

        $via = array_filter(array_unique($via));
        if (empty($via)) return;

        // Override the notification's via() by wrapping it
        $user->notify(new class($notif, $via) extends \Illuminate\Notifications\Notification {
            public function __construct(
                private readonly Notification $inner,
                private readonly array $resolvedVia
            ) {}

            public function via(mixed $notifiable): array
            {
                return $this->resolvedVia;
            }

            public function toMail(mixed $notifiable): mixed
            {
                return method_exists($this->inner, 'toMail')
                    ? $this->inner->toMail($notifiable)
                    : null;
            }

            public function toDatabase(mixed $notifiable): mixed
            {
                return method_exists($this->inner, 'toDatabase')
                    ? $this->inner->toDatabase($notifiable)
                    : ['message' => 'New notification'];
            }

            public function toSms(mixed $notifiable): mixed
            {
                return method_exists($this->inner, 'toSms')
                    ? $this->inner->toSms($notifiable)
                    : null;
            }
        });
    }

    /**
     * Send a notification that bypasses preference checks.
     * Use for critical notifications: email verification, account suspension etc.
     */
    public function notifyAlways(User $user, Notification $notif, array $channels): void
    {
        $via = array_filter(array_map(fn($c) => match ($c) {
            'email' => 'mail',
            'inapp' => 'database',
            default => null,
        }, $channels));

        if (empty($via)) return;
        $user->notify($notif);
    }

    /**
     * Notify multiple users at once (same notification).
     */
    public function notifyMany(iterable $users, Notification $notif, array $channels): void
    {
        foreach ($users as $user) {
            $this->notify($user, $notif, $channels);
        }
    }
}
