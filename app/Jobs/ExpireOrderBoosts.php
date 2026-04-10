<?php

namespace App\Jobs;

use App\Models\OrderBoost;
use App\Models\SwapOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExpireOrderBoosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $expiredBoosts = OrderBoost::where('is_active', true)
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expiredBoosts as $boost) {
            $boost->update(['is_active' => false]);

            SwapOrder::where('id', $boost->swap_order_id)
                ->where('boost_expires_at', '<', now())
                ->update(['is_boosted' => false, 'boost_expires_at' => null]);
        }

        if ($expiredBoosts->count() > 0) {
            Log::info("ExpireOrderBoosts: deactivated {$expiredBoosts->count()} expired boosts.");
        }
    }
}
