<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * Admin login — separate from user login.
     * POST /api/v1/admin/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower($request->email))
            ->where('role', 'admin')
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('Invalid admin credentials.', 401);
        }

        if ($user->account_status !== User::STATUS_ACTIVE) {
            return $this->error('This admin account is inactive.', 403);
        }

        $user->tokens()->where('name', 'admin-auth')->delete();
        $token = $user->createToken('admin-auth')->plainTextToken;

        $user->last_login_at = now();
        $user->save();

        $this->auditService->log('admin.login', $user, $user);

        return $this->success([
            'token' => $token,
            'admin' => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'role'       => $user->role,
            ],
        ], 'Admin login successful.');
    }

    /**
     * Admin logout.
     * POST /api/v1/admin/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $this->auditService->log('admin.logout', $request->user(), $request->user());
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logged out.');
    }
}
