<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustedContact extends Model {
    public $timestamps = false;
    protected $fillable = ['user_id','trusted_user_id','added_at','note'];
    protected $casts = ['added_at' => 'datetime'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function trustedUser(): BelongsTo { return $this->belongsTo(User::class, 'trusted_user_id'); }
}
