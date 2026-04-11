<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBadge extends Model {
    public $timestamps = false;
    protected $fillable = ['user_id','badge_key','badge_name','badge_description','badge_icon','earned_at','is_visible'];
    protected $casts = ['earned_at' => 'datetime','is_visible' => 'boolean'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
