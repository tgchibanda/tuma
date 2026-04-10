<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    public $timestamps = false;
    public $incrementing = true;
    protected $fillable = ['key', 'value', 'description', 'updated_by'];
    protected $casts = ['updated_at' => 'datetime'];
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting_{$key}", 300, fn() => optional(self::where('key', $key)->first())->value ?? $default);
    }
    public static function set(string $key, $value, int $updatedBy = null): void
    {
        self::updateOrCreate(['key' => $key], ['value' => $value, 'updated_by' => $updatedBy, 'updated_at' => now()]);
        Cache::forget("setting_{$key}");
    }
}
