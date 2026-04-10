<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\NoticeboardPost;
use App\Models\PlatformAnnouncement;
use App\Models\PublicHoliday;
use App\Models\Referral;
use App\Models\OrderBoost;
use App\Models\PlatformDeposit;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ============================================================
// FILE: app/Http/Controllers/Admin/AdminNoticeboardController.php
// ============================================================
class AdminNoticeboardController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    public function index(): JsonResponse
    {
        $posts = NoticeboardPost::with('postedBy')->orderByDesc('created_at')->paginate(20);
        return $this->paginated($posts, 'Posts retrieved.', $posts->getCollection()->map(fn($p) => [
            'id'           => $p->id,
            'title'        => $p->title,
            'post_type'    => $p->post_type,
            'is_pinned'    => (bool) $p->is_pinned,
            'is_published' => (bool) $p->is_published,
            'view_count'   => $p->view_count,
            'published_at' => $p->published_at?->toIso8601String(),
            'expires_at'   => $p->expires_at?->toIso8601String(),
            'posted_by'    => $p->postedBy?->first_name . ' ' . $p->postedBy?->last_name,
            'created_at'   => $p->created_at->toIso8601String(),
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'      => ['required', 'string', 'max:200'],
            'content'    => ['required', 'string'],
            'post_type'  => ['required', 'in:announcement,tip,rate_update,warning,maintenance'],
            'is_pinned'  => ['nullable', 'boolean'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);

        $post = NoticeboardPost::create(array_merge($request->only(['title', 'content', 'post_type', 'expires_at']), [
            'is_pinned'    => $request->boolean('is_pinned'),
            'is_published' => true,
            'published_at' => now(),
            'posted_by'    => $request->user()->id,
        ]));

        $this->auditService->log('noticeboard.created', $request->user(), $post);
        return $this->created($post, 'Post created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = NoticeboardPost::findOrFail($id);
        $request->validate([
            'title'     => ['sometimes', 'string', 'max:200'],
            'content'   => ['sometimes', 'string'],
            'post_type' => ['sometimes', 'in:announcement,tip,rate_update,warning,maintenance'],
            'expires_at'=> ['nullable', 'date'],
        ]);
        $post->update($request->only(['title', 'content', 'post_type', 'expires_at']));
        $this->auditService->log('noticeboard.updated', $request->user(), $post);
        return $this->success($post, 'Post updated.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $post = NoticeboardPost::findOrFail($id);
        $this->auditService->log('noticeboard.deleted', $request->user(), $post);
        $post->delete();
        return $this->success(null, 'Post deleted.');
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $post = NoticeboardPost::findOrFail($id);
        $post->update(['is_published' => true, 'published_at' => now()]);
        return $this->success($post, 'Post published.');
    }

    public function pin(Request $request, int $id): JsonResponse
    {
        $post = NoticeboardPost::findOrFail($id);
        $post->is_pinned = ! $post->is_pinned;
        $post->save();
        return $this->success($post, $post->is_pinned ? 'Post pinned.' : 'Post unpinned.');
    }
}
