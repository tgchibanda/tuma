<?php

namespace App\Services;

use App\Models\FeeDiscount;
use App\Models\Referral;
use App\Models\User;

class ReferralService
{
    /**
     * Called after a trade completes for a user.
     * If they were referred and this is their first completed trade,
     * qualify the referral and award discounts to both parties.
     */
    public function processCompletedTrade(User $user): void
    {
        if (! $user->referred_by) return;
        if (! (bool) \App\Models\SystemSetting::get('referral_reward_enabled', true)) return;

        // Find pending referral for this user as the referred party
        $referral = Referral::where('referred_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (! $referral) return;

        $this->qualify($referral);
    }

    /**
     * Mark a referral as qualified and apply fee discounts to both parties.
     */
    public function qualify(Referral $referral): void
    {
        if ($referral->status !== 'pending') return;

        $discountPercent = (float) \App\Models\SystemSetting::get('referral_discount_percent', 50);

        \Illuminate\Support\Facades\DB::transaction(function () use ($referral, $discountPercent) {
            $referral->update([
                'status'       => 'rewarded',
                'qualified_at' => now(),
                'reward_applied_at' => now(),
                'referrer_discount_percent' => $discountPercent,
                'referred_discount_percent' => $discountPercent,
            ]);

            // Create fee discount records for both parties
            foreach ([
                ['user_id' => $referral->referrer_id, 'percent' => $referral->referrer_discount_percent],
                ['user_id' => $referral->referred_id,  'percent' => $referral->referred_discount_percent],
            ] as $reward) {
                FeeDiscount::create([
                    'user_id'          => $reward['user_id'],
                    'source'           => 'referral',
                    'discount_percent' => $reward['percent'],
                    'max_uses'         => 1,
                    'uses_remaining'   => 1,
                    'expires_at'       => now()->addDays(90),
                ]);
            }

            // Update referrer's stats
            $referrer = User::find($referral->referrer_id);
            if ($referrer) {
                $referrer->increment('referral_count');
            }
        });
    }

    /**
     * Apply a referral discount to a fee calculation.
     * Returns the discounted fee amount.
     */
    public function applyReward(User $user, float $originalFeeAud): array
    {
        $discount = FeeDiscount::where('user_id', $user->id)
            ->where('uses_remaining', '>', 0)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->orderByDesc('discount_percent')
            ->first();

        if (! $discount) {
            return ['fee_aud' => $originalFeeAud, 'discount' => null];
        }

        $discountedFee = $originalFeeAud * (1 - ($discount->discount_percent / 100));

        return [
            'fee_aud'          => round($discountedFee, 2),
            'original_fee_aud' => $originalFeeAud,
            'discount_percent' => $discount->discount_percent,
            'discount_id'      => $discount->id,
        ];
    }
}
