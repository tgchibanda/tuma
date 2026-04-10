<?php

namespace App\Console;

use App\Jobs\AutoCancelMaxRounds;
use App\Jobs\CalculateTrustScores;
use App\Jobs\ExpireNegotiationRounds;
use App\Jobs\ExpireOldOrders;
use App\Jobs\ExpireOrderBoosts;
use App\Jobs\FlagOverdueConfirmations;
use App\Jobs\FlagOverdueRiskDeposits;
use App\Jobs\ProcessRecurringOrders;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // ── Every 15 minutes ──────────────────────────────────────────────
        // Cancel matches where negotiation round timed out (2hr window per round)
        $schedule->job(new ExpireNegotiationRounds)
            ->everyFifteenMinutes()
            ->name('expire-negotiation-rounds')
            ->withoutOverlapping();

        // Cancel matches that hit max negotiation rounds
        $schedule->job(new AutoCancelMaxRounds)
            ->everyFifteenMinutes()
            ->name('auto-cancel-max-rounds')
            ->withoutOverlapping();

        // ── Every 30 minutes ──────────────────────────────────────────────
        // Auto-raise disputes for unconfirmed deliveries
        $schedule->job(new FlagOverdueConfirmations)
            ->everyThirtyMinutes()
            ->name('flag-overdue-confirmations')
            ->withoutOverlapping();

        // Auto-raise disputes for risk delivery deposits not received
        $schedule->job(new FlagOverdueRiskDeposits)
            ->everyThirtyMinutes()
            ->name('flag-overdue-risk-deposits')
            ->withoutOverlapping();

        // ── Hourly ────────────────────────────────────────────────────────
        // Mark unmatched open orders as expired
        $schedule->job(new ExpireOldOrders)
            ->hourly()
            ->name('expire-old-orders')
            ->withoutOverlapping();

        // Deactivate expired order boosts
        $schedule->job(new ExpireOrderBoosts)
            ->hourly()
            ->name('expire-order-boosts')
            ->withoutOverlapping();

        // ── Daily ─────────────────────────────────────────────────────────
        // Create new orders from recurring schedules (8am AEST)
        $schedule->job(new ProcessRecurringOrders)
            ->dailyAt('08:00')
            ->timezone('Australia/Sydney')
            ->name('process-recurring-orders')
            ->withoutOverlapping();

        // Recalculate trust scores for all active users (2am AEST — low traffic)
        $schedule->job(new CalculateTrustScores)
            ->dailyAt('02:00')
            ->timezone('Australia/Sydney')
            ->name('calculate-trust-scores')
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }
}
