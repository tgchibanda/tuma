<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DirectoryController extends Controller
{
    use ApiResponse;

    /**
     * Public directory of always-available users and verified businesses.
     * GET /api/v1/directory
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('always_available', 1)
            ->where('account_status', 'active')
            ->where('kyc_status', 'approved')
            ->with(['country', 'badges'])
            ->orderByDesc('is_verified_business')
            ->orderByDesc('trust_score')
            ->orderByDesc('successful_trades');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%{$s}%")
                  ->orWhere('business_name', 'like', "%{$s}%");
            });
        }

        if ($request->filled('account_type')) {
            $query->where('account_type', $request->account_type);
        }

        $users = $query->paginate(20);

        return $this->paginated($users, 'Directory retrieved.', $users->getCollection()->map(fn($u) => [
            'ulid'                 => $u->ulid,
            'display_name'         => $u->profile_visibility === 'anonymous'
                ? ($u->anonymous_name ?: $u->display_first_name)
                : $u->first_name . ' ' . $u->last_name[0] . '.',
            'bio'                  => $u->profile_visibility === 'anonymous' ? $u->anonymous_bio : $u->bio,
            'profile_photo'        => $u->profile_photo ? Storage::url($u->profile_photo) : null,
            'account_type'         => $u->account_type,
            'business_name'        => $u->business_name,
            'is_verified_business'=> (bool) $u->is_verified_business,
            'available_locations' => $u->available_locations,
            'min_amount_aud'      => (float) $u->min_amount_aud,
            'max_amount_aud'      => (float) $u->max_amount_aud,
            'rating'              => $u->rating ? (float) $u->rating : null,
            'total_trades'        => $u->total_trades,
            'trust_score'         => $u->trust_score,
            'country'             => $u->profile_visibility === 'anonymous'
                ? ($u->anonymous_location ?: null)
                : $u->country?->name,
            'badges'              => $u->badges->where('is_visible', 1)->map(fn($b) => [
                'badge_key'  => $b->badge_key,
                'badge_icon' => $b->badge_icon,
            ])->values(),
        ]));
    }
}
