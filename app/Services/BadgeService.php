<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use App\Models\UserBadge;

class BadgeService
{
    public function __construct(protected NotificationService $notificationService) {}

    /**
     * Evaluate all badge conditions for a user and award any new badges.
     * Call this after every completed trade.
     */
    public function evaluate(User $user): void
    {
        $achievements = Achievement::active()->get();
        $existingKeys = UserBadge::where('user_id', $user->id)->pluck('badge_key')->toArray();

        foreach ($achievements as $achievement) {
            if (in_array($achievement->badge_key, $existingKeys)) continue;

            if ($this->meetsCondition($user, $achievement)) {
                $this->award($user, $achievement);
            }
        }
    }

    /**
     * Manually award a badge to a user (admin action).
     */
    public function awardManual(User $user, string $badgeKey): void
    {
        $achievement = Achievement::where('badge_key', $badgeKey)->first();
        if ($achievement) {
            $this->award($user, $achievement);
        }
    }

    private function meetsCondition(User $user, Achievement $achievement): bool
    {
        return match ($achievement->trigger_type) {
            Achievement::TRIGGER_TRADE_COUNT    => $user->successful_trades >= $achievement->trigger_value,
            Achievement::TRIGGER_RATING_AVERAGE => $user->rating && $user->rating >= $achievement->trigger_value && $user->total_trades >= 5,
            Achievement::TRIGGER_ZERO_DISPUTES  => $user->successful_trades >= 5 && ! \App\Models\Dispute::whereHas('swapMatch', fn($q) =>
                    $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
                      ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id))
                )->exists(),
            Achievement::TRIGGER_REFERRAL_COUNT => $user->referral_count >= $achievement->trigger_value,
            Achievement::TRIGGER_ACCOUNT_AGE    => $user->created_at->diffInDays(now()) >= $achievement->trigger_value,
            Achievement::TRIGGER_MULTI_CITY     => $this->getDeliveredCityCount($user) >= $achievement->trigger_value,
            default => false,
        };
    }

    private function award(User $user, Achievement $achievement): void
    {
        try {
            UserBadge::create([
                'user_id'          => $user->id,
                'badge_key'        => $achievement->badge_key,
                'badge_name'       => $achievement->badge_name,
                'badge_description'=> $achievement->badge_description,
                'badge_icon'       => $achievement->badge_icon,
                'earned_at'        => now(),
                'is_visible'       => true,
            ]);

            $this->notificationService->notify(
                $user,
                new \App\Notifications\BadgeEarnedNotification($achievement),
                ['inapp']
            );
        } catch (\Illuminate\Database\QueryException $e) {
            // Unique constraint violation — badge already exists, ignore
        }
    }

    private function getDeliveredCityCount(User $user): int
    {
        return \App\Models\CashDelivery::where('deliverer_user_id', $user->id)
            ->where('status', \App\Models\CashDelivery::STATUS_CONFIRMED)
            ->distinct('delivery_location_id')
            ->count('delivery_location_id');
    }
}
