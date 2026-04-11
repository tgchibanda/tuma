<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\RecurringOrder;
use App\Models\OrderTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecurringOrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $orders = RecurringOrder::where('user_id', $request->user()->id)
            ->with('orderTemplate.savedRecipient')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($o) => $this->format($o));

        return $this->success($orders, 'Recurring orders retrieved.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'order_template_id' => ['required', 'integer', 'exists:order_templates,id'],
            'frequency'         => ['required', 'in:weekly,fortnightly,monthly'],
        ]);

        $template = OrderTemplate::where('user_id', $request->user()->id)
            ->findOrFail($request->order_template_id);

        $nextRun = match ($request->frequency) {
            'weekly'      => now()->addWeek(),
            'fortnightly' => now()->addWeeks(2),
            'monthly'     => now()->addMonth(),
        };

        $recurring = RecurringOrder::create([
            'user_id'           => $request->user()->id,
            'order_template_id' => $template->id,
            'frequency'         => $request->frequency,
            'next_run_at'       => $nextRun,
            'is_active'         => true,
        ]);

        return $this->created($this->format($recurring), 'Recurring order set up.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $recurring = RecurringOrder::where('user_id', $request->user()->id)->findOrFail($id);
        $request->validate([
            'frequency' => ['sometimes', 'in:weekly,fortnightly,monthly'],
        ]);
        $recurring->update($request->only(['frequency']));
        return $this->success($this->format($recurring), 'Updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        RecurringOrder::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success(null, 'Recurring order removed.');
    }

    public function pause(Request $request, int $id): JsonResponse
    {
        $recurring = RecurringOrder::where('user_id', $request->user()->id)->findOrFail($id);
        $recurring->update(['paused_at' => now(), 'pause_reason' => $request->reason]);
        return $this->success($this->format($recurring), 'Paused.');
    }

    public function resume(Request $request, int $id): JsonResponse
    {
        $recurring = RecurringOrder::where('user_id', $request->user()->id)->findOrFail($id);
        $recurring->update(['paused_at' => null, 'pause_reason' => null]);
        return $this->success($this->format($recurring), 'Resumed.');
    }

    private function format(RecurringOrder $r): array
    {
        return [
            'id'               => $r->id,
            'frequency'        => $r->frequency,
            'next_run_at'      => $r->next_run_at?->toIso8601String(),
            'last_run_at'      => $r->last_run_at?->toIso8601String(),
            'run_count'        => $r->run_count,
            'is_active'        => (bool) $r->is_active,
            'paused_at'        => $r->paused_at?->toIso8601String(),
            'pause_reason'     => $r->pause_reason,
            'order_template'   => $r->orderTemplate ? [
                'id'         => $r->orderTemplate->id,
                'name'       => $r->orderTemplate->name,
                'order_type' => $r->orderTemplate->order_type,
                'amount_aud' => (float) $r->orderTemplate->amount_aud,
            ] : null,
        ];
    }
}
