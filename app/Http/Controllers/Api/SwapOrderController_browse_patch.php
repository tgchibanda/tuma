<?php
// PATCH for SwapOrderController::browse() method only.
// Replace the existing browse() method body with this version.
// The rest of the SwapOrderController remains unchanged.
//
// Change: supports ?zim_location_ids=1,3,7 (comma-separated) for multi-city filtering.
// Also keeps the old ?zim_location_id=1 (single value) for backward compatibility.

    /**
     * Browse open orders from other users.
     * GET /api/v1/orders/browse
     *
     * Multi-city: ?zim_location_ids=1,3,7  (comma-separated IDs)
     * Single-city (legacy): ?zim_location_id=1
     *
     * IMPORTANT: This route must be defined BEFORE /orders/{ulid} in routes/api.php
     * Otherwise 'browse' is matched as a ULID and throws a ModelNotFoundException.
     */
    public function browse(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        $query = \App\Models\SwapOrder::where('status', \App\Models\SwapOrder::STATUS_OPEN)
            ->where('user_id', '!=', $user->id)
            ->where('expires_at', '>', now())
            ->with(['user', 'deliveryLocation'])
            ->orderByDesc('is_boosted')
            ->orderByDesc('created_at');

        // ── Multi-city filter (new) ─────────────────────────────────────
        if ($request->filled('zim_location_ids')) {
            $ids = array_filter(
                array_map('intval', explode(',', $request->zim_location_ids)),
                fn($id) => $id > 0
            );
            if (count($ids)) {
                $query->whereIn('zim_delivery_location_id', $ids);
            }
        } elseif ($request->filled('zim_location_id')) {
            // Legacy single-city support
            $query->where('zim_delivery_location_id', (int) $request->zim_location_id);
        }

        // ── Other filters ───────────────────────────────────────────────
        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }
        if ($request->filled('min_aud')) {
            $query->where('amount_aud', '>=', (float) $request->min_aud);
        }
        if ($request->filled('max_aud')) {
            $query->where('amount_aud', '<=', (float) $request->max_aud);
        }

        // ── Sort ────────────────────────────────────────────────────────
        if ($request->sort === 'amount_asc') {
            $query->reorder()->orderByDesc('is_boosted')->orderBy('amount_aud');
        } elseif ($request->sort === 'amount_desc') {
            $query->reorder()->orderByDesc('is_boosted')->orderByDesc('amount_aud');
        }

        $orders = $query->paginate(15);

        // Get trusted contact IDs for the browsing user
        $trustedIds = \App\Models\TrustedContact::where('user_id', $user->id)
            ->pluck('trusted_user_id')
            ->toArray();

        $formatted = $orders->getCollection()->map(function ($order) use ($trustedIds) {
            $f                       = $this->formatOrderForBrowse($order);
            $f['is_trusted_contact'] = in_array($order->user_id, $trustedIds);
            return $f;
        });

        return $this->paginated($orders, 'Orders retrieved.', $formatted);
    }
