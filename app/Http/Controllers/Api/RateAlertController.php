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

// ── SavedRecipientController ───────────────────────────────────────────────

class SavedRecipientController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $recipients = SavedRecipient::where('user_id', $request->user()->id)
            ->with('deliveryLocation')
            ->orderByDesc('is_favourite')
            ->orderByDesc('use_count')
            ->get()->map(fn($r) => [
                'id'               => $r->id,
                'nickname'         => $r->nickname,
                'recipient_name'   => $r->recipient_name,
                'recipient_phone'  => $r->recipient_phone,
                'delivery_location'=> ['id' => $r->deliveryLocation?->id, 'name' => $r->deliveryLocation?->name],
                'delivery_location_id' => $r->delivery_location_id,
                'delivery_address' => $r->delivery_address,
                'delivery_notes'   => $r->delivery_notes,
                'is_favourite'     => (bool) $r->is_favourite,
                'use_count'        => $r->use_count,
                'last_used_at'     => $r->last_used_at?->toIso8601String(),
            ]);
        return $this->success($recipients, 'Recipients retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nickname'           => ['required', 'string', 'max:100'],
            'recipient_name'     => ['required', 'string', 'max:150'],
            'recipient_phone'    => ['required', 'string', 'max:30'],
            'delivery_location_id' => ['required', 'integer', 'exists:delivery_locations,id'],
            'delivery_address'   => ['nullable', 'string', 'max:500'],
            'delivery_notes'     => ['nullable', 'string', 'max:300'],
        ]);

        if (SavedRecipient::where('user_id', $request->user()->id)->count() >= 20) {
            return $this->error('Maximum of 20 saved recipients reached.', 422);
        }

        $recipient = SavedRecipient::create([
            'user_id'              => $request->user()->id,
            'nickname'             => $request->nickname,
            'recipient_name'       => $request->recipient_name,
            'recipient_phone'      => $request->recipient_phone,
            'delivery_location_id' => $request->delivery_location_id,
            'delivery_address'     => $request->delivery_address,
            'delivery_notes'       => $request->delivery_notes,
        ]);

        return $this->created(['id' => $recipient->id], 'Recipient saved.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $recipient = SavedRecipient::where('user_id', $request->user()->id)->findOrFail($id);
        $request->validate([
            'nickname'           => ['sometimes', 'string', 'max:100'],
            'recipient_name'     => ['sometimes', 'string', 'max:150'],
            'recipient_phone'    => ['sometimes', 'string', 'max:30'],
            'delivery_location_id' => ['sometimes', 'integer', 'exists:delivery_locations,id'],
            'delivery_address'   => ['nullable', 'string', 'max:500'],
            'is_favourite'       => ['sometimes', 'boolean'],
        ]);
        $recipient->update($request->only(['nickname','recipient_name','recipient_phone','delivery_location_id','delivery_address','delivery_notes','is_favourite']));
        return $this->success(['id' => $recipient->id], 'Recipient updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        SavedRecipient::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success(null, 'Recipient deleted.');
    }
}
