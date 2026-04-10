<?php

/*
|--------------------------------------------------------------------------
| app/Http/Kernel.php — Required additions
|--------------------------------------------------------------------------
|
| Add the following to your existing Kernel.php file.
| DO NOT replace the whole file — only add the marked sections.
|
*/

// ── 1. In $middlewareAliases (or $routeMiddleware in older Laravel 10) ──────
// Add these entries to the existing $middlewareAliases array:

//    'admin'           => \App\Http\Middleware\AdminMiddleware::class,
//    'update.last.seen'=> \App\Http\Middleware\UpdateLastSeen::class,

// ── 2. In $middlewarePriority — no changes needed ───────────────────────────

// ── 3. Rate limiters — add to App\Providers\RouteServiceProvider::boot() ────
// (or in a dedicated AppServiceProvider if preferred)

/*
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

RateLimiter::for('register', function (Request $request) {
    return Limit::perMinute(3)->by($request->ip());
});

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('uploads', function (Request $request) {
    return Limit::perHour(10)->by($request->user()?->id ?: $request->ip());
});
*/

// ── Full Kernel.php for reference ────────────────────────────────────────────

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $middlewareAliases = [
        'auth'              => \App\Http\Middleware\Authenticate::class,
        'auth.basic'        => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'auth.session'      => \Illuminate\Session\Middleware\AuthenticateSession::class,
        'cache.headers'     => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can'               => \Illuminate\Auth\Middleware\Authorize::class,
        'guest'             => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm'  => \Illuminate\Auth\Middleware\RequirePassword::class,
        'precognitive'      => \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        'signed'            => \App\Http\Middleware\ValidateSignature::class,
        'throttle'          => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified'          => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        // ── TuMa custom middleware ──
        'admin'             => \App\Http\Middleware\AdminMiddleware::class,
        'update.last.seen'  => \App\Http\Middleware\UpdateLastSeen::class,
    ];
}
