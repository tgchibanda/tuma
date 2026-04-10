<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\OrderBoost;
use Illuminate\Http\JsonResponse;

class AdminBoostController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $boosts = OrderBoost::with(['swapOrder.user', 'user'])
            ->orderByDesc('boosted_at')
            ->paginate(20);

        return $this->paginated($boosts, 'Boosts retrieved.', $boosts->getCollection()->map(fn($b) => [
            'id'            => $b->id,
            'boost_fee_aud' => (float) $b->boost_fee_aud,
            'is_active'     => (bool) $b->is_active,
            'boosted_at'    => $b->boosted_at->toIso8601String(),
            'expires_at'    => $b->expires_at->toIso8601String(),
            'order_ulid'    => $b->swapOrder?->ulid,
            'user'          => $b->user ? ['name' => $b->user->first_name . ' ' . $b->user->last_name, 'email' => $b->user->email] : null,
        ]));
    }
}
