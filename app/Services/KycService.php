<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\User;
use App\Exceptions\TumaException;

class KycService
{
    /**
     * Validate that a user can trade a specific amount.
     * No tier limits — only min/max system settings apply.
     */
    public function validateOrderAmount(User $user, float $amountAud): void
    {
        $this->assertCanTrade($user);

        $min = (float) SystemSetting::get('min_order_amount_aud', 50);
        $max = (float) SystemSetting::get('max_order_amount_aud', 5000);

        if ($amountAud < $min) {
            throw new TumaException(
                "Minimum order amount is AUD \${$min}.",
                422
            );
        }

        if ($amountAud > $max) {
            throw new TumaException(
                "Maximum order amount is AUD \${$max}.",
                422
            );
        }
    }

    /**
     * Assert that a user is allowed to trade at all.
     * Only blocks banned/suspended users and maintenance mode.
     * KYC status does NOT block trading.
     */
    public function assertCanTrade(User $user): void
    {
        if ($user->account_status === User::STATUS_BANNED) {
            throw new TumaException('Your account has been banned. Please contact support.', 403);
        }

        if ($user->account_status === User::STATUS_SUSPENDED) {
            throw new TumaException(
                'Your account is currently suspended. Reason: ' . ($user->suspension_reason ?? 'Contact support.'),
                403
            );
        }

        if (SystemSetting::get('maintenance_mode') === 'true') {
            throw new TumaException(
                SystemSetting::get('maintenance_message', 'TuMa is currently under maintenance. Please try again shortly.'),
                503
            );
        }
    }

    /**
     * Get the user's trust tier — used for display only, not for blocking.
     */
    public function getUserTier(User $user): array
    {
        $trades = $user->successful_trades;

        if ($trades === 0) {
            return ['tier' => 1, 'label' => 'New Trader', 'trades' => $trades];
        }
        if ($trades < 10) {
            return ['tier' => 2, 'label' => 'Active Trader', 'trades' => $trades];
        }
        if ($trades < 50) {
            return ['tier' => 3, 'label' => 'Trusted Trader', 'trades' => $trades];
        }

        return ['tier' => 4, 'label' => 'Power Trader', 'trades' => $trades];
    }
}
