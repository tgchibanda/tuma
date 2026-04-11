<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocument extends Model {
    protected $fillable = ['user_id','document_type','file_path','original_filename','mime_type','status','rejection_reason','reviewed_by','reviewed_at'];
    protected $casts = ['reviewed_at' => 'datetime'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by'); }
}
