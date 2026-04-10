<?php

namespace App\Services;

use App\Models\FeeDiscount;
use App\Models\Referral;
use App\Models\User;

class ReferralService
{
    public function __construct(protected NotificationService $notificationService) {}

    /**
     * Called after every completed trade.
     * Qualifies any pending referral and applies rewards.
     */
    public function processCompletedTrade(User $user): void
    {
        $referral = Referral::where('referred_id', $user->id)
            ->where('status', Referral::STATUS_PENDING)
            ->first();

        if (! $referral) return;

        $this->qualify($referral);
        $this->applyReward($referral);
    }

    /**
     * Mark a referral as qualified (referred user completed first trade).
     */
    public function qualify(Referral $referral): void
    {
        if ($referral->status !== Referral::STATUS_PENDING) return;

        $referral->update([
            'status'       => Referral::STATUS_QUALIFIED,
            'qualified_at' => now(),
        ]);

        // Increment referrer's referral count
        User::where('id', $referral->referrer_id)->increment('referral_count');
    }

    /**
     * Apply fee discount rewards to both referrer and referred user.
     */
    public function applyReward(Referral $referral): void
    {
        if ($referral->status !== Referral::STATUS_QUALIFIED) return;

        // Discount for referrer
        FeeDiscount::create([
            'user_id'          => $referral->referrer_id,
            'source'           => FeeDiscount::SOURCE_REFERRAL,
            'discount_percent' => $referral->referrer_discount_percent,
            'max_uses'         => 1,
            'uses_remaining'   => 1,
            'expires_at'       => now()->addDays(90),
        ]);

        // Discount for referred user
        FeeDiscount::create([
            'user_id'          => $referral->referred_id,
            'source'           => FeeDiscount::SOURCE_REFERRAL,
            'discount_percent' => $referral->referred_discount_percent,
            'max_uses'         => 1,
            'uses_remaining'   => 1,
            'expires_at'       => now()->addDays(90),
        ]);

        $referral->update([
            'status'            => Referral::STATUS_REWARDED,
            'reward_applied_at' => now(),
        ]);

        // Notify both
        $referrer = User::find($referral->referrer_id);
        $referred = User::find($referral->referred_id);

        if ($referrer) {
            $this->notificationService->notify(
                $referrer,
                new \App\Notifications\ReferralRewardNotification($referral, 'referrer'),
                ['email', 'inapp']
            );
        }

        if ($referred) {
            $this->notificationService->notify(
                $referred,
                new \App\Notifications\ReferralRewardNotification($referral, 'referred'),
                ['email', 'inapp']
            );
        }
    }
}
