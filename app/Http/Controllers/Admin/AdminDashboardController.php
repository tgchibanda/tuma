<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Dispute;
use App\Models\PlatformDeposit;
use App\Models\SwapMatch;
use App\Models\SwapOrder;
use App\Models\User;
use App\Models\UserReport;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get dashboard summary statistics.
     * GET /api/v1/admin/dashboard
     */
    public function index(): JsonResponse
    {
        // ── User Stats ─────────────────────────────────────────────────────
        $totalUsers        = User::where('role', 'user')->count();
        $activeUsers       = User::where('role', 'user')->where('account_status', 'active')->count();
        $pendingKyc        = User::where('kyc_status', 'submitted')->count();
        $newUsersToday     = User::where('role', 'user')->whereDate('created_at', today())->count();
        $newUsersThisWeek  = User::where('role', 'user')->where('created_at', '>=', now()->startOfWeek())->count();

        // ── Order Stats ────────────────────────────────────────────────────
        $openOrders        = SwapOrder::where('status', 'open')->count();
        $ordersToday       = SwapOrder::whereDate('created_at', today())->count();

        // ── Match Stats ────────────────────────────────────────────────────
        $activeMatches     = SwapMatch::whereNotIn('status', ['completed', 'cancelled', 'refunded'])->count();
        $completedToday    = SwapMatch::where('status', 'completed')->whereDate('completed_at', today())->count();
        $completedThisMonth= SwapMatch::where('status', 'completed')
            ->where('completed_at', '>=', now()->startOfMonth())->count();

        // ── Volume Stats ───────────────────────────────────────────────────
        $volumeToday = SwapMatch::where('status', 'completed')
            ->whereDate('completed_at', today())
            ->sum('agreed_aud');

        $volumeThisMonth = SwapMatch::where('status', 'completed')
            ->where('completed_at', '>=', now()->startOfMonth())
            ->sum('agreed_aud');

        $volumeAllTime = SwapMatch::where('status', 'completed')->sum('agreed_aud');

        // ── Pending Actions Queue ──────────────────────────────────────────
        $pendingDeposits     = PlatformDeposit::where('status', 'pending')->count();
        $depositUploaded     = SwapMatch::where('status', 'deposit_uploaded')->count();
        $riskDepositUploaded = SwapMatch::where('status', 'risk_deposit_uploaded')->count();
        $readyToRelease      = SwapMatch::where('status', 'confirmed')->count();
        $riskReadyToRelease  = SwapMatch::where('status', 'risk_deposit_verified')->count();
        $openDisputes        = Dispute::where('status', 'open')->count();
        $underReviewDisputes = Dispute::where('status', 'under_review')->count();
        $pendingReports      = UserReport::where('status', 'pending')->count();

        // ── Risk Flags ─────────────────────────────────────────────────────
        $riskFlaggedToday = AuditLog::whereNotNull('risk_flag')
            ->whereDate('created_at', today())
            ->count();

        // ── Fee Revenue ────────────────────────────────────────────────────
        $feeRevenueThisMonth = SwapMatch::where('status', 'completed')
            ->where('completed_at', '>=', now()->startOfMonth())
            ->sum('platform_fee_aud');

        $feeRevenueAllTime = SwapMatch::where('status', 'completed')->sum('platform_fee_aud');

        // ── Match Status Breakdown ─────────────────────────────────────────
        $matchStatusBreakdown = SwapMatch::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // ── Recent Activity Feed ───────────────────────────────────────────
        $recentMatches = SwapMatch::with(['sendOrder.user', 'receiveOrder.user'])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get()
            ->map(fn($m) => [
                'ulid'       => $m->ulid,
                'status'     => $m->status,
                'agreed_aud' => (float) $m->agreed_aud,
                'updated_at' => $m->updated_at->diffForHumans(),
            ]);

        return $this->success([
            'users' => [
                'total'         => $totalUsers,
                'active'        => $activeUsers,
                'pending_kyc'   => $pendingKyc,
                'new_today'     => $newUsersToday,
                'new_this_week' => $newUsersThisWeek,
            ],
            'orders' => [
                'open'       => $openOrders,
                'today'      => $ordersToday,
            ],
            'matches' => [
                'active'           => $activeMatches,
                'completed_today'  => $completedToday,
                'completed_month'  => $completedThisMonth,
                'status_breakdown' => $matchStatusBreakdown,
            ],
            'volume' => [
                'today_aud'       => (float) $volumeToday,
                'this_month_aud'  => (float) $volumeThisMonth,
                'all_time_aud'    => (float) $volumeAllTime,
            ],
            'revenue' => [
                'this_month_aud' => (float) $feeRevenueThisMonth,
                'all_time_aud'   => (float) $feeRevenueAllTime,
            ],
            'pending_actions' => [
                'deposits_to_verify'     => $depositUploaded + $riskDepositUploaded,
                'funds_to_release'       => $readyToRelease + $riskReadyToRelease,
                'open_disputes'          => $openDisputes,
                'disputes_under_review'  => $underReviewDisputes,
                'pending_kyc'            => $pendingKyc,
                'pending_reports'        => $pendingReports,
                'total_urgent'           => $depositUploaded + $riskDepositUploaded + $readyToRelease + $openDisputes,
            ],
            'risk' => [
                'flagged_today' => $riskFlaggedToday,
            ],
            'recent_matches' => $recentMatches,
        ], 'Dashboard stats retrieved.');
    }
}
