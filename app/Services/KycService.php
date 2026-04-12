<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\User;
use App\Exceptions\TumaException;

class KycService
{
    /**
     * Validate that a user can create an order for the given AUD amount.
     *
     * Rules:
     *  - Only banned/suspended users and maintenance mode block trading.
     *  - KYC status NEVER blocks trading — users can trade regardless of KYC.
     *  - Only min/max amount system settings apply.
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
     * Assert a user is allowed to trade at all.
     *
     * IMPORTANT: KYC status is intentionally NOT checked here.
     * Users can trade at any verification level. KYC only affects
     * the trust score badge displayed on their profile.
     */
    public function assertCanTrade(User $user): void
    {
        if ($user->account_status === User::STATUS_BANNED) {
            throw new TumaException(
                'Your account has been permanently banned. Please contact support if you believe this is an error.',
                403
            );
        }

        if ($user->account_status === User::STATUS_SUSPENDED) {
            $msg = 'Your account is currently suspended';
            if ($user->account_suspended_until) {
                $msg .= ' until ' . $user->account_suspended_until->toFormattedDateString();
            }
            $msg .= '. Reason: ' . ($user->suspension_reason ?? 'Contact support for details.');
            throw new TumaException($msg, 403);
        }

        if (SystemSetting::get('maintenance_mode') === 'true') {
            throw new TumaException(
                SystemSetting::get('maintenance_message', 'eZimConnect is currently undergoing maintenance. Please try again shortly.'),
                503
            );
        }
    }

    /**
     * Get the user's trust tier label — display only, never used to restrict.
     */
    public function getUserTier(User $user): array
    {
        $trades = $user->successful_trades ?? 0;

        if ($trades === 0)   return ['tier' => 1, 'label' => 'New Trader',     'trades' => $trades];
        if ($trades < 10)    return ['tier' => 2, 'label' => 'Active Trader',  'trades' => $trades];
        if ($trades < 50)    return ['tier' => 3, 'label' => 'Trusted Trader', 'trades' => $trades];

        return                      ['tier' => 4, 'label' => 'Power Trader',   'trades' => $trades];
    }
}
