<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\LoginActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    use ApiResponse;

    /**
     * List the authenticated user's login activity.
     * GET /api/v1/auth/sessions
     *
     * Returns the last 30 login events with device/location info.
     */
    public function index(Request $request): JsonResponse
    {
        $sessions = LoginActivity::where('user_id', $request->user()->id)
            ->orderByDesc('login_at')
            ->limit(30)
            ->get()
            ->map(fn($s) => [
                'id'              => $s->id,
                'ip_address'      => $s->ip_address,
                'device_type'     => $s->device_type,
                'location_country'=> $s->location_country,
                'location_city'   => $s->location_city,
                'is_new_device'   => (bool) $s->is_new_device,
                'login_at'        => $s->login_at,
                'login_at_human'  => $s->login_at->diffForHumans(),
            ]);

        return $this->success($sessions, 'Login activity retrieved.');
    }

    /**
     * Revoke all active tokens (log out all devices).
     * DELETE /api/v1/auth/sessions
     */
    public function destroyAll(Request $request): JsonResponse
    {
        $user = $request->user();

        // Delete all tokens — logs user out everywhere
        $count = $user->tokens()->count();
        $user->tokens()->delete();

        return $this->success(
            ['sessions_revoked' => $count],
            'All sessions have been revoked. You have been logged out of all devices.'
        );
    }
}
