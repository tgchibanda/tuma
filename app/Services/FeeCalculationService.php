<?php

namespace App\Services;

use App\Models\ExchangeRate;
use App\Models\FeeDiscount;
use App\Models\SystemSetting;
use App\Models\User;

class FeeCalculationService
{
    /**
     * Calculate the USD amount from an AUD input, applying the platform fee
     * and any available discount for the given user.
     *
     * Returns an array with all breakdown figures used in the order form
     * and fee transparency display.
     *
     * @return array{
     *   amount_aud: float,
     *   exchange_rate: float,
     *   amount_usd: float,
     *   fee_percent: float,
     *   fee_aud: float,
     *   discounted_fee_aud: float|null,
     *   effective_fee_aud: float,
     *   net_aud_after_fee: float,
     *   discount_applied: bool,
     *   discount_id: int|null,
     *   comparison_western_union_fee: float,
     *   savings_vs_wu: float
     * }
     */
    public function calculateUsd(float $amountAud, ExchangeRate $rate, ?User $user = null): array
    {
        $feePercent = (float) SystemSetting::get('platform_fee_percent', 1.5);

        // Raw fee before any discount
        $feeAud = round($amountAud * ($feePercent / 100), 2);

        // Check for available discount
        $discountId        = null;
        $discountedFeeAud  = null;
        $discountApplied   = false;

        if ($user) {
            $discount = FeeDiscount::where('user_id', $user->id)
                ->available()
                ->orderBy('discount_percent', 'desc')
                ->first();

            if ($discount) {
                $discountedFeeAud = round($feeAud * (1 - ($discount->discount_percent / 100)), 2);
                $discountId       = $discount->id;
                $discountApplied  = true;
            }
        }

        $effectiveFeeAud = $discountedFeeAud ?? $feeAud;
        $netAudAfterFee  = round($amountAud - $effectiveFeeAud, 2);
        $amountUsd       = round($netAudAfterFee * (float) $rate->rate, 2);

        // Savings comparison vs Western Union (approximate: 5% fee + worse rate ~0.58)
        $wuFee           = round($amountAud * 0.05, 2);
        $wuRate          = 0.58;
        $wuNetAud        = $amountAud - $wuFee;
        $wuUsd           = round($wuNetAud * $wuRate, 2);
        $savingsVsWu     = round($amountUsd - $wuUsd, 2);
        $wuFeeSavings    = round($wuFee - $effectiveFeeAud, 2);

        return [
            'amount_aud'                  => $amountAud,
            'exchange_rate'               => (float) $rate->rate,
            'exchange_rate_id'            => $rate->id,
            'amount_usd'                  => $amountUsd,
            'fee_percent'                 => $feePercent,
            'fee_aud'                     => $feeAud,
            'discounted_fee_aud'          => $discountedFeeAud,
            'effective_fee_aud'           => $effectiveFeeAud,
            'net_aud_after_fee'           => $netAudAfterFee,
            'discount_applied'            => $discountApplied,
            'discount_id'                 => $discountId,
            'comparison_western_union_fee'=> $wuFee,
            'savings_vs_wu'               => max(0, $savingsVsWu),
            'fee_savings_vs_wu'           => max(0, $wuFeeSavings),
        ];
    }

    /**
     * Calculate the fee on an agreed match amount — used when finalising
     * a negotiated deal. Applies any discount for the depositing user.
     */
    public function calculateMatchFee(float $agreedAud, ?User $depositor = null): array
    {
        $rate = ExchangeRate::currentRate('AUD', 'USD');
        if (! $rate) {
            throw new \RuntimeException('No active AUD/USD exchange rate found.');
        }
        return $this->calculateUsd($agreedAud, $rate, $depositor);
    }
}
