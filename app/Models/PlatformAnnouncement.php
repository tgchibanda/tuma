<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformAnnouncement extends Model
{
    const TYPE_INFO        = 'info';
    const TYPE_WARNING     = 'warning';
    const TYPE_MAINTENANCE = 'maintenance';
    const TYPE_FEATURE     = 'feature';
    const TYPE_RATE        = 'rate';

    protected $table = 'platform_announcements';

    protected $fillable = [
        'title', 'message', 'announcement_type',
        'show_on_landing', 'show_on_dashboard',
        'show_from', 'show_until', 'is_dismissible', 'created_by',
    ];

    protected $casts = [
        'show_on_landing'   => 'boolean',
        'show_on_dashboard' => 'boolean',
        'is_dismissible'    => 'boolean',
        'show_from'         => 'datetime',
        'show_until'        => 'datetime',
    ];

    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }

    public function scopeCurrentlyVisible($query)
    {
        return $query->where('show_from', '<=', now())
                     ->where(function ($q) {
                         $q->whereNull('show_until')->orWhere('show_until', '>', now());
                     });
    }

    public function scopeForDashboard($query)
    {
        return $query->currentlyVisible()->where('show_on_dashboard', true);
    }

    public function scopeForLanding($query)
    {
        return $query->currentlyVisible()->where('show_on_landing', true);
    }
}
