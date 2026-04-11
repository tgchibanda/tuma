<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\NoticeboardPost;
use Illuminate\Http\JsonResponse;

class NoticeboardController extends Controller
{
    use ApiResponse;

    /**
     * Public noticeboard — published, not expired, pinned first.
     * GET /api/v1/noticeboard
     */
    public function index(): JsonResponse
    {
        $posts = NoticeboardPost::where('is_published', 1)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->paginate(10);

        return $this->paginated($posts, 'Posts retrieved.', $posts->getCollection()->map(fn($p) => [
            'id'           => $p->id,
            'title'        => $p->title,
            'content'      => $p->content,
            'post_type'    => $p->post_type,
            'is_pinned'    => (bool) $p->is_pinned,
            'published_at' => $p->published_at?->toIso8601String(),
            'expires_at'   => $p->expires_at?->toIso8601String(),
        ]));
    }
}
