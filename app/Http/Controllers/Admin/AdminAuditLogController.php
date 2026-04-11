<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    use ApiResponse;

    /**
     * List audit logs — paginated, filterable.
     * GET /api/v1/admin/audit-logs
     * Filters: user_id, action, risk_flag, date_from, date_to
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user')
            ->orderByDesc('created_at');

        if ($request->filled('user_id'))   $query->where('user_id', $request->user_id);
        if ($request->filled('action'))    $query->where('action', 'like', '%' . $request->action . '%');
        if ($request->filled('risk_only')) $query->whereNotNull('risk_flag');
        if ($request->filled('date_from')) $query->where('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->where('created_at', '<=', $request->date_to . ' 23:59:59');

        $logs = $query->paginate(30);

        return $this->paginated($logs, 'Audit logs retrieved.', $logs->getCollection()->map(fn($l) => [
            'id'         => $l->id,
            'action'     => $l->action,
            'model_type' => $l->model_type ? class_basename($l->model_type) : null,
            'model_id'   => $l->model_id,
            'old_values' => $l->old_values,
            'new_values' => $l->new_values,
            'ip_address' => $l->ip_address,
            'risk_flag'  => $l->risk_flag,
            'user'       => $l->user ? [
                'id'    => $l->user->id,
                'name'  => $l->user->first_name . ' ' . $l->user->last_name,
                'email' => $l->user->email,
                'role'  => $l->user->role,
            ] : null,
            'created_at' => $l->created_at->toIso8601String(),
        ]));
    }
}
