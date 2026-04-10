<?php

namespace App\Services;

use App\Models\RateAlert;
use App\Models\User;

class RateAlertService
{
    public function __construct(protected NotificationService $notificationService) {}

    /**
     * Check all active rate alerts when a new exchange rate is set.
     * Called by AdminExchangeRateController::store() after saving a new rate.
     */
    public function checkAlerts(string $fromCurrency, string $toCurrency, float $newRate): void
    {
        $alerts = RateAlert::active()
            ->forPair($fromCurrency, $toCurrency)
            ->with('user')
            ->get();

        foreach ($alerts as $alert) {
            if (! $alert->shouldTrigger($newRate)) {
                continue;
            }

            // Only notify if user has rate alert notifications enabled
            if (! $this->notificationService->shouldNotify($alert->user, 'inapp')) {
                continue;
            }

            // Fire the notification
            $this->notificationService->notify(
                $alert->user,
                new \App\Notifications\RateAlertTriggeredNotification($alert, $newRate),
                ['email', 'inapp']
            );

            // Mark as triggered
            $alert->triggered_at = now();

            // Deactivate if notify_once
            if ($alert->notify_once) {
                $alert->is_active = false;
            }

            $alert->save();
        }
    }
}
