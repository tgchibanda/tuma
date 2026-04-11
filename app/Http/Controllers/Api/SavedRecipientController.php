<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SavedRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedRecipientController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $recipients = SavedRecipient::where('user_id', $request->user()->id)
            ->with('deliveryLocation')
            ->orderByDesc('is_favourite')
            ->orderByDesc('use_count')
            ->get()
            ->map(fn($r) => $this->format($r));

        return $this->success($recipients, 'Recipients retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nickname'             => ['required', 'string', 'max:100'],
            'recipient_name'       => ['required', 'string', 'max:150'],
            'recipient_phone'      => ['required', 'string', 'max:30'],
            'delivery_location_id' => ['required', 'integer', 'exists:delivery_locations,id'],
            'delivery_address'     => ['nullable', 'string', 'max:500'],
            'delivery_notes'       => ['nullable', 'string', 'max:300'],
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

        return $this->created($this->format($recipient), 'Recipient saved.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $recipient = SavedRecipient::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'nickname'             => ['sometimes', 'string', 'max:100'],
            'recipient_name'       => ['sometimes', 'string', 'max:150'],
            'recipient_phone'      => ['sometimes', 'string', 'max:30'],
            'delivery_location_id' => ['sometimes', 'integer', 'exists:delivery_locations,id'],
            'delivery_address'     => ['nullable', 'string', 'max:500'],
            'is_favourite'         => ['sometimes', 'boolean'],
        ]);

        $recipient->update($request->only([
            'nickname', 'recipient_name', 'recipient_phone',
            'delivery_location_id', 'delivery_address', 'delivery_notes', 'is_favourite',
        ]));

        return $this->success($this->format($recipient), 'Recipient updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        SavedRecipient::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success(null, 'Recipient deleted.');
    }

    private function format(SavedRecipient $r): array
    {
        return [
            'id'               => $r->id,
            'nickname'         => $r->nickname,
            'recipient_name'   => $r->recipient_name,
            'recipient_phone'  => $r->recipient_phone,
            'delivery_location'=> $r->deliveryLocation ? [
                'id'   => $r->deliveryLocation->id,
                'name' => $r->deliveryLocation->name,
            ] : null,
            'delivery_location_id' => $r->delivery_location_id,
            'delivery_address' => $r->delivery_address,
            'delivery_notes'   => $r->delivery_notes,
            'is_favourite'     => (bool) $r->is_favourite,
            'use_count'        => $r->use_count,
            'last_used_at'     => $r->last_used_at?->toIso8601String(),
        ];
    }
}
