<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoticeboardPost extends Model
{
    const TYPE_ANNOUNCEMENT = 'announcement';
    const TYPE_TIP          = 'tip';
    const TYPE_RATE_UPDATE  = 'rate_update';
    const TYPE_WARNING      = 'warning';
    const TYPE_MAINTENANCE  = 'maintenance';

    protected $table = 'noticeboard_posts';

    protected $fillable = [
        'title', 'content', 'post_type', 'is_pinned',
        'is_published', 'published_at', 'expires_at',
        'posted_by', 'view_count',
    ];

    protected $casts = [
        'is_pinned'    => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];

    public function postedBy() { return $this->belongsTo(User::class, 'posted_by'); }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                     });
    }

    public function scopePinned($query) { return $query->where('is_pinned', true); }

    public function scopeOrderedForDisplay($query)
    {
        return $query->orderByDesc('is_pinned')->orderByDesc('published_at');
    }
}
