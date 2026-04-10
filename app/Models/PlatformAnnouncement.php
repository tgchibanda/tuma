<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformAnnouncement extends Model
{
    protected $fillable = ['title', 'message', 'announcement_type', 'show_on_landing', 'show_on_dashboard', 'show_from', 'show_until', 'is_dismissible', 'created_by'];
    protected $casts = ['show_on_landing' => 'boolean', 'show_on_dashboard' => 'boolean', 'show_from' => 'datetime', 'show_until' => 'datetime', 'is_dismissible' => 'boolean'];
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function scopeActive($q)
    {
        return $q->where('show_from', '<=', now())->where(fn($q) => $q->whereNull('show_until')->orWhere('show_until', '>', now()));
    }
    public function scopeForDashboard($q)
    {
        return $q->active()->where('show_on_dashboard', 1);
    }
    public function scopeForLanding($q)
    {
        return $q->active()->where('show_on_landing', 1);
    }
}