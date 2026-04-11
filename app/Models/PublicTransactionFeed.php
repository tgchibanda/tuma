<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PublicTransactionFeed extends Model {
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
    protected $fillable = ['swap_match_id','display_sender','display_receiver','amount_aud','amount_usd','delivery_location','completed_at','is_demo','is_visible'];
    protected $casts = ['amount_aud' => 'decimal:2','amount_usd' => 'decimal:2','completed_at' => 'datetime','is_demo' => 'boolean','is_visible' => 'boolean','created_at' => 'datetime'];
    public function scopeVisible($query) { return $query->where('is_visible', 1)->orderByDesc('completed_at'); }
}
