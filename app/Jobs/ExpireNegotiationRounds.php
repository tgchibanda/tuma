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

class ExpireNegotiationRounds implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $roundHours = (int) SystemSetting::get('negotiation_round_hours', 2);
        $cutoff     = now()->subHours($roundHours);

        $expired = SwapMatch::whereIn('status', [
            SwapMatch::STATUS_PROPOSED,
            SwapMatch::STATUS_NEGOTIATING,
        ])
        ->where('proposed_at', '<', $cutoff)
        ->with(['sendOrder', 'receiveOrder'])
        ->get();

        $matchingService = app(MatchingService::class);

        foreach ($expired as $match) {
            try {
                $matchingService->cancelMatch($match, $match->initiatedBy);
                Log::info("ExpireNegotiationRounds: cancelled match {$match->ulid} — round timed out.");
            } catch (\Throwable $e) {
                Log::error("ExpireNegotiationRounds: failed on {$match->ulid} — {$e->getMessage()}");
            }
        }
    }
}
