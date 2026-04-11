<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\RateAlert;
use App\Models\SavedRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ── RateAlertController ────────────────────────────────────────────────────

class RateAlertController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $alerts = RateAlert::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')->get()
            ->map(fn($a) => [
                'id'            => $a->id,
                'from_currency' => $a->from_currency,
                'to_currency'   => $a->to_currency,
                'target_rate'   => (float) $a->target_rate,
                'direction'     => $a->direction,
                'is_active'     => (bool) $a->is_active,
                'notify_once'   => (bool) $a->notify_once,
                'triggered_at'  => $a->triggered_at?->toIso8601String(),
                'created_at'    => $a->created_at->toIso8601String(),
            ]);
        return $this->success($alerts, 'Rate alerts retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'from_currency' => ['required', 'string', 'size:3'],
            'to_currency'   => ['required', 'string', 'size:3'],
            'target_rate'   => ['required', 'numeric', 'min:0.000001'],
            'direction'     => ['required', 'in:above,below'],
            'notify_once'   => ['nullable', 'boolean'],
        ]);

        $count = RateAlert::where('user_id', $request->user()->id)->where('is_active', 1)->count();
        if ($count >= 10) {
            return $this->error('You can have a maximum of 10 active rate alerts.', 422);
        }

        $alert = RateAlert::create([
            'user_id'       => $request->user()->id,
            'from_currency' => strtoupper($request->from_currency),
            'to_currency'   => strtoupper($request->to_currency),
            'target_rate'   => $request->target_rate,
            'direction'     => $request->direction,
            'is_active'     => true,
            'notify_once'   => $request->boolean('notify_once', true),
        ]);

        return $this->created([
            'id'          => $alert->id,
            'target_rate' => (float) $alert->target_rate,
            'direction'   => $alert->direction,
        ], 'Rate alert created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $alert = RateAlert::where('user_id', $request->user()->id)->findOrFail($id);
        $request->validate([
            'target_rate' => ['sometimes', 'numeric', 'min:0.000001'],
            'direction'   => ['sometimes', 'in:above,below'],
            'is_active'   => ['sometimes', 'boolean'],
        ]);
        $alert->update($request->only(['target_rate', 'direction', 'is_active']));
        return $this->success(['id' => $alert->id, 'is_active' => (bool) $alert->is_active], 'Alert updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        RateAlert::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success(null, 'Alert deleted.');
    }
}