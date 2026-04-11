<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionMessage extends Model {
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $fillable = ['swap_match_id','sender_id','message','attachment','is_read','read_at'];
    protected $casts = ['is_read' => 'boolean','read_at' => 'datetime','created_at' => 'datetime'];
    public function match(): BelongsTo { return $this->belongsTo(SwapMatch::class, 'swap_match_id'); }
    public function sender(): BelongsTo { return $this->belongsTo(User::class, 'sender_id'); }
}
