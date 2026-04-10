<?php

namespace App\Services;

use App\Models\PublicTransactionFeed;
use App\Models\SwapMatch;

class SocialProofService
{
    /**
     * Create an anonymised feed entry when a match completes.
     * Names are masked: "Tendai M." → "T***i"
     */
    public function createFeedEntry(SwapMatch $match): void
    {
        try {
            $sender   = $match->sendOrder->user;
            $receiver = $match->receiveOrder->user;
            $location = $match->sendOrder->deliveryLocation?->name ?? 'Zimbabwe';

            PublicTransactionFeed::create([
                'swap_match_id'   => $match->id,
                'display_sender'  => $this->anonymiseName($sender->display_first_name) . ' from ' . $this->getCityFromCountry($sender),
                'display_receiver'=> $this->anonymiseName($receiver->display_first_name) . ' in ' . $location,
                'amount_aud'      => $match->agreed_aud,
                'amount_usd'      => $match->agreed_usd,
                'delivery_location'=> $location,
                'completed_at'    => now(),
                'is_demo'         => false,
                'is_visible'      => true,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('SocialProofService failed: ' . $e->getMessage());
        }
    }

    private function anonymiseName(string $name): string
    {
        if (strlen($name) <= 2) return $name . '***';
        $first  = $name[0];
        $last   = substr($name, -1);
        $middle = str_repeat('*', max(3, strlen($name) - 2));
        return $first . $middle . $last;
    }

    private function getCityFromCountry(\App\Models\User $user): string
    {
        return match ($user->country?->iso_code) {
            'AU' => collect(['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide'])->random(),
            default => $user->country?->name ?? 'Australia',
        };
    }
}
