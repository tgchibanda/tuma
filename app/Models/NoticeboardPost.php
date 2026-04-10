<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoticeboardPost extends Model
{
    protected $fillable = ['title', 'content', 'post_type', 'is_pinned', 'is_published', 'published_at', 'expires_at', 'posted_by', 'view_count'];
    protected $casts = ['is_pinned' => 'boolean', 'is_published' => 'boolean', 'published_at' => 'datetime', 'expires_at' => 'datetime'];
    public function author()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
    public function scopePublished($q)
    {
        return $q->where('is_published', 1)->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))->orderByDesc('is_pinned')->orderByDesc('published_at');
    }
}