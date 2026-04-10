<?php

namespace App\Jobs;

use App\Models\SwapMatch;
use App\Models\SystemSetting;
use App\Services\MatchingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AutoCancelMaxRounds implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $maxRounds = (int) SystemSetting::get('max_negotiation_rounds', 5);

        $overLimit = SwapMatch::whereIn('status', [
            SwapMatch::STATUS_PROPOSED,
            SwapMatch::STATUS_NEGOTIATING,
        ])
        ->whereRaw('negotiation_rounds >= max_negotiation_rounds')
        ->with(['sendOrder', 'receiveOrder'])
        ->get();

        $matchingService = app(MatchingService::class);

        foreach ($overLimit as $match) {
            try {
                $matchingService->cancelMatch($match, $match->initiatedBy);

                // Notify both parties
                $notif = app(\App\Services\NotificationService::class);
                foreach ([$match->sendOrder->user, $match->receiveOrder->user] as $party) {
                    $notif->notify($party, new \App\Notifications\NegotiationExpiredNotification($match), ['inapp']);
                }

                Log::info("AutoCancelMaxRounds: cancelled match {$match->ulid} — max rounds reached.");
            } catch (\Throwable $e) {
                Log::error("AutoCancelMaxRounds: failed on {$match->ulid} — {$e->getMessage()}");
            }
        }
    }
}
