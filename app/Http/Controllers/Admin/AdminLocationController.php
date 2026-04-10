<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\DeliveryLocation;
use App\Models\SwapOrder;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminLocationController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * List all locations grouped by country.
     * GET /api/admin/locations
     */
    public function index(): JsonResponse
    {
        $locations = DeliveryLocation::with('country')
            ->orderBy('country_id')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn($l) => [
                'id'         => $l->id,
                'name'       => $l->name,
                'slug'       => $l->slug,
                'province'   => $l->province,
                'sort_order' => $l->sort_order,
                'is_active'  => (bool) $l->is_active,
                'country'    => $l->country ? [
                    'id'   => $l->country->id,
                    'name' => $l->country->name,
                ] : null,
            ]);

        $grouped = $locations->groupBy(fn($l) => $l['country']['name'] ?? 'Unknown');

        return $this->success([
            'grouped' => $grouped,
            'flat'    => $locations->values(),
        ], 'Locations retrieved.');
    }

    /**
     * Create a new delivery location.
     * POST /api/admin/locations
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'country_id'  => ['required', 'integer', 'exists:countries,id'],
            'name'        => ['required', 'string', 'max:150'],
            'province'    => ['nullable', 'string', 'max:100'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($request->name);

        // Ensure slug is unique within country
        $existing = DeliveryLocation::where('country_id', $request->country_id)
            ->where('slug', $slug)->exists();

        if ($existing) {
            return $this->error('A location with this name already exists for this country.', 422);
        }

        $location = DeliveryLocation::create([
            'country_id'  => $request->country_id,
            'name'        => $request->name,
            'slug'        => $slug,
            'province'    => $request->province,
            'sort_order'  => $request->sort_order ?? 0,
            'is_active'   => true,
        ]);

        $this->auditService->log('location.created', $request->user(), $location);

        return $this->created($location, 'Location created.');
    }

    /**
     * Update a location's name, province, or sort order.
     * PUT /api/admin/locations/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $location = DeliveryLocation::findOrFail($id);

        $request->validate([
            'name'       => ['sometimes', 'string', 'max:150'],
            'province'   => ['nullable', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $old = $location->toArray();

        if ($request->filled('name')) {
            $location->name = $request->name;
            $location->slug = Str::slug($request->name);
        }
        if ($request->has('province'))   $location->province   = $request->province;
        if ($request->has('sort_order')) $location->sort_order = $request->sort_order;

        $location->save();

        $this->auditService->log('location.updated', $request->user(), $location, $old, $location->toArray());

        return $this->success($location, 'Location updated.');
    }

    /**
     * Toggle a location active/inactive.
     * PUT /api/admin/locations/{id}/toggle-active
     */
    public function toggleActive(Request $request, int $id): JsonResponse
    {
        $location = DeliveryLocation::findOrFail($id);
        $location->is_active = ! $location->is_active;
        $location->save();

        $this->auditService->log('location.toggled', $request->user(), $location);

        return $this->success($location,
            $location->is_active ? 'Location activated.' : 'Location deactivated. Hidden from new orders.'
        );
    }

    /**
     * Soft-delete a location (only if no orders reference it).
     * DELETE /api/admin/locations/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $location = DeliveryLocation::findOrFail($id);

        $orderCount = SwapOrder::where('zim_delivery_location_id', $id)->count();
        if ($orderCount > 0) {
            return $this->error(
                "Cannot delete this location — {$orderCount} order(s) reference it. Deactivate it instead.",
                422
            );
        }

        $this->auditService->log('location.deleted', $request->user(), $location);
        $location->delete();

        return $this->success(null, 'Location deleted.');
    }
}
