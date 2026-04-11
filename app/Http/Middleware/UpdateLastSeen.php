<?php
// FILE: app/Http/Middleware/UpdateLastSeen.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UpdateLastSeen
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if ($user) {
            // Throttle: only update DB if more than 5 minutes since last update
            $cacheKey = 'last_seen_' . $user->id;

            if (! Cache::has($cacheKey)) {
                $user->last_seen_at = now();
                $user->timestamps   = false;
                $user->save();
                $user->timestamps   = true;

                Cache::put($cacheKey, true, now()->addMinutes(5));
            }
        }

        return $next($request);
    }
}
