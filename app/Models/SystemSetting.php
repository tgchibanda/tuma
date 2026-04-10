<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    public $timestamps = false;

    protected $table = 'system_settings';

    protected $fillable = ['key', 'value', 'description', 'updated_by'];

    protected $casts = ['updated_at' => 'datetime'];

    /**
     * Get a setting value by key, with optional default.
     * Cached for 60 minutes to avoid repeated DB hits.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $cacheKey = 'system_setting_' . $key;

        return Cache::remember($cacheKey, now()->addMinutes(60), function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value and flush its cache.
     */
    public static function set(string $key, mixed $value, ?int $updatedBy = null): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'updated_by' => $updatedBy, 'updated_at' => now()]
        );
        Cache::forget('system_setting_' . $key);
    }

    /**
     * Flush all system setting caches.
     */
    public static function flushCache(): void
    {
        $keys = static::pluck('key');
        foreach ($keys as $key) {
            Cache::forget('system_setting_' . $key);
        }
    }
}
