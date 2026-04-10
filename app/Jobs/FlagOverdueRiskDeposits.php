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

class FlagOverdueRiskDeposits implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $windowHours = (int) SystemSetting::get('risk_deposit_window_hours', 24);
        $cutoff      = now()->subHours($windowHours);

        $overdue = SwapMatch::where('status', SwapMatch::STATUS_AWAITING_RISK_DEPOSIT)
            ->where('confirmed_at', '<', $cutoff)
            ->with(['sendOrder.user', 'receiveOrder.user'])
            ->get();

        $escrowService = app(EscrowService::class);

        foreach ($overdue as $match) {
            try {
                // Auto-raise dispute — sender confirmed delivery but hasn't deposited
                $escrowService->autoRaiseDispute($match);

                app(\App\Services\AuditService::class)->flag(
                    'fraud.risk_deposit_overdue',
                    $match->sendOrder->user,
                    $match,
                    'Sender confirmed risk delivery receipt but did not deposit within window'
                );

                Log::warning("FlagOverdueRiskDeposits: dispute raised for match {$match->ulid}.");
            } catch (\Throwable $e) {
                Log::error("FlagOverdueRiskDeposits: failed on {$match->ulid} — {$e->getMessage()}");
            }
        }
    }
}
