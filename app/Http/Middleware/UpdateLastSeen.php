<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeen
{
    /**
     * Update the authenticated user's last_seen_at timestamp.
     * Throttled: only updates once every 5 minutes per user
     * to avoid hammering the database on every request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $user    = $request->user();
            $cacheKey = 'last_seen_updated_' . $user->id;

            // Only update if not updated in the last 5 minutes
            if (! Cache::has($cacheKey)) {
                $user->timestamps = false; // Don't touch updated_at
                $user->last_seen_at = now();
                $user->save();
                $user->timestamps = true;

                // Lock for 5 minutes
                Cache::put($cacheKey, true, now()->addMinutes(5));
            }
        }

        return $next($request);
    }
}
