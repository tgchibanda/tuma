<?php

namespace App\Jobs;

use App\Services\TrustScoreService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CalculateTrustScores implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(TrustScoreService $trustScoreService): void
    {
        $count = $trustScoreService->recalculateAll();
        Log::info("CalculateTrustScores: updated {$count} user trust scores.");
    }
}
