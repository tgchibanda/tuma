<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ExchangeRate;
use App\Models\RateHistory;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExchangeRateController extends Controller
{
    use ApiResponse;

    /**
     * List all currently active exchange rates.
     * GET /api/v1/exchange-rates
     */
    public function index(): JsonResponse
    {
        $rates = ExchangeRate::where('is_active', true)
            ->orderBy('from_currency')
            ->get()
            ->map(fn($r) => $this->formatRate($r));

        return $this->success($rates, 'Exchange rates retrieved.');
    }

    /**
     * Get a specific active rate for a currency pair.
     * GET /api/v1/exchange-rates/{from}/{to}
     */
    public function show(string $from, string $to): JsonResponse
    {
        $rate = ExchangeRate::active()
            ->forPair($from, $to)
            ->latest('created_at')
            ->first();

        if (! $rate) {
            return $this->notFound("No active exchange rate found for {$from}/{$to}.");
        }

        // Include fee info for the calculator
        $feePercent = (float) SystemSetting::get('platform_fee_percent', 1.5);

        return $this->success(array_merge(
            $this->formatRate($rate),
            ['platform_fee_percent' => $feePercent]
        ), 'Exchange rate retrieved.');
    }

    /**
     * Get historical rate data for a chart (last 7 or 30 days).
     * GET /api/v1/exchange-rates/history/{from}/{to}?days=7
     */
    public function history(Request $request, string $from, string $to): JsonResponse
    {
        $days = (int) $request->input('days', 7);
        $days = min($days, 90); // Cap at 90 days

        $history = RateHistory::forPair($from, $to)
            ->lastDays($days)
            ->orderBy('recorded_at')
            ->get()
            ->map(fn($h) => [
                'rate'        => (float) $h->rate,
                'recorded_at' => $h->recorded_at->toIso8601String(),
                'date'        => $h->recorded_at->toDateString(),
            ]);

        return $this->success([
            'pair'    => strtoupper($from) . '/' . strtoupper($to),
            'days'    => $days,
            'history' => $history,
        ], 'Rate history retrieved.');
    }

    private function formatRate(ExchangeRate $rate): array
    {
        return [
            'id'            => $rate->id,
            'from_currency' => $rate->from_currency,
            'to_currency'   => $rate->to_currency,
            'rate'          => (float) $rate->rate,
            'source'        => $rate->source,
            'created_at'    => $rate->created_at?->toIso8601String(),
        ];
    }
}
