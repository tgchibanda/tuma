<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashDelivery extends Model {
    protected $fillable = ['swap_match_id','deliverer_user_id','amount_usd','recipient_name','recipient_phone','delivery_location_id','delivery_address','recipient_id_photo','recipient_id_type','handover_amount_photo','combined_verification_photo','verification_note','proof_uploaded_at','usd_denominations','estimated_delivery_at','actual_delivery_at','delivery_duration_minutes','status','confirmed_by','confirmed_at','notes'];
    protected $casts = ['amount_usd' => 'decimal:2','proof_uploaded_at' => 'datetime','confirmed_at' => 'datetime','estimated_delivery_at' => 'datetime','actual_delivery_at' => 'datetime','usd_denominations' => 'array'];
    public function swapMatch(): BelongsTo { return $this->belongsTo(SwapMatch::class); }
    public function deliveryLocation(): BelongsTo { return $this->belongsTo(DeliveryLocation::class); }
    public function confirmedBy(): BelongsTo { return $this->belongsTo(User::class, 'confirmed_by'); }
}
