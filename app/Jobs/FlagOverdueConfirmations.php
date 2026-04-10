<?php

namespace App\Jobs;

use App\Models\SwapMatch;
use App\Models\SystemSetting;
use App\Services\EscrowService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FlagOverdueConfirmations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $windowHours = (int) SystemSetting::get('confirmation_window_hours', 24);
        $cutoff      = now()->subHours($windowHours);

        $overdue = SwapMatch::whereIn('status', [
            SwapMatch::STATUS_AWAITING_CONFIRMATION,
            SwapMatch::STATUS_AWAITING_RISK_CONFIRMATION,
        ])
        ->where('delivery_uploaded_at', '<', $cutoff)
        ->with(['sendOrder.user', 'receiveOrder.user'])
        ->get();

        $escrowService = app(EscrowService::class);

        foreach ($overdue as $match) {
            try {
                $escrowService->autoRaiseDispute($match);
                Log::info("FlagOverdueConfirmations: dispute raised for match {$match->ulid}.");
            } catch (\Throwable $e) {
                Log::error("FlagOverdueConfirmations: failed on {$match->ulid} — {$e->getMessage()}");
            }
        }
    }
}
