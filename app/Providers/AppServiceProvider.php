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
        // Customise the email verification link to point to the Vue frontend
        // rather than a Laravel Blade route (which doesn't exist in this SPA).
        // The hash uses sha1($email) to match the check in AuthController::verifyEmail().
        VerifyEmail::createUrlUsing(function ($notifiable) {
            $hash = sha1($notifiable->email);
            return rtrim(config('app.frontend_url'), '/') 
                . '/verify-email/' 
                . $notifiable->id 
                . '/' 
                . $hash;
        });
    }
}