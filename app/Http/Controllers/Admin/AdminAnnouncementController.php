<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\PlatformAnnouncement;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAnnouncementController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    public function index(): JsonResponse
    {
        $announcements = PlatformAnnouncement::orderByDesc('created_at')->paginate(20);
        return $this->paginated($announcements, 'Announcements retrieved.', $announcements->getCollection()->map(fn($a) => [
            'id'                => $a->id,
            'title'             => $a->title,
            'announcement_type' => $a->announcement_type,
            'show_on_landing'   => (bool) $a->show_on_landing,
            'show_on_dashboard' => (bool) $a->show_on_dashboard,
            'is_dismissible'    => (bool) $a->is_dismissible,
            'show_from'         => $a->show_from->toIso8601String(),
            'show_until'        => $a->show_until?->toIso8601String(),
            'created_at'        => $a->created_at->toIso8601String(),
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'             => ['required', 'string', 'max:200'],
            'message'           => ['required', 'string'],
            'announcement_type' => ['required', 'in:info,warning,maintenance,feature,rate'],
            'show_on_landing'   => ['nullable', 'boolean'],
            'show_on_dashboard' => ['nullable', 'boolean'],
            'is_dismissible'    => ['nullable', 'boolean'],
            'show_from'         => ['nullable', 'date'],
            'show_until'        => ['nullable', 'date', 'after:show_from'],
        ]);

        $announcement = PlatformAnnouncement::create(array_merge(
            $request->only(['title', 'message', 'announcement_type', 'show_until']),
            [
                'show_on_landing'   => $request->boolean('show_on_landing'),
                'show_on_dashboard' => $request->boolean('show_on_dashboard', true),
                'is_dismissible'    => $request->boolean('is_dismissible', true),
                'show_from'         => $request->show_from ?? now(),
                'created_by'        => $request->user()->id,
            ]
        ));

        $this->auditService->log('announcement.created', $request->user(), $announcement);
        return $this->created($announcement, 'Announcement created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $announcement = PlatformAnnouncement::findOrFail($id);
        $announcement->update($request->only(['title', 'message', 'announcement_type', 'show_on_landing', 'show_on_dashboard', 'is_dismissible', 'show_from', 'show_until']));
        $this->auditService->log('announcement.updated', $request->user(), $announcement);
        return $this->success($announcement, 'Announcement updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $announcement = PlatformAnnouncement::findOrFail($id);
        $this->auditService->log('announcement.deleted', $request->user(), $announcement);
        $announcement->delete();
        return $this->success(null, 'Announcement deleted.');
    }
}
