<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeDiscount extends Model {
    protected $fillable = ['user_id','source','discount_percent','max_uses','uses_remaining','expires_at','applied_to_match_id'];
    protected $casts = ['discount_percent' => 'decimal:2','expires_at' => 'datetime'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
