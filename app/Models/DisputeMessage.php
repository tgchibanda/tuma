<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisputeMessage extends Model {
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $fillable = ['dispute_id','sender_id','message','attachment','is_admin_message'];
    protected $casts = ['is_admin_message' => 'boolean','created_at' => 'datetime'];
    public function dispute(): BelongsTo { return $this->belongsTo(Dispute::class); }
    public function sender(): BelongsTo { return $this->belongsTo(User::class, 'sender_id'); }
}
