<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    use ApiResponse;

    /**
     * List public-facing traders directory.
     * Anonymous users are excluded or shown with masked details.
     * GET /api/v1/directory
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('account_status', 'active')
            ->where('role', '!=', 'admin')
            // Never show fully anonymous users in directory listing
            ->where('profile_visibility', '!=', 'anonymous')
            ->with(['country', 'badges'])
            ->orderByDesc('trust_score')
            ->orderByDesc('total_trades');

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', $s)
                  ->orWhere('last_name', 'like', $s)
                  ->orWhere('business_name', 'like', $s);
            });
        }

        if ($request->filled('order_type')) {
            $query->whereHas('swapOrders', fn($q) =>
                $q->where('order_type', $request->order_type)->where('status', 'open')
            );
        }

        if ($request->filled('location_id')) {
            $query->whereHas('swapOrders', fn($q) =>
                $q->where('zim_delivery_location_id', $request->location_id)->where('status', 'open')
            );
        }

        $users = $query->paginate(12);

        return $this->paginated($users, 'Directory retrieved.', $users->getCollection()->map(fn($u) => [
            'ulid'                 => $u->ulid,
            'display_name'         => $u->display_name,
            'avatar_url'           => $u->avatar_url,
            'business_name'        => $u->is_verified_business ? $u->business_name : null,
            'is_verified_business' => (bool) $u->is_verified_business,
            'always_available'     => (bool) $u->always_available,
            'city'                 => $u->country?->name,
            'total_trades'         => $u->total_trades,
            'rating'               => $u->rating ? (float) $u->rating : null,
            'trust_score'          => $u->trust_score,
            'badges'               => $u->badges->where('is_visible', 1)->map(fn($b) => [
                'badge_key'  => $b->badge_key,
                'badge_icon' => $b->badge_icon,
                'badge_name' => $b->badge_name,
            ])->values(),
        ]));
    }

    /**
     * Initiate contact / propose swap via directory.
     * POST /api/v1/directory/{ulid}/initiate
     */
    public function initiate(Request $request, string $ulid): JsonResponse
    {
        $targetUser = User::where('ulid', $ulid)
            ->where('account_status', 'active')
            ->where('profile_visibility', '!=', 'anonymous')
            ->firstOrFail();

        // Redirect client to browse filtered by this user's orders
        return $this->success([
            'browse_url' => '/browse?user=' . $ulid,
            'user_name'  => $targetUser->display_first_name,
        ], 'Redirecting to browse orders by ' . $targetUser->display_first_name . '.');
    }
}
