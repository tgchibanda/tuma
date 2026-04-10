<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Country;
use App\Models\DeliveryLocation;
use App\Models\SwapOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    use ApiResponse;

    /**
     * Get all active delivery locations for a country, grouped by province.
     * GET /api/v1/countries/{id}/locations
     *
     * Used to populate the Zimbabwe town dropdown on order creation.
     */
    public function byCountry(Request $request, int $id): JsonResponse
    {
        $country = Country::where('id', $id)->where('is_active', true)->firstOrFail();

        $locations = DeliveryLocation::where('country_id', $country->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn($loc) => [
                'id'       => $loc->id,
                'name'     => $loc->name,
                'slug'     => $loc->slug,
                'province' => $loc->province,
            ]);

        // Group by province for the dropdown UI
        $grouped = $locations
            ->groupBy('province')
            ->map(fn($items, $province) => [
                'province'  => $province,
                'locations' => $items->values(),
            ])
            ->values();

        return $this->success([
            'country'  => [
                'id'              => $country->id,
                'name'            => $country->name,
                'iso_code'        => $country->iso_code,
                'currency_code'   => $country->currency_code,
                'currency_symbol' => $country->currency_symbol,
                'flag_emoji'      => $country->flag_emoji,
            ],
            'grouped'   => $grouped,
            'flat'      => $locations->values(),
        ], 'Delivery locations retrieved.');
    }

    /**
     * Get availability status for all active locations.
     * Returns which cities currently have open orders on both sides.
     * GET /api/v1/locations/availability
     *
     * Used to show the green/grey city availability indicator.
     */
    public function availability(Request $request): JsonResponse
    {
        $locations = DeliveryLocation::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        // Get open order counts per location for each order type
        $sendCounts = SwapOrder::where('status', SwapOrder::STATUS_OPEN)
            ->where('order_type', SwapOrder::TYPE_SEND_TO_ZIM)
            ->selectRaw('zim_delivery_location_id, count(*) as count')
            ->groupBy('zim_delivery_location_id')
            ->pluck('count', 'zim_delivery_location_id');

        $receiveCounts = SwapOrder::where('status', SwapOrder::STATUS_OPEN)
            ->where('order_type', SwapOrder::TYPE_RECEIVE_FROM_ZIM)
            ->selectRaw('zim_delivery_location_id, count(*) as count')
            ->groupBy('zim_delivery_location_id')
            ->pluck('count', 'zim_delivery_location_id');

        $result = $locations->map(fn($loc) => [
            'id'              => $loc->id,
            'name'            => $loc->name,
            'province'        => $loc->province,
            'has_send_orders' => ($sendCounts[$loc->id] ?? 0) > 0,
            'has_receive_orders'=> ($receiveCounts[$loc->id] ?? 0) > 0,
            'send_count'      => $sendCounts[$loc->id] ?? 0,
            'receive_count'   => $receiveCounts[$loc->id] ?? 0,
            'is_active'       => (bool) $loc->is_active,
        ]);

        return $this->success($result, 'Location availability retrieved.');
    }
}
