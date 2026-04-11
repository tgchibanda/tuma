<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\PublicTransactionFeed;
use App\Models\SwapMatch;
use App\Models\User;
use App\Models\UserBadge;

class SocialProofService
{
    /**
     * Create an anonymised public feed entry when a match completes.
     */
    public function createFeedEntry(SwapMatch $match): void
    {
        $senderUser   = $match->sendOrder->user;
        $receiverUser = $match->receiveOrder->user;
        $location     = $match->sendOrder->deliveryLocation;

        PublicTransactionFeed::create([
            'swap_match_id'    => $match->id,
            'display_sender'   => $this->anonymiseName($senderUser->first_name) . ' from ' . ($senderUser->country?->name ?? 'Australia'),
            'display_receiver' => $this->anonymiseName($receiverUser->first_name) . ' in ' . ($location?->name ?? 'Zimbabwe'),
            'amount_aud'       => $match->agreed_aud,
            'amount_usd'       => $match->agreed_usd,
            'delivery_location'=> $location?->name ?? 'Zimbabwe',
            'completed_at'     => now(),
            'is_demo'          => 0,
            'is_visible'       => 1,
        ]);
    }

    /**
     * Anonymise a first name: "Tendai" → "T***i"
     */
    private function anonymiseName(string $name): string
    {
        $len = mb_strlen($name);
        if ($len <= 2) return $name[0] . str_repeat('*', max(2, $len - 1));
        return $name[0] . str_repeat('*', max(3, $len - 2)) . $name[$len - 1];
    }
}


class BadgeService
{
    /**
     * Evaluate all achievement conditions for a user after a trade and award any new badges.
     */
    public function evaluate(User $user): void
    {
        $achievements = Achievement::where('is_active', 1)->get();

        foreach ($achievements as $achievement) {
            // Skip if already earned
            if (UserBadge::where('user_id', $user->id)->where('badge_key', $achievement->badge_key)->exists()) {
                continue;
            }

            $earned = match ($achievement->trigger_type) {
                'trade_count' => $user->successful_trades >= ($achievement->trigger_value ?? 0),
                'rating_average' => $user->total_trades >= 5 && $user->rating >= 4.8,
                'zero_disputes' => $user->successful_trades >= 5 && $this->hasZeroDisputes($user),
                'referral_count' => $user->referral_count >= ($achievement->trigger_value ?? 0),
                'account_age' => $user->created_at->diffInDays(now()) >= ($achievement->trigger_value ?? 0),
                'multi_city' => $this->getCitiesDelivered($user) >= ($achievement->trigger_value ?? 0),
                'manual' => false, // only admin can award
                default => false,
            };

            if ($earned) {
                $this->award($user, $achievement);
            }
        }
    }

    /**
     * Manually award a badge (admin action).
     */
    public function awardManual(User $user, string $badgeKey): void
    {
        $achievement = Achievement::where('badge_key', $badgeKey)->first();
        if ($achievement) {
            $this->award($user, $achievement);
        }
    }

    private function award(User $user, Achievement $achievement): void
    {
        UserBadge::firstOrCreate(
            ['user_id' => $user->id, 'badge_key' => $achievement->badge_key],
            [
                'badge_name'        => $achievement->badge_name,
                'badge_description' => $achievement->badge_description,
                'badge_icon'        => $achievement->badge_icon,
                'earned_at'         => now(),
                'is_visible'        => 1,
            ]
        );
    }

    private function hasZeroDisputes(User $user): bool
    {
        return !\App\Models\Dispute::whereHas('swapMatch', function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->whereNotIn('status', ['dismissed', 'closed'])->exists();
    }

    private function getCitiesDelivered(User $user): int
    {
        return \App\Models\CashDelivery::where('deliverer_user_id', $user->id)
            ->where('status', 'confirmed')
            ->distinct('delivery_location_id')
            ->count('delivery_location_id');
    }
}
