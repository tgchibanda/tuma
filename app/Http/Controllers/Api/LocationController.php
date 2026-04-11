<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Country;
use App\Models\DeliveryLocation;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/countries/{id}/locations
     * Returns both grouped (by province) and flat arrays for the given country.
     */
    public function byCountry(int $id): JsonResponse
    {
        $country = Country::findOrFail($id);

        $locations = DeliveryLocation::where('country_id', $id)
            ->where('is_active', true)
            ->orderBy('province')
            ->orderBy('name')
            ->get();

        // Build grouped structure
        $grouped = $locations
            ->groupBy('province')
            ->map(fn($locs, $province) => [
                'province'  => $province,
                'locations' => $locs->map(fn($l) => [
                    'id'       => $l->id,
                    'name'     => $l->name,
                    'slug'     => $l->slug,
                    'province' => $l->province,
                ])->values(),
            ])
            ->values();

        // Build flat array
        $flat = $locations->map(fn($l) => [
            'id'       => $l->id,
            'name'     => $l->name,
            'slug'     => $l->slug,
            'province' => $l->province,
        ])->values();

        return $this->success([
            'country' => [
                'id'              => $country->id,
                'name'            => $country->name,
                'iso_code'        => $country->iso_code,
                'currency_code'   => $country->currency_code,
                'currency_symbol' => $country->currency_symbol,
                'flag_emoji'      => $country->flag_emoji,
            ],
            'grouped' => $grouped,
            'flat'    => $flat,
        ], 'Delivery locations retrieved.');
    }

    /**
     * GET /api/v1/locations/availability
     * Returns which cities have at least one always-available user.
     */
    public function availability(): JsonResponse
    {
        $available = \App\Models\User::where('always_available', 1)
            ->where('account_status', 'active')
            ->whereNotNull('available_locations')
            ->get()
            ->flatMap(fn($u) => $u->available_locations ?? [])
            ->unique()
            ->values();

        return $this->success([
            'available_location_ids' => $available,
        ], 'Location availability retrieved.');
    }
}
