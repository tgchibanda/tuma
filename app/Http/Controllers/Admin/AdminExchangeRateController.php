<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ExchangeRate;
use App\Models\RateHistory;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminExchangeRateController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * List all exchange rates.
     * GET /api/v1/admin/exchange-rates
     */
    public function index(): JsonResponse
    {
        $rates = ExchangeRate::orderByDesc('created_at')->paginate(30);

        return $this->paginated($rates, 'Exchange rates retrieved.', $rates->getCollection()->map(fn($r) => [
            'id'            => $r->id,
            'from_currency' => $r->from_currency,
            'to_currency'   => $r->to_currency,
            'rate'          => (float) $r->rate,
            'source'        => $r->source,
            'is_active'     => (bool) $r->is_active,
            'created_at'    => $r->created_at?->toIso8601String(),
        ]));
    }

    /**
     * Create a new exchange rate (deactivates the previous active rate for the same pair).
     * POST /api/v1/admin/exchange-rates
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'from_currency' => ['required', 'string', 'size:3'],
            'to_currency'   => ['required', 'string', 'size:3'],
            'rate'          => ['required', 'numeric', 'min:0.00000001'],
            'source'        => ['nullable', 'string', 'max:50'],
        ]);

        $from = strtoupper($request->from_currency);
        $to   = strtoupper($request->to_currency);

        DB::transaction(function () use ($request, $from, $to) {
            // Deactivate existing active rate for this pair
            ExchangeRate::where('from_currency', $from)
                ->where('to_currency', $to)
                ->where('is_active', true)
                ->update(['is_active' => false]);

            // Create new active rate
            $rate = ExchangeRate::create([
                'from_currency' => $from,
                'to_currency'   => $to,
                'rate'          => $request->rate,
                'source'        => $request->source ?? 'manual',
                'is_active'     => true,
            ]);

            // Record in rate history
            RateHistory::create([
                'from_currency' => $from,
                'to_currency'   => $to,
                'rate'          => $request->rate,
                'recorded_at'   => now(),
                'source'        => $request->source ?? 'manual',
            ]);

            // Check and fire rate alerts
            app(\App\Services\RateAlertService::class)->checkAlerts($from, $to, (float) $request->rate);

            $this->auditService->log('exchange_rate.created', request()->user(), $rate, [], [
                'from' => $from, 'to' => $to, 'rate' => $request->rate,
            ]);
        });

        return $this->created(null, "New {$from}/{$to} rate set to {$request->rate}.");
    }

    /**
     * Deactivate a specific rate.
     * PUT /api/v1/admin/exchange-rates/{id}/deactivate
     */
    public function deactivate(Request $request, int $id): JsonResponse
    {
        $rate = ExchangeRate::findOrFail($id);
        $rate->update(['is_active' => false]);

        $this->auditService->log('exchange_rate.deactivated', $request->user(), $rate);

        return $this->success(null, 'Rate deactivated.');
    }

    /**
     * Schedule a rate to activate at a future time.
     * PUT /api/v1/admin/exchange-rates/{id}/schedule
     */
    public function schedule(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'activate_at' => ['required', 'date', 'after:now'],
        ]);

        // Store scheduled rate in system_settings as a queued activation
        \App\Models\SystemSetting::set(
            'scheduled_rate_' . $id,
            json_encode([
                'rate_id'     => $id,
                'activate_at' => $request->activate_at,
            ]),
            $request->user()->id
        );

        $this->auditService->log('exchange_rate.scheduled', $request->user(), ExchangeRate::find($id), [], [
            'activate_at' => $request->activate_at,
        ]);

        return $this->success(null, 'Rate scheduled for activation at ' . $request->activate_at . '.');
    }
}
