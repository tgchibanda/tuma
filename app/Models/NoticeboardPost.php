<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NoticeboardPost extends Model {
    protected $fillable = ['title','content','post_type','is_pinned','is_published','published_at','expires_at','posted_by','view_count'];
    protected $casts = ['is_pinned' => 'boolean','is_published' => 'boolean','published_at' => 'datetime','expires_at' => 'datetime'];
    public function postedBy(): BelongsTo { return $this->belongsTo(User::class, 'posted_by'); }
}
