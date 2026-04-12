<?php

namespace App\Services;

use App\Models\ExchangeRate;
use App\Models\SystemSetting;
use App\Models\User;

class FeeCalculationService
{
    /**
     * Calculate the USD amount and platform fee for a given AUD amount.
     *
     * @param float        $amountAud   The AUD amount being sent
     * @param ExchangeRate $rate        The current exchange rate record
     * @param User|null    $user        Optional — check for any available fee discounts
     *
     * @return array {
     *   amount_aud: float,
     *   fee_aud: float,
     *   fee_percent: float,
     *   net_aud: float,
     *   amount_usd: float,
     *   exchange_rate: float,
     *   discount_id: int|null,
     *   discount_percent: float|null,
     *   original_fee_aud: float|null,
     *   wu_estimated_fee: float,
     *   savings_vs_wu: float
     * }
     */
    public function calculateUsd(float $amountAud, ExchangeRate $rate, ?User $user = null): array
    {
        $feePercent  = (float) SystemSetting::get('platform_fee_percent', 1.5);
        $rawFeeAud   = round($amountAud * ($feePercent / 100), 2);

        // Check for any referral or promotional discount
        $discountId      = null;
        $discountPercent = null;
        $originalFeeAud  = null;
        $feeAud          = $rawFeeAud;

        if ($user) {
            $discountResult = app(ReferralService::class)->applyReward($user, $rawFeeAud);
            if (isset($discountResult['discount_id'])) {
                $feeAud          = $discountResult['fee_aud'];
                $discountId      = $discountResult['discount_id'];
                $discountPercent = $discountResult['discount_percent'];
                $originalFeeAud  = $discountResult['original_fee_aud'];
            }
        }

        $netAud     = round($amountAud - $feeAud, 2);
        $amountUsd  = round($netAud * $rate->rate, 2);

        // Estimate what Other Services would charge (approx 4–5% + fixed fee)
        $wuFeeAud  = round(($amountAud * 0.05) + 5, 2);
        $savingsVsWu = round($wuFeeAud - $feeAud, 2);

        return [
            'amount_aud'       => $amountAud,
            'fee_aud'          => $feeAud,
            'fee_percent'      => $feePercent,
            'net_aud'          => $netAud,
            'amount_usd'       => $amountUsd,
            'exchange_rate'    => (float) $rate->rate,
            'exchange_rate_id' => $rate->id,
            'discount_id'      => $discountId,
            'discount_percent' => $discountPercent,
            'original_fee_aud' => $originalFeeAud,
            'wu_estimated_fee' => $wuFeeAud,
            'savings_vs_wu'    => $savingsVsWu,
        ];
    }
}


class KycService
{
    /**
     * Get the user's current trading tier based on completed trades.
     *
     * Tier 1: 0–4 trades   → max AUD $300
     * Tier 2: 5–19 trades  → max AUD $1,500
     * Tier 3: 20+ trades   → max AUD $5,000
     *
     * Returns ['tier' => int, 'max_amount_aud' => float, 'label' => string]
     */
    public function getUserTier(User $user): array
    {
        $trades = $user->successful_trades;

        if ($trades < 5) {
            return [
                'tier'           => 1,
                'max_amount_aud' => (float) SystemSetting::get('new_user_limit_aud', 300),
                'label'          => 'New Trader',
                'next_tier_at'   => 5,
            ];
        }

        if ($trades < 20) {
            return [
                'tier'           => 2,
                'max_amount_aud' => 1500.00,
                'label'          => 'Trusted Trader',
                'next_tier_at'   => 20,
            ];
        }

        return [
            'tier'           => 3,
            'max_amount_aud' => (float) SystemSetting::get('max_order_amount_aud', 5000),
            'label'          => 'Power Trader',
            'next_tier_at'   => null,
        ];
    }

    /**
     * Validate that a user can trade a specific amount.
     */
    public function validateOrderAmount(User $user, float $amountAud): void
    {
        $this->assertCanTrade($user);

        $tier = $this->getUserTier($user);

        if ($amountAud < (float) SystemSetting::get('min_order_amount_aud', 50)) {
            throw new \App\Exceptions\TumaException(
                'Minimum order amount is AUD $' . SystemSetting::get('min_order_amount_aud', 50) . '.',
                422
            );
        }

        if ($amountAud > $tier['max_amount_aud']) {
            throw new \App\Exceptions\TumaException(
                "Your current trading tier allows a maximum of AUD \${$tier['max_amount_aud']} per order. "
                . "Complete more trades to increase your limit.",
                422
            );
        }
    }

    /**
     * Assert that a user is allowed to trade at all.
     */
    public function assertCanTrade(User $user): void
    {
        if ($user->account_status !== 'active') {
            throw new \App\Exceptions\TumaException('Your account is not active.', 403);
        }

        if ($user->kyc_status === 'rejected') {
            throw new \App\Exceptions\TumaException(
                'Your KYC verification was rejected. Please re-submit your documents.',
                403
            );
        }

        if (SystemSetting::get('maintenance_mode') === 'true') {
            throw new \App\Exceptions\TumaException(
                SystemSetting::get('maintenance_message', 'TuMa is under maintenance.'),
                503
            );
        }
    }
}
