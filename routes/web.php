<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| All requests that are not API routes get served the SPA shell.
| Vue Router handles all frontend routing client-side.
|
| API routes are defined in routes/api.php under the /api prefix.
|--------------------------------------------------------------------------
*/

// SPA shell — serves the blade view for ALL non-API routes
// The ^(?!api) pattern excludes the /api prefix so API routes are not caught here
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*')->name('spa');
