<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\User;

class KycService
{
    /**
     * Get the trading tier details for a user.
     *
     * Tiers are based on successful_trades count.
     * Returns tier number, label, and max order AUD.
     */
    public function getUserTier(User $user): array
    {
        $newUserLimit = (float) SystemSetting::get('new_user_limit_aud', 300);
        $maxGlobal    = (float) SystemSetting::get('max_order_amount_aud', 5000);

        if ($user->successful_trades >= 20) {
            return [
                'tier'          => 3,
                'label'         => 'Experienced Trader',
                'max_order_aud' => min($maxGlobal, User::TIER_3_MAX_AUD),
                'next_tier_at'  => null,
                'trades_to_next'=> null,
            ];
        }

        if ($user->successful_trades >= 5) {
            return [
                'tier'          => 2,
                'label'         => 'Trusted Trader',
                'max_order_aud' => min($maxGlobal, User::TIER_2_MAX_AUD),
                'next_tier_at'  => 20,
                'trades_to_next'=> 20 - $user->successful_trades,
            ];
        }

        return [
            'tier'          => 1,
            'label'         => 'New Trader',
            'max_order_aud' => min($newUserLimit, User::TIER_1_MAX_AUD),
            'next_tier_at'  => 5,
            'trades_to_next'=> 5 - $user->successful_trades,
        ];
    }

    /**
     * Validate whether a proposed order amount is within the user's tier limit.
     * Returns true if allowed, false if exceeds limit.
     */
    public function validateOrderAmount(User $user, float $amountAud): bool
    {
        $tier = $this->getUserTier($user);
        return $amountAud <= $tier['max_order_aud'];
    }

    /**
     * Assert that a user is allowed to trade at all.
     * Throws a descriptive exception if not.
     */
    public function assertCanTrade(User $user): void
    {
        if ($user->kyc_status !== User::KYC_APPROVED) {
            throw new \App\Exceptions\TumaException(
                'Your identity verification (KYC) must be approved before you can trade. ' .
                'Please complete KYC in your profile.',
                403
            );
        }

        if ($user->account_status !== User::STATUS_ACTIVE) {
            throw new \App\Exceptions\TumaException(
                'Your account is not currently active. Please contact support.',
                403
            );
        }
    }

    /**
     * Get a full trading profile summary for the user profile page.
     */
    public function getTradingProfile(User $user): array
    {
        $tier    = $this->getUserTier($user);
        $minAud  = (float) SystemSetting::get('min_order_amount_aud', 50);

        return [
            'can_trade'        => $user->canTrade(),
            'kyc_status'       => $user->kyc_status,
            'account_status'   => $user->account_status,
            'tier'             => $tier,
            'min_order_aud'    => $minAud,
            'max_order_aud'    => $tier['max_order_aud'],
            'total_trades'     => $user->total_trades,
            'successful_trades'=> $user->successful_trades,
            'rating'           => $user->rating,
            'trust_score'      => $user->trust_score,
        ];
    }
}
