<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ExchangeRate;
use App\Models\RateHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExchangeRateController extends Controller
{
    use ApiResponse;

    /**
     * Get the current active exchange rate between two currencies.
     * GET /api/v1/exchange-rates/{from}/{to}
     * e.g. GET /api/v1/exchange-rates/AUD/USD
     */
    public function current(string $from, string $to): JsonResponse
    {
        $from = strtoupper($from);
        $to   = strtoupper($to);

        $rate = ExchangeRate::where('from_currency', $from)
            ->where('to_currency', $to)
            ->where('is_active', 1)
            ->latest('created_at')
            ->first();

        if (! $rate) {
            return $this->error("No active exchange rate found for {$from}/{$to}.", 404);
        }

        return $this->success([
            'id'                   => $rate->id,
            'from_currency'        => $rate->from_currency,
            'to_currency'          => $rate->to_currency,
            'rate'                 => (float) $rate->rate,
            'platform_fee_percent' => (float) \App\Models\SystemSetting::get('platform_fee_percent', 1.5),
            'is_active'            => (bool) $rate->is_active,
            'set_at'               => $rate->created_at->toIso8601String(),
        ], 'Exchange rate retrieved.');
    }

    /**
     * Get rate history for chart display.
     * GET /api/v1/exchange-rates/history/{from}/{to}?days=7
     */
    public function history(Request $request, string $from, string $to): JsonResponse
    {
        $from = strtoupper($from);
        $to   = strtoupper($to);
        $days = min((int) $request->get('days', 7), 90);

        $history = RateHistory::where('from_currency', $from)
            ->where('to_currency', $to)
            ->where('recorded_at', '>=', now()->subDays($days))
            ->orderBy('recorded_at')
            ->get()
            ->map(fn($r) => [
                'rate'        => (float) $r->rate,
                'recorded_at' => $r->recorded_at->toIso8601String(),
            ]);

        // If no history, fall back to current rate
        if ($history->isEmpty()) {
            $current = ExchangeRate::where('from_currency', $from)
                ->where('to_currency', $to)
                ->where('is_active', 1)
                ->latest('created_at')
                ->first();

            if ($current) {
                $history = collect([
                    ['rate' => (float) $current->rate, 'recorded_at' => $current->created_at->toIso8601String()]
                ]);
            }
        }

        return $this->success([
            'from_currency' => $from,
            'to_currency'   => $to,
            'days'          => $days,
            'history'       => $history,
        ], 'Rate history retrieved.');
    }

    /**
     * List all active rates (admin facing, and for public display).
     * GET /api/v1/exchange-rates
     */
    public function index(): JsonResponse
    {
        $rates = ExchangeRate::where('is_active', 1)
            ->orderBy('from_currency')
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'from_currency' => $r->from_currency,
                'to_currency'   => $r->to_currency,
                'rate'          => (float) $r->rate,
                'is_active'     => (bool) $r->is_active,
                'set_at'        => $r->created_at->toIso8601String(),
            ]);

        return $this->success($rates, 'Exchange rates retrieved.');
    }
}
