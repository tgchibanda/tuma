<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// ============================================================
// FILE: app/Models/DisputeMessage.php
// ============================================================
class DisputeMessage extends Model
{
    public $timestamps = false;
    protected $table = 'dispute_messages';
    protected $fillable = ['dispute_id','sender_id','message','attachment','is_admin_message'];
    protected $casts    = ['created_at' => 'datetime', 'is_admin_message' => 'boolean'];

    public function dispute() { return $this->belongsTo(Dispute::class); }
    public function sender()  { return $this->belongsTo(User::class, 'sender_id'); }
}
