<?php

namespace App\Jobs;

use App\Models\ExchangeRate;
use App\Models\RecurringOrder;
use App\Models\SwapOrder;
use App\Models\SystemSetting;
use App\Services\FeeCalculationService;
use App\Services\KycService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessRecurringOrders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(FeeCalculationService $feeService, KycService $kycService): void
    {
        if (! (bool) SystemSetting::get('recurring_orders_enabled', true)) {
            return;
        }

        $due = RecurringOrder::due()
            ->with(['user', 'orderTemplate.savedRecipient'])
            ->get();

        $expiryHours = (int) SystemSetting::get('order_expiry_hours', 48);
        $rate        = ExchangeRate::currentRate('AUD', 'USD');

        if (! $rate) {
            Log::error('ProcessRecurringOrders: no active AUD/USD rate — skipping.');
            return;
        }

        foreach ($due as $recurring) {
            try {
                $user     = $recurring->user;
                $template = $recurring->orderTemplate;

                // Skip if user can't trade
                if (! $user->canTrade()) {
                    Log::warning("ProcessRecurringOrders: user {$user->id} cannot trade — skipping.");
                    continue;
                }

                $feeCalc  = $feeService->calculateUsd((float) $template->amount_aud, $rate, $user);
                $recipient = $template->savedRecipient;

                $order = SwapOrder::create([
                    'user_id'                  => $user->id,
                    'order_type'               => $template->order_type,
                    'amount_aud'               => $template->amount_aud,
                    'amount_usd'               => $feeCalc['amount_usd'],
                    'exchange_rate_id'         => $rate->id,
                    'platform_fee_aud'         => $feeCalc['fee_aud'],
                    'platform_fee_percent'     => $feeCalc['fee_percent'],
                    'zim_recipient_name'       => $recipient?->recipient_name ?? 'Recipient',
                    'zim_recipient_phone'      => $recipient?->recipient_phone ?? '',
                    'zim_delivery_location_id' => $recipient?->delivery_location_id,
                    'zim_delivery_address'     => $recipient?->delivery_address,
                    'zim_delivery_notes'       => $recipient?->delivery_notes,
                    'aud_recipient_name'       => $user->first_name . ' ' . $user->last_name,
                    'aud_bank_account_id'      => $template->aud_bank_account_id,
                    'status'                   => SwapOrder::STATUS_OPEN,
                    'expires_at'               => now()->addHours($expiryHours),
                    'template_id'              => $template->id,
                    'recurring_order_id'       => $recurring->id,
                ]);

                // Update recurring schedule
                $recurring->last_run_at  = now();
                $recurring->next_run_at  = $recurring->calculateNextRunAt();
                $recurring->run_count   += 1;
                $recurring->save();

                // Update template use count
                $template->increment('use_count');
                $template->last_used_at = now();
                $template->save();

                Log::info("ProcessRecurringOrders: created order {$order->ulid} for user {$user->id}.");
            } catch (\Throwable $e) {
                Log::error("ProcessRecurringOrders: failed for recurring {$recurring->id} — {$e->getMessage()}");
            }
        }
    }
}
