<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformAnnouncement extends Model {
    protected $fillable = ['title','message','announcement_type','show_on_landing','show_on_dashboard','show_from','show_until','is_dismissible','created_by'];
    protected $casts = ['show_on_landing' => 'boolean','show_on_dashboard' => 'boolean','is_dismissible' => 'boolean','show_from' => 'datetime','show_until' => 'datetime'];
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function scopeActive($query) { return $query->where('show_from','<=',now())->where(fn($q) => $q->whereNull('show_until')->orWhere('show_until','>',now())); }
}
