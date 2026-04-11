<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditService
{
    /**
     * Log an admin or system action to the audit trail.
     *
     * @param string     $action    e.g. 'kyc.approved', 'match.verified', 'rate.updated'
     * @param User|null  $actor     The user who performed the action (null for system jobs)
     * @param Model|null $subject   The model being acted upon
     * @param array      $oldValues Values before the change
     * @param array      $newValues Values after the change
     */
    public function log(
        string $action,
        ?User $actor,
        ?Model $subject = null,
        array $oldValues = [],
        array $newValues = []
    ): void {
        AuditLog::create([
            'user_id'    => $actor?->id,
            'action'     => $action,
            'model_type' => $subject ? get_class($subject) : null,
            'model_id'   => $subject?->getKey(),
            'old_values' => empty($oldValues) ? null : $oldValues,
            'new_values' => empty($newValues) ? null : $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'risk_flag'  => null,
        ]);
    }

    /**
     * Log a fraud/risk flag to the audit trail.
     */
    public function flag(
        string $flagType,
        ?User $actor,
        ?Model $subject = null,
        string $note = ''
    ): void {
        AuditLog::create([
            'user_id'    => $actor?->id,
            'action'     => 'risk.flag',
            'model_type' => $subject ? get_class($subject) : null,
            'model_id'   => $subject?->getKey(),
            'old_values' => null,
            'new_values' => ['note' => $note],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'risk_flag'  => $flagType,
        ]);
    }
}
