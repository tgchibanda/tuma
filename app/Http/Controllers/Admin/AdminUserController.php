<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Models\UserDocument;
use App\Services\AuditService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuditService $auditService,
        protected NotificationService $notificationService
    ) {}

    /**
     * List all users with search and filters.
     * GET /api/v1/admin/users
     * Filters: search, kyc_status, account_status, account_type, country_id, page
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'user')
            ->with(['country'])
            ->orderByDesc('created_at');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%{$s}%")
                  ->orWhere('last_name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%")
                  ->orWhere('ulid', $s);
            });
        }

        if ($request->filled('kyc_status')) {
            $query->where('kyc_status', $request->kyc_status);
        }
        if ($request->filled('account_status')) {
            $query->where('account_status', $request->account_status);
        }
        if ($request->filled('account_type')) {
            $query->where('account_type', $request->account_type);
        }
        if ($request->filled('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        if ($request->filled('always_available')) {
            $query->where('always_available', (bool) $request->always_available);
        }

        $users = $query->paginate(20);

        return $this->paginated($users, 'Users retrieved.', $users->getCollection()->map(
            fn($u) => $this->formatUserSummary($u)
        ));
    }

    /**
     * Get full user detail: profile, KYC docs, trade history, ratings, login activity.
     * GET /api/v1/admin/users/{id}
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with([
            'country',
            'documents.reviewer',
            'bankAccounts',
            'badges',
            'loginActivity' => fn($q) => $q->latest('login_at')->limit(10),
            'reports',
        ])->findOrFail($id);

        // Recent trades
        $recentMatches = \App\Models\SwapMatch::where(function ($q) use ($user) {
            $q->whereHas('sendOrder', fn($q2) => $q2->where('user_id', $user->id))
              ->orWhereHas('receiveOrder', fn($q2) => $q2->where('user_id', $user->id));
        })->orderByDesc('updated_at')->limit(10)->get();

        // Ratings received
        $reviews = \App\Models\UserReview::where('reviewed_user_id', $user->id)
            ->with('reviewer')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return $this->success([
            'user'            => $this->formatUserDetail($user),
            'documents'       => $user->documents->map(fn($d) => [
                'id'                => $d->id,
                'document_type'     => $d->document_type,
                'status'            => $d->status,
                'rejection_reason'  => $d->rejection_reason,
                'reviewed_at'       => $d->reviewed_at?->toIso8601String(),
                'created_at'        => $d->created_at->toIso8601String(),
                'file_url'          => route('admin.document', ['id' => $d->id]),
            ]),
            'bank_accounts'   => $user->bankAccounts->map(fn($b) => [
                'id'             => $b->id,
                'bank_name'      => $b->bank_name,
                'account_name'   => $b->account_name,
                'account_number' => substr($b->account_number, -4),
                'bsb_code'       => $b->bsb_code,
                'is_primary'     => (bool) $b->is_primary,
                'is_verified'    => (bool) $b->is_verified,
            ]),
            'recent_matches'  => $recentMatches->map(fn($m) => [
                'ulid'       => $m->ulid,
                'status'     => $m->status,
                'agreed_aud' => (float) $m->agreed_aud,
                'agreed_usd' => (float) $m->agreed_usd,
                'created_at' => $m->created_at->toIso8601String(),
            ]),
            'reviews'         => $reviews->map(fn($r) => [
                'score'        => $r->score,
                'review_text'  => $r->review_text,
                'reviewer'     => $r->reviewer->display_first_name,
                'created_at'   => $r->created_at->toIso8601String(),
            ]),
            'login_activity'  => $user->loginActivity->map(fn($l) => [
                'ip_address'   => $l->ip_address,
                'device_type'  => $l->device_type,
                'location'     => trim(($l->location_city ?? '') . ' ' . ($l->location_country ?? '')),
                'is_new_device'=> (bool) $l->is_new_device,
                'login_at'     => $l->login_at->toIso8601String(),
            ]),
            'badges'          => $user->badges->map(fn($b) => [
                'badge_key'  => $b->badge_key,
                'badge_name' => $b->badge_name,
                'badge_icon' => $b->badge_icon,
                'earned_at'  => $b->earned_at->toIso8601String(),
            ]),
            'reports'         => $user->reports->count(),
        ], 'User retrieved.');
    }

    /**
     * Approve user KYC.
     * PUT /api/v1/admin/users/{id}/kyc/approve
     */
    public function approveKyc(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $old  = $user->kyc_status;

        $user->kyc_status      = User::KYC_APPROVED;
        $user->kyc_reviewed_at = now();
        $user->save();

        // Approve all pending documents
        UserDocument::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update(['status' => 'approved', 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);

        $this->notificationService->notify(
            $user,
            new \App\Notifications\KycApprovedNotification($user),
            ['email', 'inapp']
        );

        $this->auditService->log('kyc.approved', $request->user(), $user, ['kyc_status' => $old], ['kyc_status' => 'approved']);

        return $this->success($this->formatUserSummary($user), 'KYC approved.');
    }

    /**
     * Reject user KYC with reason.
     * PUT /api/v1/admin/users/{id}/kyc/reject
     */
    public function rejectKyc(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => ['required', 'string', 'min:10', 'max:500']]);

        $user = User::findOrFail($id);
        $old  = $user->kyc_status;

        $user->kyc_status      = User::KYC_REJECTED;
        $user->kyc_reviewed_at = now();
        $user->save();

        // Reject all pending documents with reason
        UserDocument::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update([
                'status'           => 'rejected',
                'rejection_reason' => $request->reason,
                'reviewed_by'      => $request->user()->id,
                'reviewed_at'      => now(),
            ]);

        $this->notificationService->notify(
            $user,
            new \App\Notifications\KycRejectedNotification($user, $request->reason),
            ['email', 'inapp']
        );

        $this->auditService->log('kyc.rejected', $request->user(), $user, ['kyc_status' => $old], ['kyc_status' => 'rejected', 'reason' => $request->reason]);

        return $this->success($this->formatUserSummary($user), 'KYC rejected.');
    }

    /**
     * Suspend a user account.
     * PUT /api/v1/admin/users/{id}/suspend
     */
    public function suspend(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'reason'       => ['required', 'string', 'min:10', 'max:500'],
            'until'        => ['nullable', 'date', 'after:now'],
        ]);

        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return $this->error('Cannot suspend an admin account.', 422);
        }

        $old = $user->account_status;
        $user->account_status          = User::STATUS_SUSPENDED;
        $user->suspension_reason       = $request->reason;
        $user->account_suspended_until = $request->until ? \Carbon\Carbon::parse($request->until) : null;
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        $this->auditService->log('user.suspended', $request->user(), $user, ['status' => $old], ['status' => 'suspended', 'reason' => $request->reason]);

        return $this->success($this->formatUserSummary($user), 'User suspended.');
    }

    /**
     * Unsuspend a user account.
     * PUT /api/v1/admin/users/{id}/unsuspend
     */
    public function unsuspend(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $old  = $user->account_status;

        $user->account_status          = User::STATUS_ACTIVE;
        $user->suspension_reason       = null;
        $user->account_suspended_until = null;
        $user->save();

        $this->auditService->log('user.unsuspended', $request->user(), $user, ['status' => $old], ['status' => 'active']);

        return $this->success($this->formatUserSummary($user), 'User unsuspended.');
    }

    /**
     * Permanently ban a user.
     * PUT /api/v1/admin/users/{id}/ban
     */
    public function ban(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => ['required', 'string', 'min:10', 'max:500']]);

        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return $this->error('Cannot ban an admin account.', 422);
        }

        $old = $user->account_status;
        $user->account_status    = User::STATUS_BANNED;
        $user->suspension_reason = $request->reason;
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        $this->auditService->log('user.banned', $request->user(), $user, ['status' => $old], ['status' => 'banned', 'reason' => $request->reason]);

        return $this->success($this->formatUserSummary($user), 'User banned.');
    }

    /**
     * Toggle verified business status.
     * PUT /api/v1/admin/users/{id}/verify-business
     */
    public function verifyBusiness(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->is_verified_business = ! $user->is_verified_business;
        $user->save();

        $action = $user->is_verified_business ? 'Business verified.' : 'Business verification removed.';
        $this->auditService->log('user.business_verified', $request->user(), $user);

        return $this->success($this->formatUserSummary($user), $action);
    }

    /**
     * Toggle always_available (directory listing) for a user.
     * PUT /api/v1/admin/users/{id}/toggle-available
     */
    public function toggleAvailable(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->always_available = ! $user->always_available;
        $user->save();

        $action = $user->always_available ? 'User added to directory.' : 'User removed from directory.';
        $this->auditService->log('user.availability_toggled', $request->user(), $user);

        return $this->success($this->formatUserSummary($user), $action);
    }

    // ── Private formatters ─────────────────────────────────────────────────────

    private function formatUserSummary(User $user): array
    {
        return [
            'id'                   => $user->id,
            'ulid'                 => $user->ulid,
            'first_name'           => $user->first_name,
            'last_name'            => $user->last_name,
            'email'                => $user->email,
            'phone'                => $user->phone,
            'kyc_status'           => $user->kyc_status,
            'account_status'       => $user->account_status,
            'account_type'         => $user->account_type,
            'is_verified_business' => (bool) $user->is_verified_business,
            'always_available'     => (bool) $user->always_available,
            'total_trades'         => $user->total_trades,
            'successful_trades'    => $user->successful_trades,
            'rating'               => $user->rating,
            'trust_score'          => $user->trust_score,
            'report_count'         => $user->report_count,
            'country'              => $user->country?->name,
            'two_fa_enabled'       => (bool) $user->two_fa_enabled,
            'email_verified'       => ! is_null($user->email_verified_at),
            'phone_verified'       => ! is_null($user->phone_verified_at),
            'last_seen'            => $user->last_seen_human,
            'created_at'           => $user->created_at->toIso8601String(),
        ];
    }

    private function formatUserDetail(User $user): array
    {
        return array_merge($this->formatUserSummary($user), [
            'suspension_reason'       => $user->suspension_reason,
            'account_suspended_until' => $user->account_suspended_until?->toIso8601String(),
            'kyc_reviewed_at'         => $user->kyc_reviewed_at?->toIso8601String(),
            'referral_code'           => $user->referral_code,
            'referral_count'          => $user->referral_count,
            'referral_earnings_aud'   => (float) $user->referral_earnings_aud,
            'onboarding_completed'    => (bool) $user->onboarding_completed,
            'pin_set'                 => ! is_null($user->transaction_pin),
            'last_login_at'           => $user->last_login_at?->toIso8601String(),
            'business_name'           => $user->business_name,
            'available_locations'     => $user->available_locations,
            'min_amount_aud'          => (float) $user->min_amount_aud,
            'max_amount_aud'          => (float) $user->max_amount_aud,
        ]);
    }
}
