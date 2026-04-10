<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Models\UserReport;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    public function index(Request $request): JsonResponse
    {
        $query = UserReport::with(['reporter', 'reportedUser', 'swapMatch'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) $query->where('status', $request->status);

        $reports = $query->paginate(20);

        return $this->paginated($reports, 'Reports retrieved.', $reports->getCollection()->map(fn($r) => [
            'id'              => $r->id,
            'status'          => $r->status,
            'reason'          => $r->reason,
            'details'         => $r->details,
            'created_at'      => $r->created_at->toIso8601String(),
            'reporter'        => ['id' => $r->reporter->id, 'name' => $r->reporter->first_name . ' ' . $r->reporter->last_name],
            'reported_user'   => ['id' => $r->reportedUser->id, 'name' => $r->reportedUser->first_name . ' ' . $r->reportedUser->last_name, 'report_count' => $r->reportedUser->report_count],
            'match_ulid'      => $r->swapMatch?->ulid,
        ]));
    }

    public function show(int $id): JsonResponse
    {
        $report = UserReport::with(['reporter', 'reportedUser', 'swapMatch', 'reviewedBy'])->findOrFail($id);

        return $this->success([
            'id'            => $report->id,
            'status'        => $report->status,
            'reason'        => $report->reason,
            'details'       => $report->details,
            'admin_notes'   => $report->admin_notes,
            'reviewed_at'   => $report->reviewed_at?->toIso8601String(),
            'reporter'      => ['id' => $report->reporter->id, 'name' => $report->reporter->first_name . ' ' . $report->reporter->last_name, 'email' => $report->reporter->email],
            'reported_user' => ['id' => $report->reportedUser->id, 'name' => $report->reportedUser->first_name . ' ' . $report->reportedUser->last_name, 'email' => $report->reportedUser->email, 'account_status' => $report->reportedUser->account_status, 'report_count' => $report->reportedUser->report_count],
            'match_ulid'    => $report->swapMatch?->ulid,
        ], 'Report retrieved.');
    }

    public function resolve(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'resolution' => ['required', 'in:reviewed,dismissed,actioned'],
            'notes'      => ['required', 'string', 'max:500'],
        ]);

        $report = UserReport::findOrFail($id);
        $report->update([
            'status'      => $request->resolution,
            'admin_notes' => $request->notes,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // If actioned, increment the reported user's report count
        if ($request->resolution === 'actioned') {
            User::where('id', $report->reported_user_id)->increment('report_count');
        }

        $this->auditService->log('report.resolved', $request->user(), $report);

        return $this->success(null, 'Report resolved.');
    }
}
