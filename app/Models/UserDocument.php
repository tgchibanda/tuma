<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ============================================================
// FILE: app/Models/UserDocument.php
// ============================================================
class UserDocument extends Model
{
    const STATUS_PENDING  = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    protected $table    = 'user_documents';
    protected $fillable = ['user_id','document_type','file_path','original_filename','mime_type','status','rejection_reason','reviewed_by','reviewed_at'];
    protected $casts    = ['reviewed_at' => 'datetime'];

    public function user()       { return $this->belongsTo(User::class); }
    public function reviewer()   { return $this->belongsTo(User::class, 'reviewed_by'); }
    public function scopePending($query)  { return $query->where('status', self::STATUS_PENDING); }
    public function scopeApproved($query) { return $query->where('status', self::STATUS_APPROVED); }
}
