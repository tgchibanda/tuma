<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class RecurringOrder extends Model {
    protected $fillable = ['user_id','order_template_id','frequency','next_run_at','last_run_at','run_count','is_active','paused_at','pause_reason'];
    protected $casts = ['next_run_at' => 'datetime','last_run_at' => 'datetime','paused_at' => 'datetime','is_active' => 'boolean'];
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function orderTemplate(): BelongsTo { return $this->belongsTo(OrderTemplate::class); }
    public function scopeDue($query) { return $query->where('is_active',1)->whereNull('paused_at')->where('next_run_at','<=',now()); }
    public function calculateNextRunAt(): Carbon {
        return match($this->frequency) {
            'weekly'      => now()->addWeek(),
            'fortnightly' => now()->addWeeks(2),
            'monthly'     => now()->addMonth(),
            default       => now()->addMonth(),
        };
    }
}
