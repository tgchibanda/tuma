<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Point email verification links to the Vue SPA frontend.
        // Uses config('app.url') which is always populated from APP_URL in .env.
        // The hash uses sha1($email) to match AuthController::verifyEmail().
        VerifyEmail::createUrlUsing(function ($notifiable) {
            $base = rtrim(config('app.url'), '/');
            $hash = sha1($notifiable->email);

            return $base . '/verify-email/' . $notifiable->id . '/' . $hash;
        });
    }
}