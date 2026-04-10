<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotificationPreference;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Check if a user should receive a notification on a given channel.
     *
     * Channels: 'email', 'inapp', 'sms', 'push', 'whatsapp'
     * Returns false if the user has opted out of that channel.
     */
    public function shouldNotify(User $user, string $channel): bool
    {
        $prefs = $user->notificationPreferences;

        if (! $prefs) {
            // No preferences record means they were never set — default to true
            return true;
        }

        return match($channel) {
            'email'    => (bool) $prefs->email_notifications,
            'inapp'    => (bool) $prefs->inapp_notifications,
            'sms'      => (bool) $prefs->sms_notifications,
            'push'     => (bool) $prefs->push_notifications,
            'whatsapp' => (bool) $prefs->whatsapp_notifications,
            default    => false,
        };
    }

    /**
     * Send a notification to a user, respecting their channel preferences.
     *
     * Always calls shouldNotify() before dispatching.
     * Pass channels = ['email', 'inapp'] etc. to specify which channels to use.
     *
     * @param User         $user
     * @param Notification $notification
     * @param array        $channels  e.g. ['email', 'inapp']
     * @param bool         $bypassPrefs  true only for registration/security emails
     */
    public function notify(
        User $user,
        Notification $notification,
        array $channels = ['email', 'inapp'],
        bool $bypassPrefs = false
    ): void {
        $allowedChannels = [];

        foreach ($channels as $channel) {
            if ($bypassPrefs || $this->shouldNotify($user, $channel)) {
                $allowedChannels[] = $this->mapChannelToLaravel($channel);
            }
        }

        if (empty($allowedChannels)) {
            return; // User has opted out of all requested channels
        }

        try {
            $user->notify($notification->via($allowedChannels));
        } catch (\Throwable $e) {
            Log::error('NotificationService failed', [
                'user_id'      => $user->id,
                'notification' => get_class($notification),
                'error'        => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a transactional/security notification that always goes through
     * regardless of user preferences (e.g. email verification, new device login).
     */
    public function notifyAlways(User $user, Notification $notification, array $channels = ['mail']): void
    {
        $this->notify($user, $notification, $channels, bypassPrefs: true);
    }

    /**
     * Notify multiple users at once, each respecting their own preferences.
     */
    public function notifyMany(array $users, Notification $notification, array $channels = ['email', 'inapp']): void
    {
        foreach ($users as $user) {
            $this->notify($user, $notification, $channels);
        }
    }

    /**
     * Map our channel names to Laravel notification channel class names.
     */
    private function mapChannelToLaravel(string $channel): string
    {
        return match($channel) {
            'email'    => 'mail',
            'inapp'    => 'database',
            'sms'      => \App\Notifications\Channels\SmsChannel::class,
            'push'     => \App\Notifications\Channels\PushChannel::class,
            'whatsapp' => \App\Notifications\Channels\WhatsAppChannel::class,
            default    => 'database',
        };
    }
}
