<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SystemSetting;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * Get all system settings as key-value pairs.
     * GET /api/v1/admin/settings
     */
    public function index(): JsonResponse
    {
        $settings = SystemSetting::orderBy('key')->get()->mapWithKeys(fn($s) => [
            $s->key => [
                'value'       => $s->value,
                'description' => $s->description,
                'updated_at'  => $s->updated_at?->toIso8601String(),
            ],
        ]);

        return $this->success($settings, 'Settings retrieved.');
    }

    /**
     * Bulk update multiple settings at once.
     * PUT /api/v1/admin/settings
     * body: { key: value, key: value, ... }
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            '*' => ['nullable'],
        ]);

        // Protect read-only keys from being changed via API
        $readOnly = ['ulid', 'id'];
        $adminId  = $request->user()->id;
        $updated  = [];

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $readOnly)) continue;
            if (! is_string($key) || strlen($key) > 100) continue;

            $old = SystemSetting::get($key);
            SystemSetting::set($key, (string) $value, $adminId);
            $updated[$key] = $value;

            $this->auditService->log('setting.updated', $request->user(), null, [$key => $old], [$key => $value]);
        }

        // Flush all settings cache
        SystemSetting::flushCache();

        return $this->success(['updated_keys' => array_keys($updated)], count($updated) . ' setting(s) updated.');
    }
}
