<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Log a significant action to the audit_logs table.
     *
     * @param string     $action     e.g. 'user.registered', 'match.deposit_verified'
     * @param User|null  $user       The user performing the action
     * @param Model|null $model      The model being acted upon
     * @param array      $oldValues  Previous state (for updates)
     * @param array      $newValues  New state (for creates/updates)
     * @param string|null $riskFlag  Optional fraud/risk flag
     */
    public function log(
        string  $action,
        ?User   $user   = null,
        ?Model  $model  = null,
        array   $oldValues = [],
        array   $newValues = [],
        ?string $riskFlag  = null
    ): void {
        try {
            AuditLog::create([
                'user_id'    => $user?->id,
                'action'     => $action,
                'model_type' => $model ? get_class($model) : null,
                'model_id'   => $model?->id,
                'old_values' => empty($oldValues) ? null : $oldValues,
                'new_values' => empty($newValues) ? null : $newValues,
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
                'risk_flag'  => $riskFlag,
            ]);
        } catch (\Throwable $e) {
            // Never let audit logging break the main request
            \Illuminate\Support\Facades\Log::error('AuditService failed: ' . $e->getMessage());
        }
    }

    /**
     * Log a fraud/risk event and flag it for admin review.
     */
    public function flag(string $action, ?User $user = null, ?Model $model = null, string $reason = ''): void
    {
        $this->log($action, $user, $model, [], [], $reason);
    }
}
