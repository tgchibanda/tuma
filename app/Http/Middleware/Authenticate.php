<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * This is an API-only application — there is no 'login' route.
     * Always return null so Laravel issues a 401 JSON response instead of
     * attempting to redirect to route('login') which does not exist.
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}
