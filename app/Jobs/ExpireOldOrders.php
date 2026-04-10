<?php
// ============================================================
// FILE: app/Jobs/ExpireOldOrders.php
// ============================================================
namespace App\Jobs;
use App\Models\SwapOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExpireOldOrders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $expired = SwapOrder::where('status', SwapOrder::STATUS_OPEN)
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expired as $order) {
            $order->update(['status' => SwapOrder::STATUS_EXPIRED]);

            // Notify owner
            app(\App\Services\NotificationService::class)->notify(
                $order->user,
                new \App\Notifications\OrderExpiredNotification($order),
                ['inapp']
            );
        }

        if ($expired->count() > 0) {
            Log::info("ExpireOldOrders: expired {$expired->count()} orders.");
        }
    }
}
