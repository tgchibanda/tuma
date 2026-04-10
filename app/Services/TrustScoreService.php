<?php

namespace App\Services;

use App\Models\Dispute;
use App\Models\User;

class TrustScoreService
{
    /**
     * Calculate and update the trust score for a user.
     * Score is 0–100, based on weighted criteria.
     *
     * Weights:
     *   - Completed trades (40%): 20+ trades = full 40 points
     *   - Average rating    (30%): 5-star avg = full 30 points
     *   - Account age       (10%): 365+ days = full 10 points
     *   - KYC approved      (10%): binary 10 or 0
     *   - 2FA enabled        (5%): binary 5 or 0
     *   - Zero disputes      (5%): no disputes = 5 points
     */
    public function calculate(User $user): int
    {
        $score = 0;

        // Trades (40 points max) — scales up to 20 trades
        $tradeFactor = min($user->successful_trades / 20, 1.0);
        $score += (int) round($tradeFactor * 40);

        // Rating (30 points max) — rating 1–5 scaled to 0–30
        if ($user->rating && $user->total_trades >= 3) {
            $ratingFactor = (((float) $user->rating) - 1) / 4; // 0.0 to 1.0
            $score += (int) round($ratingFactor * 30);
        }

        // Account age (10 points max) — scales up to 365 days
        $ageDays    = $user->created_at->diffInDays(now());
        $ageFactor  = min($ageDays / 365, 1.0);
        $score     += (int) round($ageFactor * 10);

        // KYC approved (10 points)
        if ($user->kyc_status === User::KYC_APPROVED) {
            $score += 10;
        }

        // 2FA enabled (5 points)
        if ($user->two_fa_enabled) {
            $score += 5;
        }

        // Zero disputes (5 points)
        $hasDisputes = Dispute::whereHas('swapMatch', function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->whereNotIn('status', ['dismissed', 'closed'])->exists();

        if (! $hasDisputes) {
            $score += 5;
        }

        return min($score, 100);
    }

    /**
     * Calculate and persist the trust score for a user.
     */
    public function update(User $user): int
    {
        $score          = $this->calculate($user);
        $user->trust_score = $score;
        $user->timestamps  = false;
        $user->save();
        $user->timestamps  = true;

        return $score;
    }

    /**
     * Recalculate trust scores for all active users.
     * Called by the CalculateTrustScores job (daily at 2am).
     */
    public function recalculateAll(): int
    {
        $count = 0;
        User::where('role', 'user')
            ->where('account_status', User::STATUS_ACTIVE)
            ->chunk(100, function ($users) use (&$count) {
                foreach ($users as $user) {
                    $this->update($user);
                    $count++;
                }
            });

        return $count;
    }

    /**
     * Get a detailed breakdown of the score for display.
     */
    public function getBreakdown(User $user): array
    {
        $tradeFactor   = min($user->successful_trades / 20, 1.0);
        $tradePoints   = (int) round($tradeFactor * 40);

        $ratingPoints  = 0;
        if ($user->rating && $user->total_trades >= 3) {
            $ratingFactor = (((float) $user->rating) - 1) / 4;
            $ratingPoints = (int) round($ratingFactor * 30);
        }

        $ageDays       = $user->created_at->diffInDays(now());
        $ageFactor     = min($ageDays / 365, 1.0);
        $agePoints     = (int) round($ageFactor * 10);

        $kycPoints     = $user->kyc_status === User::KYC_APPROVED ? 10 : 0;
        $twoFaPoints   = $user->two_fa_enabled ? 5 : 0;
        $disputePoints = 5; // assume no disputes — actual check in calculate()

        $hasDisputes = Dispute::whereHas('swapMatch', function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->whereNotIn('status', ['dismissed', 'closed'])->exists();

        if ($hasDisputes) $disputePoints = 0;

        return [
            'total'            => min($tradePoints + $ratingPoints + $agePoints + $kycPoints + $twoFaPoints + $disputePoints, 100),
            'breakdown'        => [
                'trades'   => ['points' => $tradePoints,   'max' => 40, 'label' => "{$user->successful_trades} completed trades"],
                'rating'   => ['points' => $ratingPoints,  'max' => 30, 'label' => $user->rating ? "Avg rating {$user->rating}" : 'No ratings yet'],
                'age'      => ['points' => $agePoints,     'max' => 10, 'label' => "{$ageDays} days member"],
                'kyc'      => ['points' => $kycPoints,     'max' => 10, 'label' => $kycPoints ? 'KYC approved' : 'KYC not approved'],
                'two_fa'   => ['points' => $twoFaPoints,   'max' => 5,  'label' => $twoFaPoints ? '2FA enabled' : '2FA not enabled'],
                'disputes' => ['points' => $disputePoints, 'max' => 5,  'label' => $disputePoints ? 'Zero disputes' : 'Has disputes'],
            ],
        ];
    }
}
